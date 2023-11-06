export const createAggregationPipeline = (limit: number, offset: number): any[] => {
    const aggregationPipeline: any[] = [
        { $unwind: "$compliance" },
        { $addFields: { "bbDetailsArray": { $objectToArray: "$compliance.bbDetails" } } },
        { $unwind: "$bbDetailsArray" },
        {
            $project: {
                softwareName: 1,
                softwareVersion: "$compliance.version",
                bb: "$bbDetailsArray.k",
                bbVersion: "$bbDetailsArray.v.bbVersion",
                status: "$bbDetailsArray.v.status",
                submissionDate: "$bbDetailsArray.v.submissionDate",
                deploymentCompliance: "$bbDetailsArray.v.deploymentCompliance.isCompliant",
                requirementSpecificationCompliance: "$bbDetailsArray.v.requirementSpecificationCompliance.level",
                interfaceCompliance: "$bbDetailsArray.v.interfaceCompliance.level"
            }
        },
        {
            $facet: {
                data: [
                    { $sort: { submissionDate: -1 } },
                    { $skip: offset ? offset : 0 },
                    { $limit: limit ? limit : Number.MAX_SAFE_INTEGER },
                    {
                        $group: {
                            _id: "$softwareName",
                            records: { $push: "$$ROOT" }
                        }
                    },
                ],
                softwareNameCount: [
                    { $group: { _id: "$softwareName" } },
                    { $group: { _id: null, count: { $sum: 1 } } },
                    { $project: { _id: 0, count: 1 } }
                ]
            }
        },
        {
            $project: {
                records: "$data",
                totalSoftwareNames: { $arrayElemAt: ["$softwareNameCount.count", 0] }
            }
        }
    ];

    return aggregationPipeline;
};
