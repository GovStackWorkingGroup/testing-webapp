import { AllBBRequirements, BBRequirement, ComplianceAggregationListResult, ComplianceDbRepository, ComplianceReport, FormDetailsResults, StatusEnum, draftDataForRollback, ComplianceListFilters } from 'myTypes';
import { v4 as uuidv4 } from 'uuid';
import Compliance from '../schemas/compliance/compliance';
import mongoose from 'mongoose';
import { appConfig } from '../../config/index';
import { createAggregationPipeline } from '../pipelines/compliance/complianceListAggregation';
import { formDetailAggregationPipeline } from '../pipelines/compliance/formDetailAggregation';
import { softwareDetailAggregationPipeline } from '../pipelines/compliance/softwareDetailAggregation';
import BBRequirements from '../schemas/bbRequirements';
import { aggregationPipeline } from '../pipelines/compliance/AllbbRequirements';
import { bbRequirementsAggregationPipeline } from '../pipelines/compliance/bbRequirements';
import { validateRequirements } from '../schemas/compliance/complianceUtils';
import { uniqueBBsAggregationPipeline } from '../pipelines/compliance/uniqueBBsAggregationPipeline';
import { draftDetailAggregationPipeline } from '../pipelines/compliance/draftDetailAggregation';

const mongoComplianceRepository: ComplianceDbRepository = {
  async findAll() {
    try {
      return await Compliance.find();
    } catch (error) {
      throw new Error('Error fetching compliance records');
    }
  },

  async aggregateComplianceReports(limit: number, offset: number, filters: ComplianceListFilters, isAuthenticated: Boolean): Promise<ComplianceAggregationListResult> {
    try {
      const results = await Compliance.aggregate(createAggregationPipeline(limit, offset, filters, isAuthenticated)).exec();
      const reshapedResults = {
        count: results[0].totalSoftwareNames,
        data: results[0].records.reduce((accumulatedResult, currentItem) => {
          accumulatedResult[currentItem._id] = currentItem.records;
          return accumulatedResult;
        }, {})
      };

      return reshapedResults;
    } catch (error) {
      console.error("Root cause of aggregation error:", error);
      throw new Error('Error aggregating compliance reports');
    }
  },

  async getSoftwareComplianceDetail(softwareName: string) {
    try {
      const results = await Compliance.aggregate(softwareDetailAggregationPipeline(softwareName)).exec();
      return results;
    } catch (error) {
      console.error("Root cause of fetching software compliance details:", error);
      throw new Error('Error fetching software compliance details');
    }
  },

  async getFormDetail(formId: string): Promise<FormDetailsResults> {
    try {
      const results = await Compliance.aggregate(formDetailAggregationPipeline({ formId })).exec();
      return results[0];
    } catch (error) {
      console.error("Root cause of teching compliance form details");
      throw new Error('Error fetching compliance form details')
    }
  },

  async getDraftDetail(draftUuid: string): Promise<FormDetailsResults> {
    try {
      const results = await Compliance.aggregate(draftDetailAggregationPipeline(draftUuid)).exec();
      return results[0];
    } catch (error) {
      console.error("Root cause of teching compliance form details");
      throw new Error('Error fetching compliance form details')
    }
  },

  async createOrSubmitForm(draftData: Partial<ComplianceReport>): Promise<string> {
    try {

      const isDraft = draftData.status == StatusEnum.DRAFT;
      const uniqueId = isDraft ? uuidv4() : '';
      const expirationDate = isDraft ? new Date(Date.now() + appConfig.draftExpirationTime) : undefined;

      const newForm = new Compliance({
        ...draftData,
        uniqueId,
        expirationDate
      });

      await newForm.save();

      return uniqueId;
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        const missingFields = Object.keys(error.errors).join(', ');
        const errorMessage = `Missing required fields: ${missingFields}`;
        throw new Error(errorMessage);
      }
      throw new Error('Error creating compliance draft');
    }
  },

  async submitForm(uniqueId: string): Promise<{ success: boolean; errors: string[]; originalData: draftDataForRollback | undefined }> {
    const errors: string[] = [];
    const validationErrors: string[] = [];
    let originalData: draftDataForRollback | undefined;
    const form = await Compliance.findOne({ uniqueId });

    if (!form) {
      errors.push('Form not found');
    } else {
      if (form.status !== StatusEnum.DRAFT) {
        errors.push('Form is not in DRAFT status and cannot be submitted');
      }

      form.compliance.forEach((item) => {
        item.bbDetails.forEach(bbDetail => {
          // Validate interfaceCompliance requirements
          if (bbDetail.interfaceCompliance && bbDetail.interfaceCompliance.requirements) {
            const interfaceComplianceResult = validateRequirements(bbDetail.interfaceCompliance.requirements);
            if (!interfaceComplianceResult.isValid) {
              validationErrors.push(...interfaceComplianceResult.errors);
            }
          }
          // Validate combined crossCuttingRequirements and functionalRequirements
          const combinedRequirements = bbDetail.requirementSpecificationCompliance.crossCuttingRequirements.concat(bbDetail.requirementSpecificationCompliance.functionalRequirements);
          const combinedRequirementsResult = validateRequirements(combinedRequirements);
          if (!combinedRequirementsResult.isValid) {
            validationErrors.push(...combinedRequirementsResult.errors);
          }
        });
      });

      if (validationErrors.length > 0) {
        const validationError = new mongoose.Error.ValidationError();
        validationErrors.forEach((errMsg, index) => {
          const validatorError = new mongoose.Error.ValidatorError({
            message: errMsg,
            path: `\n${index}`, // Use a relevant field name or identifier
          });
          validationError.addError(`\n${index}`, validatorError);
        });
        throw validationError;
      }

      if (errors.length === 0) {
        // fetch bb keys
        let bbKeys: string[] = [];
        form.compliance.forEach(complianceItem => bbKeys.push(...Array.from(complianceItem.bbDetails.keys())));
        // save oryginal data for rollback
        originalData = {
          status: form.status,
          uniqueId: form.uniqueId,
          expirationDate: form.expirationDate,
          id: form._id,
          softwareName: form.softwareName,
          bbKeys: bbKeys
        };

        await Compliance.updateOne({ _id: form._id }, {
          $set: { status: StatusEnum.IN_REVIEW },
          $unset: { uniqueId: "", expirationDate: "" }
        });

        await form.save();
      }
    }

    return { success: errors.length === 0, errors, originalData };
  },

  async updateFormStatus(formId: string, newStatus: StatusEnum, updatedData): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    const form = await Compliance.findById(formId);

    if (!form) {
      errors.push('Form not found');
      return { success: false, errors };
    }

    if (form.status !== StatusEnum.IN_REVIEW) {
      errors.push('Form is not in IN_REVIEW status and cannot be updated');
      return { success: false, errors };
    }

    const statusUpdateResult = await Compliance.updateOne({ _id: form._id }, {
      $set: { status: newStatus }
    });

    // Check if status update was successful
    if (!statusUpdateResult || !statusUpdateResult.matchedCount) {
      console.error('Failed to update form status');
      errors.push('Failed to update form status');
      return { success: false, errors };
    }
    if (updatedData) {
      const formDataUpdateResult = await this.updateFormData(formId, updatedData);

      // Check if there were errors in updating data
      if (formDataUpdateResult.errors.length > 0) {
        // Rollback status update
        await Compliance.updateOne({ _id: form._id }, {
          $set: { status: StatusEnum.IN_REVIEW }
        });

        console.error('Error updating data, status rolled back to IN_REVIEW');
        errors.push(...formDataUpdateResult.errors);
        return { success: false, errors };
      }
    }

    return { success: true, errors };
  },

  async rollbackFormStatus(originalData: draftDataForRollback): Promise<{ success: boolean, errors: string[] }> {
    const errors: string[] = [];
    const _id = originalData.id;
    const form = await Compliance.findOne({ _id });
    if (!form) {
      errors.push('Form not found');
    } else {
      form.status = StatusEnum.DRAFT;
      form.uniqueId = originalData.uniqueId;
      form.expirationDate = originalData.expirationDate;
      await form.save();
    }
    return { success: errors.length === 0, errors }
  },

  async updateFormData(formId: string, updatedData): Promise<{ success: boolean, errors: string[] }> {
    const errors: string[] = [];

    try {
      const form = await Compliance.findOne({ _id: formId });

      if (!form) {
        errors.push(`Form with ID ${formId} does not exist.`);
      } else {
        if (form.status !== StatusEnum.IN_REVIEW) {
          errors.push("You can only edit a form that is in the IN_REVIEW status.");
        }
        if (!updatedData || !updatedData.bbDetails) {
          errors.push("No valid update data provided.");
        } else {
          // Merging new data with existing data
          const updateObject = { $set: {} };

          for (const bbName in updatedData.bbDetails) {
            if (Object.prototype.hasOwnProperty.call(updatedData.bbDetails, bbName)) {
              const bbDetailsUpdate = updatedData.bbDetails[bbName];

              ['deploymentCompliance', 'interfaceCompliance', 'requirementSpecificationCompliance'].forEach(field => {
                if (bbDetailsUpdate[field]) {
                  Object.entries(bbDetailsUpdate[field]).forEach(([key, value]) => {
                    updateObject.$set[`compliance.0.bbDetails.${bbName}.${field}.${key}`] = value;
                  });
                }
              });
            }
          }

          if (Object.keys(updateObject.$set).length > 0) {
            await Compliance.updateOne({ _id: formId }, updateObject);
          } else {
            errors.push("No valid fields to update.");
          }
        }
      }

      if (errors.length > 0) {
        return { success: false, errors };
      }

      return { success: true, errors };
    } catch (error: any) {
      console.error(`Error updating the form with ID ${formId}:`, error);
      return { success: false, errors: [error.message || 'Unknown error occurred'] };
    }
  },

  async editDraftForm(draftId: string, updatedData: Partial<ComplianceReport>): Promise<void> {
    try {
      const draft = await Compliance.findOne({ uniqueId: draftId });

      if (!draft) {
        throw new Error(`Draft with unique ID ${draftId} does not exist.`);
      }
      if (draft.expirationDate && draft.expirationDate < new Date()) {
        throw new Error("You cannot edit an expired draft form.");
      }
      if (draft.status !== StatusEnum.DRAFT) {
        throw new Error("You cannot edit a form that is not in the draft status.");
      }

      if (!updatedData) {
        throw new Error("No update data provided.");
      }

      const updateObject = { $set: {} };
      for (const key in updatedData) {
        if (Object.prototype.hasOwnProperty.call(updatedData, key)) {
          if (key === 'deploymentCompliance' && typeof updatedData[key] === 'object') {
            for (const subKey in updatedData[key]!) {
              if (Object.prototype.hasOwnProperty.call(updatedData[key]!, subKey)) {
                updateObject.$set[`deploymentCompliance.${subKey}`] = updatedData[key]![subKey];
              }
            }
          } else {
            updateObject.$set[key] = updatedData[key]!;
          }
        }
      }

      await Compliance.updateOne({ uniqueId: draftId }, updateObject);
    } catch (error) {
      console.error(`Error updating the draft form with unique ID ${draftId}:`, error);
      throw error;
    }
  },

  async getAllBBRequirements(): Promise<AllBBRequirements> {
    try {
      return await BBRequirements.aggregate(aggregationPipeline()).exec();
    } catch (error) {
      console.error('There was an error while fetching all BB requirements:', error);
      throw error;
    }
  },

  async getBBRequirements(bbKey: string): Promise<BBRequirement[]> {
    try {
      return await BBRequirements.aggregate(bbRequirementsAggregationPipeline(bbKey)).exec();
    } catch (error) {
      console.error("Error fetching BB requirements:", error);
      throw error;
    }
  },

  async getBBs(): Promise<any[]> {
    try {
      return await BBRequirements.aggregate(uniqueBBsAggregationPipeline()).exec();
    } catch (error) {
      console.error("Error fetching BBs:", error)
      throw error;
    }
  }


};

export default mongoComplianceRepository;
