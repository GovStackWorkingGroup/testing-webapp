export const softwareDetailAggregationPipeline = (softwareName: string): any[] => [
    {
      $match: { "softwareName": softwareName }
    },
    {
      $unwind: "$compliance"
    },
    {
      $project: {
        softwareName: 1,
        logo: 1,
        website: 1,
        documentation: 1,
        pointOfContact: 1,
        version: "$compliance.version",
        bbDetails: {
          $arrayToObject: {
            $map: {
              input: { $objectToArray: "$compliance.bbDetails" },
              as: "bbDetail",
              in: [
                "$$bbDetail.k",
                {
                  bbVersion: "$$bbDetail.v.bbVersion",
                  requirementSpecificationCompliance: {
                    level: "$$bbDetail.v.requirementSpecificationCompliance.level",
                    note: "$$bbDetail.v.requirementSpecificationCompliance.note"
                  },
                  interfaceCompliance: {
                    level: "$$bbDetail.v.interfaceCompliance.level",
                    note: "$$bbDetail.v.interfaceCompliance.note"
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$softwareName",
        logo: { $first: "$logo" },
        website: { $first: "$website" },
        documentation: { $first: "$documentation" },
        pointOfContact: { $first: "$pointOfContact" },
        compliance: {
          $push: {
            formId: "$_id",
            version: "$version",
            bbDetails: "$bbDetails"
          }
        }
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
        compliance: 1
      }
    }
  ];