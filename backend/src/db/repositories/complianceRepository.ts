import { ComplianceDbRepository, ComplianceReport, FormDetailsResults, StatusEnum } from 'myTypes';
import { v4 as uuidv4 } from 'uuid';
import Compliance from '../schemas/compliance';
import mongoose from 'mongoose';
import { appConfig } from '../../config/index';
import { ValidationError } from 'jsonschema';

const createAggregationPipeline = (limit: number, offset: number): any[] => {
  const aggregationPipeline: any[] = [
    { $unwind: "$compliance" },
    { $addFields: { "bbDetailsArray": { $objectToArray: "$compliance.bbDetails" } } },
    { $unwind: "$bbDetailsArray" },
    {
      $project: {
        softwareName: 1,
        softwareVersion: "$compliance.version",
        bb: "$bbDetailsArray.k",
        bbVersion: "$bbDetailsArray.v.bbVersion",
        status: "$bbDetailsArray.v.status",
        submissionDate: "$bbDetailsArray.v.submissionDate",
        deploymentCompliance: "$bbDetailsArray.v.deploymentCompliance.isCompliant",
        requirementSpecificationCompliance: "$bbDetailsArray.v.requirementSpecificationCompliance.level",
        interfaceCompliance: "$bbDetailsArray.v.interfaceCompliance.level"
      }
    },
    {
      $group: {
        _id: "$softwareName",
        data: { $push: "$$ROOT" }
      }
    },
    {
      $project: {
        data: {
          _id: 1,
          softwareVersion: 1,
          bb: 1,
          bbVersion: 1,
          status: 1,
          submissionDate: 1,
          deploymentCompliance: 1,
          requirementSpecificationCompliance: 1,
          interfaceCompliance: 1
        }
      }
    }
  ];
  if (offset !== undefined) aggregationPipeline.push({ $skip: offset });
  if (limit !== undefined) aggregationPipeline.push({ $limit: limit });

  return aggregationPipeline;
};

const softwareDetailAggregationPipeline = (softwareName: string): any[] => [
  {
    $match: { "softwareName": softwareName }
  },
  {
    $unwind: "$compliance"
  },
  {
    $project: {
      softwareName: 1,
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      version: "$compliance.version",
      bbDetails: {
        $arrayToObject: {
          $map: {
            input: { $objectToArray: "$compliance.bbDetails" },
            as: "bbDetail",
            in: [
              "$$bbDetail.k",
              {
                bbVersion: "$$bbDetail.v.bbVersion",
                requirementSpecificationCompliance: {
                  level: "$$bbDetail.v.requirementSpecificationCompliance.level",
                  note: "$$bbDetail.v.requirementSpecificationCompliance.note"
                },
                interfaceCompliance: {
                  level: "$$bbDetail.v.interfaceCompliance.level",
                  note: "$$bbDetail.v.interfaceCompliance.note"
                }
              }
            ]
          }
        }
      }
    }
  },
  {
    $group: {
      _id: "$softwareName",
      logo: { $first: "$logo" },
      website: { $first: "$website" },
      documentation: { $first: "$documentation" },
      pointOfContact: { $first: "$pointOfContact" },
      compliance: {
        $push: {
          formId: "$_id",
          version: "$version",
          bbDetails: "$bbDetails"
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      softwareName: "$_id",
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      compliance: 1
    }
  }
];

const formDetailAggregationPipeline = (formId: string): any[] => [
  {
    $match: { "_id": new mongoose.Types.ObjectId(formId) }
  },
  {
    $unwind: "$compliance"
  },
  {
    $project: {
      bbDetails: {
        $arrayToObject: {
          $map: {
            input: { $objectToArray: "$compliance.bbDetails" },
            as: "bbDetail",
            in: [
              "$$bbDetail.k",
              {
                interfaceCompliance: {
                  testHarnessResult: "$$bbDetail.v.interfaceCompliance.testHarnessResult",
                  requirements: "$$bbDetail.v.interfaceCompliance.requirements"
                },
                requirementSpecificationCompliance: {
                  crossCuttingRequirements: "$$bbDetail.v.requirementSpecificationCompliance.crossCuttingRequirements",
                  functionalRequirements: "$$bbDetail.v.requirementSpecificationCompliance.functionalRequirements"
                },
                deploymentCompliance: {
                  documentation: "$$bbDetail.v.deploymentCompliance.documentation"
                }
              }
            ]
          }
        }
      }
    }
  },
  {
    $group: {
      _id: "$softwareName",
      formDetails: {
        $push: {
          version: "$version",
          bbDetails: "$bbDetails"
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      formDetails: 1
    }
  }
];

const mongoComplianceRepository: ComplianceDbRepository = {
  async findAll() {
    try {
      return await Compliance.find();
    } catch (error) {
      throw new Error('Error fetching compliance records');
    }
  },

  async aggregateComplianceReports(limit: number, offset: number) {
    try {
      const results = await Compliance.aggregate(createAggregationPipeline(limit, offset)).exec();
      const reshapedResults = results.reduce((accumulatedResult, currentItem) => {
        accumulatedResult[currentItem._id] = currentItem.data;
        return accumulatedResult;
      }, {});
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
  }

};

export default mongoComplianceRepository;
