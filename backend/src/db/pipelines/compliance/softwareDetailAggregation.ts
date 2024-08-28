export const softwareDetailAggregationPipeline = (softwareName: string): any[] => [
  // Stage 1: Match documents based on the provided software name
  {
    $match: { softwareName }
  },

  // Stage 2: Sort documents by the ObjectId in descending order (latest first)
  {
    $sort: { _id: -1 }
  },

  // Stage 3: Add a creationDate field derived from the ObjectId
  {
    $addFields: {
      creationDate: { $toDate: "$_id" }
    }
  },

  // Stage 4: Project the necessary fields for further processing
  {
    $project: {
      objectId: "$_id",
      softwareName: 1,
      compliance: 1,
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      status: 1,
      creationDate: 1
    }
  },

  // Stage 5: Unwind the compliance array, preserving null and empty arrays
  {
    $unwind: { path: "$compliance", preserveNullAndEmptyArrays: true }
  },

  // Stage 6: Transform the compliance.bbDetails object into an array and add necessary fields
  {
    $addFields: {
      "compliance.bbDetailsArray": {
        $map: {
          input: { $ifNull: [{ $objectToArray: "$compliance.bbDetails" }, []] },
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

  // Stage 7: Unwind the bbDetailsArray, preserving null and empty arrays
  {
    $unwind: { path: "$compliance.bbDetailsArray", preserveNullAndEmptyArrays: true }
  },

  // Stage 8: Group by software name, software version, and building block name
  {
    $group: {
      _id: {
        softwareName: "$softwareName",
        softwareVersion: { $ifNull: ["$compliance.version", "N/A"] },
        bbName: { $ifNull: ["$compliance.bbDetailsArray.bbName", "N/A"] }
      },
      bbVersions: {
        $push: {
          bbVersion: { $ifNull: ["$compliance.bbDetailsArray.bbVersion", "N/A"] },
          requirements: { $ifNull: ["$compliance.bbDetailsArray.requirements", {}] },
          interface: { $ifNull: ["$compliance.bbDetailsArray.interface", {}] },
          createdDate: "$creationDate",
          deploymentCompliance: { $ifNull: ["$compliance.bbDetailsArray.deploymentCompliance", {}] }
        }
      },
      latestRecord: { $first: "$$ROOT" }
    }
  },

  // Stage 9: Unwind the bbVersions array
  {
    $unwind: "$bbVersions"
  },

  // Stage 10: Group by software name and version, and gather building block details
  {
    $group: {
      _id: {
        softwareName: "$_id.softwareName",
        softwareVersion: "$_id.softwareVersion"
      },
      bbDetails: {
        $push: {
          bbName: "$_id.bbName",
          bbVersions: "$bbVersions"
        }
      },
      latestRecord: { $first: "$latestRecord" }
    }
  },

  // Stage 11: Project the final set of fields, including maximum creation date
  {
    $project: {
      _id: 1,
      bbDetails: 1,
      logo: "$latestRecord.logo",
      website: "$latestRecord.website",
      documentation: "$latestRecord.documentation",
      pointOfContact: "$latestRecord.pointOfContact",
      status: "$latestRecord.status",
      objectId: "$latestRecord.objectId",
      maxCreatedDate: { $max: "$bbDetails.bbVersions.createdDate" }
    }
  },

  // Stage 12: Group by software name and collect all compliance details
  {
    $group: {
      _id: "$_id.softwareName",
      compliance: {
        $push: {
          softwareVersion: "$_id.softwareVersion",
          bbDetails: "$bbDetails",
          _id: "$latestRecord.objectId",
          createdDate: "$maxCreatedDate"
        }
      },
      logo: { $first: "$latestRecord.logo" },
      website: { $first: "$latestRecord.website" },
      documentation: { $first: "$latestRecord.documentation" },
      pointOfContact: { $first: "$latestRecord.pointOfContact" },
      status: { $first: "$latestRecord.status" },
      objectId: { $first: "$latestRecord.objectId" }
    }
  },

  // Stage 13: Add fields to compliance and sort building blocks alphabetically, with "N/A" values at the end
  {
    $addFields: {
      compliance: {
        $map: {
          input: {
            $sortArray: {
              input: "$compliance",
              sortBy: { createdDate: -1 }  // Sort compliance by createdDate in descending order
            }
          },
          as: "comp",
          in: {
            softwareVersion: "$$comp.softwareVersion",
            bbDetails: {
              $let: {
                vars: {
                  detailsWithSortKey: {
                    $map: {
                      input: "$$comp.bbDetails",
                      as: "detail",
                      in: {
                        bbName: "$$detail.bbName",
                        bbVersions: "$$detail.bbVersions",
                        sortKey: {
                          $cond: {
                            if: { $eq: ["$$detail.bbName", "N/A"] },
                            then: 1,  // "N/A" values get a higher sortKey to appear at the end
                            else: 0
                          }
                        }
                      }
                    }
                  }
                },
                in: {
                  $sortArray: {
                    input: "$$detailsWithSortKey",
                    sortBy: { sortKey: 1, bbName: 1 }  // Sort alphabetically with "N/A" last
                  }
                }
              }
            },
            _id: "$$comp._id",
            createdDate: "$$comp.createdDate"
          }
        }
      }
    }
  },

  // Stage 14: Sort by the latest creation date in descending order
  {
    $sort: { "latestRecord.creationDate": -1 }
  },

  // Stage 15: Limit the results to only the most recent record
  {
    $limit: 1
  },

  // Stage 16: Final projection of the required fields
  {
    $project: {
      _id: "$objectId",
      softwareName: "$_id",
      compliance: 1,
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      status: 1
    }
  }
];
