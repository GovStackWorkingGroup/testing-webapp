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
      $unwind: "$documents"  // Unwind to process each document individually
    },

    // Unwind the compliance list to take each compliance object
    {
      $unwind: { path: "$documents.compliance", preserveNullAndEmptyArrays: true }
    },

    // Keep the version and bbDetails of each compliance object
    {
      $addFields: {
        complianceVersion: "$documents.compliance.version",
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
              },
              status: "$$detail.v.status"
            }
          }
        }
      }
    },

    {
      $unwind: { path: "$bbDetailsArray", preserveNullAndEmptyArrays: true }
    },

    // Group all compliance objects with their version and bbDetails for the final output
    {
      $group: {
        _id: "$documents.softwareName",
        compliance: {
          $push: {
            version: "$complianceVersion",
            bbDetails: {
              bbName: "$bbDetailsArray.bbName",
              bbVersion: "$bbDetailsArray.bbVersion",
              requirements: "$bbDetailsArray.requirements",
              interface: "$bbDetailsArray.interface",
              deploymentCompliance: "$bbDetailsArray.deploymentCompliance",
              creationDate: "$bbDetailsArray.creationDate",
              status: "$bbDetailsArray.status"
            }
          }
        },
        latestDocumentRecord: { $first: "$latestDocumentRecord" }  // Only take the latest document once
      }
    },

    // Final projection for output
    {
      $project: {
        _id: 0,
        softwareName: "$_id",
        logo: "$latestDocumentRecord.logo",
        website: "$latestDocumentRecord.website",
        documentation: "$latestDocumentRecord.documentation",
        pointOfContact: "$latestDocumentRecord.pointOfContact",
        compliance: 1
      }
    }
  ];
};
