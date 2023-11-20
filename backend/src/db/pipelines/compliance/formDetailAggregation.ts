import mongoose from "mongoose";
import { validate as isUuid } from 'uuid';

export const formDetailAggregationPipeline = (formId: string | undefined, draftUuid: string | undefined): any[] => {
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
};
