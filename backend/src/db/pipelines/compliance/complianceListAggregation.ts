import {ComplianceListFilters} from "myTypes"

export const createAggregationPipeline = (limit: number, offset: number, filters: ComplianceListFilters): any[] => {
    let softwareConditions = filters.software.map(filter => {
        return {
            "softwareName": filter.name,
            // ..(filter.version && {"softwareVersion": { $in: filter.version }}) To be clarified if this will be used 
        };
    });

    let bbConditions = filters.bb.map(filter => {
        return {
            "bb": filter.name,
            ...(filter.version && {"bbVersion": { $in: filter.version }})
        };
    });
    console.log(bbConditions, filters.bb)

    const aggregationPipeline: unknown[] = [
        ...(softwareConditions.length > 0 ? [{ $match: { $or: softwareConditions } }] : []),
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
                deploymentCompliance: "$bbDetailsArray.v.deploymentCompliance",
                requirementSpecificationCompliance: "$bbDetailsArray.v.requirementSpecificationCompliance.level",
                interfaceCompliance: "$bbDetailsArray.v.interfaceCompliance.level"
            }
        },
        ...(bbConditions.length > 0 ? [{ $match: { $or: bbConditions } }] : []),
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
