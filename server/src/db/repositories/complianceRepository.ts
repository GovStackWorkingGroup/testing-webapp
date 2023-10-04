import Compliance from '../schemas/compliance';

const aggregationPipeline = [
  {
    $unwind: "$compliance"
  },
  {
    $unwind: "$compliance.bbDetails"
  },
  {
    $project: {
      softwareName: 1,
      bb: { $toString: "$compliance.bbDetails._id" },
      softwareVersion: "$compliance.version",
      bbVersion: "$compliance.bbDetails.bbVersion",
      status: "$compliance.bbDetails.status",
      submissionDate: "$compliance.bbDetails.submissionDate",
      deploymentCompliance: "$compliance.bbDetails.deploymentCompliance.isCompliant",
      requirementSpecificationCompliance: "$compliance.bbDetails.requirementSpecificationCompliance.level",
      interfaceCompliance: "$compliance.bbDetails.interfaceCompliance.level"
    }
  },
  {
    $group: {
      _id: "$softwareName",
      data: { $push: "$$ROOT" }
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
      return await Compliance.aggregate(aggregationPipeline).exec();
    } catch (error) {
      throw new Error('Error aggregating compliance reports');
    }
  }
};

export default mongoComplianceRepository;
