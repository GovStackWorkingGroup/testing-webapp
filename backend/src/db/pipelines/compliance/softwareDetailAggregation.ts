export const softwareDetailAggregationPipeline = (softwareName: string): any[] => [
  {
    $match: { "softwareName": softwareName }
  },
  {
    $project: {
      objectId: "$_id", // Use the actual _id field from the document
      softwareName: 1,
      compliance: 1,
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      status: 1
    }
  },
  {
    $unwind: "$compliance"
  },
  {
    $addFields: {
      "compliance.bbDetailsArray": {
        $map: {
          input: { $objectToArray: "$compliance.bbDetails" },
          as: "detail",
          in: {
            "bbName": "$$detail.k",
            "bbVersion": "$$detail.v.bbVersion",
            "requirements": "$$detail.v.requirementSpecificationCompliance",
            "interface": "$$detail.v.interfaceCompliance",
            "deploymentCompliance": "$$detail.v.deploymentCompliance" 
          }
        }
      }
    }
  },
  {
    $unwind: "$compliance.bbDetailsArray"
  },
  {
    $group: {
      _id: {
        objectId: "$objectId",
        softwareName: "$softwareName",
        version: "$compliance.version",
        bbName: "$compliance.bbDetailsArray.bbName"
      },
      bbVersions: {
        $push: {
          bbVersion: "$compliance.bbDetailsArray.bbVersion",
          requirements: "$compliance.bbDetailsArray.requirements",
          interface: "$compliance.bbDetailsArray.interface",
          deploymentCompliance: "$compliance.bbDetailsArray.deploymentCompliance"
        }
      },
      logo: { $first: "$logo" },
      website: { $first: "$website" },
      documentation: { $first: "$documentation" },
      pointOfContact: { $first: "$pointOfContact" },
      status: { $first: "$status" }
    }
  },
  {
    $group: {
      _id: {
        objectId: "$_id.objectId",
        softwareName: "$_id.softwareName",
        version: "$_id.version"
      },
      bbDetails: {
        $push: {
          bbName: "$_id.bbName",
          bbVersions: "$bbVersions"
        }
      },
      logo: { $first: "$logo" },
      website: { $first: "$website" },
      documentation: { $first: "$documentation" },
      pointOfContact: { $first: "$pointOfContact" },
      status: { $first: "$status" }
    }
  },
  {
    $project: {
      objectId: "$_id.objectId",
      softwareVersion: "$_id.version",
      bbDetails: 1,
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      status: 1
    }
  },
  {
    $sort: { "softwareVersion": 1 } // Sorting by version
  },
  {
    $group: {
      _id: "$objectId",
      softwareName: { $first: "$_id.softwareName" },
      compliance: {
        $push: {
          softwareVersion: "$softwareVersion",
          bbDetails: "$bbDetails"
        }
      },
      logo: { $first: "$logo" },
      website: { $first: "$website" },
      documentation: { $first: "$documentation" },
      pointOfContact: { $first: "$pointOfContact" },
      status: { $first: "$status" }
    }
  },
  {
    $project: {
      _id: 1,
      softwareName: 1,
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      compliance: 1,
      deploymentCompliance: 1,
      status: 1
    }
  }
];
