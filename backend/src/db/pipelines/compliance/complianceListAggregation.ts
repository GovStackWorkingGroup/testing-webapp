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
            ...(filter.version && { "compliance.version": { $in: filter.version } })
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
                ? [StatusEnum.IN_REVIEW, StatusEnum.APPROVED, StatusEnum.REJECTED, StatusEnum.DRAFT]
                : [StatusEnum.IN_REVIEW, StatusEnum.APPROVED]
        }
    };

    const aggregationPipeline: unknown[] = [
        ...(softwareConditions.length > 0 ? [{ $match: { $or: softwareConditions } }] : []),
        { $match: statusConditions },
        { $unwind: { path: "$compliance", preserveNullAndEmptyArrays: true } },
        { $addFields: { "bbDetailsArray": { $objectToArray: "$compliance.bbDetails" } } },
        { $unwind: { path: "$bbDetailsArray", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                softwareName: 1,
                softwareVersion: { $ifNull: ["$compliance.version", null] },
                bb: { $ifNull: ["$bbDetailsArray.k", null] },
                bbVersion: { $ifNull: ["$bbDetailsArray.v.bbVersion", null] },
                status: { $ifNull: ["$bbDetailsArray.v.status", null] },
                submissionDate: { $ifNull: ["$bbDetailsArray.v.submissionDate", null] },
                deploymentCompliance: { $ifNull: ["$bbDetailsArray.v.deploymentCompliance", null] },
                requirementSpecificationCompliance: { $ifNull: ["$bbDetailsArray.v.requirementSpecificationCompliance.level", null] },
                interfaceCompliance: { $ifNull: ["$bbDetailsArray.v.interfaceCompliance.level", null] }
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
