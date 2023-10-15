import { ComplianceDbRepository } from 'myTypes'; 
import Compliance from '../schemas/compliance';

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
                requirementSpecificationCompliance: "$$bbDetail.v.requirementSpecificationCompliance",
                interfaceCompliance: "$$bbDetail.v.interfaceCompliance"
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

const mongoComplianceRepository: ComplianceDbRepository = {
  async findAll() {
    try {
      return await Compliance.find();
    } catch (error) {
      throw new Error('Error fetching compliance records');
    }
  },

  async aggregateComplianceReports() {
    try {
      const results = await Compliance.aggregate(aggregationPipeline).exec();
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
  }

};

export default mongoComplianceRepository;
