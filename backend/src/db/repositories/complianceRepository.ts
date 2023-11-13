import { BBRequirement, ComplianceAggregationListResult, ComplianceDbRepository, ComplianceReport, FormDetailsResults, StatusEnum } from 'myTypes';
import { v4 as uuidv4 } from 'uuid';
import Compliance from '../schemas/compliance';
import mongoose from 'mongoose';
import { appConfig } from '../../config/index';
import { createAggregationPipeline } from '../pipelines/compliance/complianceListAggregation';
import { formDetailAggregationPipeline } from '../pipelines/compliance/formDetailAggregation';
import { softwareDetailAggregationPipeline } from '../pipelines/compliance/softwareDetailAggregation';
import BBRequirements from '../schemas/bbRequirements';
import { bbRequirementsAggregationPipeline } from '../pipelines/compliance/bbRequirements';

const mongoComplianceRepository: ComplianceDbRepository = {
  async findAll() {
    try {
      return await Compliance.find();
    } catch (error) {
      throw new Error('Error fetching compliance records');
    }
  },

  async aggregateComplianceReports(limit: number, offset: number): Promise<ComplianceAggregationListResult> {
    try {
      const results = await Compliance.aggregate(createAggregationPipeline(limit, offset)).exec();
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
      const results = await Compliance.aggregate(formDetailAggregationPipeline(formId)).exec();
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

      await Compliance.updateOne({ uniqueId: draftId }, updatedData);

    } catch (error) {
      console.error(`Error updating the draft form with unique ID ${draftId}:`, error);
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
  }


};

export default mongoComplianceRepository;
