import mongoose from "mongoose";

export const formDetailAggregationPipeline = ({ formId, draftUuid }: {
  formId?: string,
  draftUuid?: string
} = {}): any[] => {
  const matchStage = {};

  if (draftUuid) {
    matchStage['uniqueId'] = draftUuid;
  } else if (formId) {
    matchStage['_id'] = new mongoose.Types.ObjectId(formId);
  }

  return [
    {
      $match: matchStage
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
                    functionalRequirements: "$$bbDetail.v.requirementSpecificationCompliance.functionalRequirements",
                    keyDigitalFunctionalities: "$$bbDetail.v.requirementSpecificationCompliance.keyDigitalFunctionalities",
                  }
                }
              ]
            }
          }
        },
        deploymentCompliance: {
          documentation: "$deploymentCompliance.documentation",
          deploymentInstructions: "$deploymentCompliance.deploymentInstructions"
        }
      }
    },
    {
      $group: {
        _id: "$softwareName",
        formDetails: {
          $push: {
            version: "$version",
            bbDetails: "$bbDetails",
            deploymentCompliance: "$deploymentCompliance"
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
};
