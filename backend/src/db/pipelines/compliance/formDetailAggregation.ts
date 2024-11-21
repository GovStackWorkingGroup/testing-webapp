import mongoose from "mongoose";
import { SpecificationComplianceLevel } from "myTypes";

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
        originalId: "$_id",
        bbDetails: {
          $arrayToObject: {
            $map: {
              input: { $objectToArray: "$compliance.bbDetails" },
              as: "bbDetail",
              in: [
                "$$bbDetail.k",
                {
                  interfaceCompliance: {
                    level: { $ifNull: ["$$bbDetail.v.interfaceCompliance.level", SpecificationComplianceLevel.NA] },
                    notes: { $ifNull: ["$$bbDetail.v.interfaceCompliance.notes", ""] },
                    testHarnessResult: "$$bbDetail.v.interfaceCompliance.testHarnessResult",
                    requirements: "$$bbDetail.v.interfaceCompliance.requirements"
                  },
                  requirementSpecificationCompliance: {
                    level: { $ifNull: ["$$bbDetail.v.requirementSpecificationCompliance.level", SpecificationComplianceLevel.NA] },
                    notes: { $ifNull: ["$$bbDetail.v.requirementSpecificationCompliance.notes", ""] },
                    crossCuttingRequirements: "$$bbDetail.v.requirementSpecificationCompliance.crossCuttingRequirements",
                    functionalRequirements: "$$bbDetail.v.requirementSpecificationCompliance.functionalRequirements",
                    keyDigitalFunctionalitiesRequirements: "$$bbDetail.v.requirementSpecificationCompliance.keyDigitalFunctionalitiesRequirements"
                  },
                  deploymentCompliance: {
                    level: { $ifNull: ["$$bbDetail.v.deploymentCompliance.level", SpecificationComplianceLevel.NA] },
                    notes: { $ifNull: ["$$bbDetail.v.deploymentCompliance.notes", ""] }
                  }
                }
              ]
            }
          }
        },
        deploymentCompliance: {
          level: { $ifNull: ["$deploymentCompliance.level", SpecificationComplianceLevel.NA] },
          notes: { $ifNull: ["$deploymentCompliance.notes", ""] },
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
            deploymentCompliance: "$deploymentCompliance",
            id: "$originalId"
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
