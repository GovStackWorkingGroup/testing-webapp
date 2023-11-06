export const createAggregationPipeline = (limit: number, offset: number): any[] => {
    const aggregationPipeline: unknown[] = [
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
            $group: {
                _id: "$softwareName",
                records: { $push: "$$ROOT" }
            }
        },
        {
            $facet: {
                totalCount: [
                    // Using this pipeline to count the total unique softwareNames
                    { $group: { _id: null, count: { $sum: 1 } } },
                    { $project: { _id: 0, count: 1 } }
                ],
                paginatedResults: [
                    { $sort: { "_id": -1 } },
                    { $skip: offset },
                    { $limit: limit },
                ]
            }
        },
        {
            $project: {
                totalSoftwareNames: { $arrayElemAt: ["$totalCount.count", 0] },
                records: "$paginatedResults"
            }
        }
    ];

    return aggregationPipeline;
};
