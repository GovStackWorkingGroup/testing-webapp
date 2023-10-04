import Compliance from '../schemas/compliance';

const aggregationPipeline: any[] = [
  { $unwind: "$compliance" },

  // Convert the bbDetails Map to an array
  { $addFields: { "bbDetailsArray": { $objectToArray: "$compliance.bbDetails" } } },

  // Unwind the bbDetailsArray to access each bb's details
  { $unwind: "$bbDetailsArray" },

  // Project the desired fields
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

const mongoComplianceRepository = {
  async find() {
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
  }
};

export default mongoComplianceRepository;
