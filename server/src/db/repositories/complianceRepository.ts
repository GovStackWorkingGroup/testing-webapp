import { ComplianceDbRepository } from 'myTypes'; 
import Compliance from '../schemas/compliance';

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
  }
};

export default mongoComplianceRepository;
