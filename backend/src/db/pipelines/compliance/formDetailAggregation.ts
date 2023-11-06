import mongoose from "mongoose";

export const formDetailAggregationPipeline = (formId: string): any[] => [
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
