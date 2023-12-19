import { ComplianceListFilters, StatusEnum } from "myTypes";

export const createAggregationPipeline = (
    limit: number,
    offset: number,
    filters: ComplianceListFilters,
    isAuthenticated: Boolean
): any[] => {
    let softwareConditions = filters.software.map(filter => {
        return {
            "softwareName": filter.name,
            ...(filter.version && { "softwareVersion": { $in: filter.version } })
        };
    });

    let bbConditions = filters.bb.map(filter => {
        return {
            "bb": filter.name,
            ...(filter.version && { "bbVersion": { $in: filter.version } })
        };
    });

    let statusConditions = {
        status: {
            $in: isAuthenticated 
                ? [StatusEnum.IN_REVIEW, StatusEnum.APPROVED, StatusEnum.REJECTED]
                : [StatusEnum.IN_REVIEW, StatusEnum.APPROVED]
        }
    };

    const aggregationPipeline: unknown[] = [
        ...(softwareConditions.length > 0 ? [{ $match: { $or: softwareConditions } }] : []),
        { $match: statusConditions },
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
        { $sort: { "softwareVersion": -1 } },
        {
            $group: {
                _id: "$softwareName",
                records: { $push: "$$ROOT" }
            }
        },
        {
            $facet: {
                totalCount: [
                    { $group: { _id: null, count: { $sum: 1 } } },
                    { $project: { _id: 0, count: 1 } }
                ],
                paginatedResults: [
                    { $sort: { "_id": 1 } },
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
