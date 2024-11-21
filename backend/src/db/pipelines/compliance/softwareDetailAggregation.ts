import { StatusEnum } from "myTypes";

export const softwareDetailAggregationPipeline = (
  softwareName: string,
  isAuthenticated: Boolean
): any[] => {

  let statusConditions = {
    status: {
      $in: isAuthenticated
        ? [StatusEnum.IN_REVIEW, StatusEnum.APPROVED, StatusEnum.REJECTED, StatusEnum.DRAFT]
        : [StatusEnum.IN_REVIEW, StatusEnum.APPROVED]
    }
  };

  return [
    {
      $match: { softwareName }
    },

    {
      $addFields: {
        creationDate: { $toDate: "$_id" }
      }
    },

    {
      $sort: { creationDate: -1 }
    },

    {
      $match: statusConditions
    },

    // Group to get the latest document and the full list of documents
    {
      $group: {
        _id: null,
        documents: { $push: "$$ROOT" },
        latestDocumentRecord: { $first: "$$ROOT" }  // Keep only the latest document for top-level info
      }
    },

    {
      $unwind: "$documents"
    },

    // Unwind the compliance list to process each compliance object
    {
      $unwind: { path: "$documents.compliance", preserveNullAndEmptyArrays: true }
    },

    // Process bbDetails into a structured format, keeping the array intact
    {
      $addFields: {
        complianceVersion: "$documents.compliance.version",
        complianceStatus: "$documents.status",
        complianceDocumentId: "$documents._id",
        complianceDocumentUniqueId: "$documents.uniqueId",
        complianceCreationDate: "$documents.creationDate",
        bbDetailsArray: {
          $map: {
            input: { $ifNull: [{ $objectToArray: "$documents.compliance.bbDetails" }, []] },
            as: "detail",
            in: {
              bbName: "$$detail.k",
              bbVersion: "$$detail.v.bbVersion",
              requirements: "$$detail.v.requirementSpecificationCompliance",
              interface: "$$detail.v.interfaceCompliance",
              deploymentCompliance: "$$detail.v.deploymentCompliance",
              creationDate: {
                $toDate: {
                  $convert: {
                    input: { $substr: ["$$detail.v.bbVersion", 0, 8] },
                    to: "long",
                    onError: null,
                    onNull: null
                  }
                }
              }
            }
          }
        }
      }
    },

    // Group by compliance (status and version) to prepare the compliance list
    {
      $group: {
        _id: "$documents._id",
        compliance: {
          $push: {
            status: "$complianceStatus",
            version: "$complianceVersion",
            id: "$complianceDocumentId",
            uniqueId: {
              $ifNull: ["$complianceDocumentUniqueId", null]
            },
            creationDate: "$complianceCreationDate",
            bbDetailsArray: "$bbDetailsArray"
          }
        },
        latestDocumentRecord: { $first: "$latestDocumentRecord" }

      }
    },

    // Flatten bbDetailsArray for each compliance entry
    {
      $group: {
        _id: null,
        compliance: {
          $push: {
            $arrayElemAt: ["$compliance", 0]
          }
        },
        latestDocumentRecord: { $first: "$latestDocumentRecord" }
      }
    },
    {
      $addFields: {
        compliance: {
          $sortArray: {
            input: "$compliance",
            sortBy: { creationDate: -1 } // Sort descending by creationDate
          }
        }
      }
    },

    // Collect all compliance statuses
    {
      $addFields: {
        complianceStatuses: {
          $map: {
            input: "$compliance",
            as: "comp",
            in: "$$comp.status"
          }
        }
      }
    },

    // **New Stage**: Filter out statuses 0 and 3
    {
      $addFields: {
        filteredStatuses: {
          $filter: {
            input: "$complianceStatuses",
            as: "status",
            cond: { $and: [{ $ne: ["$$status", 0] }, { $ne: ["$$status", 3] }] }
          }
        }
      }
    },

    // **New Stage**: Determine unique statuses
    {
      $addFields: {
        uniqueFilteredStatuses: { $setUnion: ["$filteredStatuses", []] }
      }
    },

    // **New Stage**: Apply logic to set finalStatus
    {
      $addFields: {
        finalStatus: {
          $switch: {
            branches: [
              // Condition 1: All statuses are 2
              {
                case: {
                  $and: [
                    { $gt: [{ $size: "$filteredStatuses" }, 0] }, // Ensure there are statuses
                    { $setEquals: ["$uniqueFilteredStatuses", [2]] } // Only status 2 is present
                  ]
                },
                then: 2
              },
              // Condition 2: Some statuses are 1 and 2
              {
                case: {
                  $and: [
                    { $in: [1, "$uniqueFilteredStatuses"] },
                    { $in: [2, "$uniqueFilteredStatuses"] }
                  ]
                },
                then: 1
              }
            ],
            // Default case: Keep the latest document's status
            default: "$latestDocumentRecord.status"
          }
        }
      }
    },

    // Final projection to return the desired structure
    {
      $project: {
        _id: 0,
        softwareName: "$latestDocumentRecord.softwareName",
        logo: "$latestDocumentRecord.logo",
        website: "$latestDocumentRecord.website",
        documentation: "$latestDocumentRecord.documentation",
        description: "$latestDocumentRecord.description",
        pointOfContact: "$latestDocumentRecord.pointOfContact",
        status: "$finalStatus",
        compliance: 1,
      }
    }
  ];
};
