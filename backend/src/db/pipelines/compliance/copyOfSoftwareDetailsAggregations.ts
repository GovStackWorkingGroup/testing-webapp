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
            deploymentCompliance: "$$detail.v.deploymentCompliance"
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
          deploymentCompliance: { $ifNull: ["$compliance.bbDetailsArray.deploymentCompliance", {}] }
        }
      },
      latestRecord: { $first: "$$ROOT" }
    }
  },
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
  {
    $group: {
      _id: "$_id.softwareName",
      compliance: {
        $push: {
          softwareVersion: "$_id.softwareVersion",
          bbDetails: "$bbDetails",
          _id: "$latestRecord.objectId"
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
          input: "$compliance",
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
            _id: "$$comp._id"
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
