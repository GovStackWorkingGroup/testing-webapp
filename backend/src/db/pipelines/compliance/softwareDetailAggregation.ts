export const softwareDetailAggregationPipeline = (softwareName: string): any[] => [
  {
    $match: { softwareName }
  },
  {
    $sort: { _id: -1 } // Sort documents by their _id in descending order
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
        softwareName: "$softwareName",
        softwareVersion: "$compliance.version",
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
      status: { $first: "$status" },
      objectId: { $first: "$objectId" }
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
      logo: { $first: "$logo" },
      website: { $first: "$website" },
      documentation: { $first: "$documentation" },
      pointOfContact: { $first: "$pointOfContact" },
      status: { $first: "$status" },
      objectId: { $first: "$objectId" }
    }
  },
  {
    $group: {
      _id: "$_id.softwareName",
      compliance: {
        $push: {
          softwareVersion: "$_id.softwareVersion",
          bbDetails: "$bbDetails",
          _id: "$objectId" // Add _id at the same level as softwareVersion
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
      _id: 0,
      softwareName: "$_id",
      compliance: 1,
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      status: 1
    }
  },
  {
    $limit: 1 // Return the latest matching object
  }
];
