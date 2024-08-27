export const softwareDetailAggregationPipeline = (softwareName: string): any[] => [
  {
    $match: { softwareName }
  },
  {
    $sort: { _id: -1 }
  },
  {
    $addFields: {
      creationDate: { $toDate: "$_id" } // Add creationDate field from ObjectId
    }
  },
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
  {
    $unwind: { path: "$compliance", preserveNullAndEmptyArrays: true }
  },
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
  {
    $unwind: { path: "$compliance.bbDetailsArray", preserveNullAndEmptyArrays: true }
  },
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
  { $unwind: "$bbVersions" },
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
  { $project: {
      _id: 1,
      bbDetails: 1,
      logo: "$latestRecord.logo",
      website: "$latestRecord.website",
      documentation: "$latestRecord.documentation",
      pointOfContact: "$latestRecord.pointOfContact",
      status: "$latestRecord.status",
      objectId: "$latestRecord.objectId",
      maxCreatedDate: { $max: "$bbDetails.bbVersions.createdDate" }  // Calculate max createdDate
    }
    },
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
{
  $addFields: {
  compliance: {
    $map: {
      input: {
        $sortArray: {
          input: "$compliance",
          sortBy: { "createdDate": -1 }  // Sort compliance by createdDate in descending order
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
                        then: 1,
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
                sortBy: { sortKey: 1, bbName: 1 }
              }
            }
          }
        },
        _id: "$$comp._id",
        createdDate: "$$comp.createdDate"  // Keep createdDate for reference
      }
    }
  }
}

},

  {
    $sort: { "latestRecord.creationDate": -1 }
  },
  {
    $limit: 1
  },
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
