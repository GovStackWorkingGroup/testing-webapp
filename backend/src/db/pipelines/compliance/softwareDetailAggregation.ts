export const softwareDetailAggregationPipeline = (softwareName: string): any[] => [
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

  // Group all documents and add the latest document as a new field to all documents
  {
    $group: {
      _id: null,
      documents: { $push: "$$ROOT" },
      latestDocumentRecord: { $first: "$$ROOT" } // Since the documents are sorted, $first will be the latest
    }
  },

  {
    $unwind: "$documents"
  },

  {
    $addFields: {
      "documents.latestDocumentRecord": "$latestDocumentRecord"
    }
  },

  {
    $replaceRoot: { newRoot: "$documents" }
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
      creationDate: 1,
      latestDocumentRecord: 1
    }
  },

  {
    $unwind: { path: "$compliance", preserveNullAndEmptyArrays: true }
  },

  // Transform the compliance.bbDetails object into an array and add necessary fields
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

  // Group by software name, software version, and building block name
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
          deploymentCompliance: { $ifNull: ["$compliance.bbDetailsArray.deploymentCompliance", {}] },
          documentId: "$objectId"  // Capture the _id of the document for this bbVersion
        }
      },
      latestRecord: { $first: "$$ROOT" },
      latestDocumentRecord: { $first: "$latestDocumentRecord" },
      topDocumentId: { $first: "$objectId" }  // Store the _id of the first (latest) document
    }
  },

  // Unwind the bbVersions array
  {
    $unwind: "$bbVersions"
  },

  // Group by software name, version, and building block name
  {
    $group: {
      _id: {
        softwareName: "$_id.softwareName",
        softwareVersion: "$_id.softwareVersion",
        bbName: "$_id.bbName"
      },
      bbVersions: {
        $push: {
          bbVersion: "$bbVersions.bbVersion",
          requirements: "$bbVersions.requirements",
          interface: "$bbVersions.interface",
          deploymentCompliance: "$bbVersions.deploymentCompliance",
          creationDate: "$bbVersions.creationDate",
          documentId: "$bbVersions.documentId"  // Preserve the documentId
        }
      },
      latestRecord: { $first: "$latestRecord" },
      latestDocumentRecord: { $first: "$latestDocumentRecord" },
      topDocumentId: { $first: "$bbVersions.documentId" }  // Capture the documentId of the top bbVersion
    }
  },

  // Group by software name and version, and gather building block details
  {
    $group: {
      _id: {
        softwareName: "$_id.softwareName",
        softwareVersion: "$_id.softwareVersion"
      },
      bbDetails: {
        $push: {
          bbName: "$_id.bbName",
          bbVersions: "$bbVersions",  // This includes the preserved documentId within each bbVersion
          topDocumentId: "$topDocumentId" // Capture the topDocumentId for this bbDetail
        }
      },
      latestRecord: { $first: "$latestRecord" },
      latestDocumentRecord: { $first: "$latestDocumentRecord" }
    }
  },

  // Project the final set of fields, including maximum creation date
  {
    $project: {
      _id: 1,
      bbDetails: {
        $map: {
          input: "$bbDetails",
          as: "detail",
          in: {
            bbName: "$$detail.bbName",
            bbVersions: "$$detail.bbVersions",
            topDocumentId: "$$detail.topDocumentId" // Include topDocumentId within each bbDetails entry
          }
        }
      },
      logo: "$latestRecord.logo",
      website: "$latestRecord.website",
      documentation: "$latestRecord.documentation",
      pointOfContact: "$latestRecord.pointOfContact",
      status: "$latestRecord.status",
      objectId: "$latestRecord.objectId",
      maxCreatedDate: { $max: "$bbDetails.bbVersions.createdDate" },
      latestDocumentRecord: 1
    }
  },

  // Group by software name and collect all compliance details
  {
    $group: {
      _id: "$_id.softwareName",
      compliance: {
        $push: {
          softwareVersion: "$_id.softwareVersion",
          bbDetails: "$bbDetails",
          createdDate: "$maxCreatedDate"
        }
      },
      logo: { $first: "$latestDocumentRecord.logo" },
      website: { $first: "$latestDocumentRecord.website" },
      documentation: { $first: "$latestDocumentRecord.documentation" },
      pointOfContact: { $first: "$latestDocumentRecord.pointOfContact" },
      status: { $first: "$latestDocumentRecord.status" },
      objectId: { $first: "$latestDocumentRecord.objectId" },
      latestDocumentRecord: { $first: "$latestDocumentRecord" }
    }
  },

  // Add fields to compliance and sort building blocks alphabetically, with "N/A" values at the end
  {
    $addFields: {
      compliance: {
        $map: {
          input: {
            $sortArray: {
              input: "$compliance",
              sortBy: { softwareVersion: 1 }  // Ensure compliance is sorted by softwareVersion in ascending order
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
                        _id: "$$detail.topDocumentId",
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

  {
    $sort: { "latestRecord.creationDate": -1 }
  },

  {
    $limit: 1
  },

  // Extract _id from the top object of bbDetails and include it at the same level as softwareVersion and createdDate
  {
    $addFields: {
      compliance: {
        $map: {
          input: "$compliance",
          as: "comp",
          in: {
            _id: {
              $let: {
                vars: {
                  topDetail: { $arrayElemAt: ["$$comp.bbDetails", 0] }  // Get the top object from bbDetails
                },
                in: "$$topDetail._id"  // Extract _id from the top object
              }
            },
            softwareVersion: "$$comp.softwareVersion",
            createdDate: "$$comp.createdDate",
            bbDetails: "$$comp.bbDetails"  // Keep the bbDetails array as is
          }
        }
      }
    }
  },

  // Final projection of the required fields
  {
    $project: {
      _id: "$objectId",
      softwareName: "$_id",
      compliance: 1,
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      status: 1,
    }
  }
];
