export const softwareDetailAggregationPipeline = (softwareName: string): any[] => [
  {
    $match: { "softwareName": softwareName }
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
            "bbName": "$detail.k",
            "bbVersion": "$detail.v.bbVersion",
            "requirements": "$detail.v.requirementSpecificationCompliance",
            "interface": "$detail.v.interfaceCompliance",
            "deploymentCompliance": "$detail.v.deploymentCompliance" 
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
      // Add these fields to be used with $first in the final $group stage
      logo: { $first: "$logo" },
      website: { $first: "$website" },
      documentation: { $first: "$documentation" },
      pointOfContact: { $first: "$pointOfContact" }
    }
  },
  {
    $group: {
      _id: {
        softwareName: "$_id.softwareName",
        version: "$_id.version"
      },
      bbDetails: {
        $push: {
          bbName: "$_id.bbName",
          bbVersions: "$bbVersions"
        }
      },
      // Keep carrying these fields
      logo: { $first: "$logo" },
      website: { $first: "$website" },
      documentation: { $first: "$documentation" },
      pointOfContact: { $first: "$pointOfContact" }
    }
  },
  {
    $project: {
      softwareVersion: "$_id.version",
      bbDetails: 1,
      // Include these fields in the projection
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1
    }
  },
  {
    $sort: { "softwareVersion": 1 } // Assuming you want it sorted by version
  },
  {
    $group: {
      _id: "$_id.softwareName",
      compliance: {
        $push: {
          softwareVersion: "$softwareVersion",
          bbDetails: "$bbDetails"
        }
      },
      // Use $first to get the fields from the grouped documents
      logo: { $first: "$logo" },
      website: { $first: "$website" },
      documentation: { $first: "$documentation" },
      pointOfContact: { $first: "$pointOfContact" }
    }
  },
  {
    $project: {
      _id: 0,
      softwareName: "$_id",
      logo: 1,
      website: 1,
      documentation: 1,
      pointOfContact: 1,
      compliance: 1,
      deploymentCompliance: 1
    }
  }
];
