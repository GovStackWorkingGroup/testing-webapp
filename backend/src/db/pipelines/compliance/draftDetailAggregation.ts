import mongoose from "mongoose";

export const draftDetailAggregationPipeline = (draftUuid: string): any[] => {
    const matchStage = {};

    matchStage['uniqueId'] = draftUuid;

    return [
        {
            $match: { 'uniqueId': draftUuid }
        },
        {
            $unwind: {
                path: "$compliance",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                softwareName: { $ifNull: ["$softwareName", ""] },
                logo: { $ifNull: ["$logo", ""] },
                website: { $ifNull: ["$website", ""] },
                documentation: { $ifNull: ["$documentation", ""] },
                pointOfContact: { $ifNull: ["$pointOfContact", ""] },
                status: { $ifNull: ["$status", ""] },
                uniqueId: { $ifNull: ["$uniqueId", ""] },
                expirationDate: { $ifNull: ["$expirationDate", ""] },
                description: { $ifNull: ["$description", ""] },
                deploymentCompliance: { $ifNull: ["$deploymentCompliance", ""] },
                version: { $ifNull: ["$compliance.version", ""] },
                bbDetails: {
                    $cond: {
                        if: { $or: [{ $eq: ["$compliance.bbDetails", null] }, { $eq: ["$compliance.bbDetails", {}] }] },
                        then: {},
                        else: {
                            $arrayToObject: {
                                $map: {
                                    input: { $objectToArray: "$compliance.bbDetails" },
                                    as: "bbDetail",
                                    in: {
                                        k: "$$bbDetail.k",
                                        v: {
                                            interfaceCompliance: {
                                                testHarnessResult: { $ifNull: ["$$bbDetail.v.interfaceCompliance.testHarnessResult", ""] },
                                                requirements: { $ifNull: ["$$bbDetail.v.interfaceCompliance.requirements", ""] }
                                            },
                                            requirementSpecificationCompliance: {
                                                crossCuttingRequirements: { $ifNull: ["$$bbDetail.v.requirementSpecificationCompliance.crossCuttingRequirements", ""] },
                                                functionalRequirements: { $ifNull: ["$$bbDetail.v.requirementSpecificationCompliance.functionalRequirements", ""] },
                                                keyDigitalFunctionalitiesRequirements: { $ifNull: ["$$bbDetail.v.requirementSpecificationCompliance.keyDigitalFunctionalitiesRequirements", ""] },
                                            },
                                            deploymentCompliance: { $ifNull: ["$$bbDetail.v.deploymentCompliance", ""] }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $group: {
                _id: "$_id",
                softwareName: { $first: "$softwareName" },
                logo: { $first: "$logo" },
                website: { $first: "$website" },
                documentation: { $first: "$documentation" },
                pointOfContact: { $first: "$pointOfContact" },
                status: { $first: "$status" },
                uniqueId: { $first: "$uniqueId" },
                expirationDate: { $first: "$expirationDate" },
                description: { $first: "$description" },
                deploymentCompliance: { $first: "$deploymentCompliance" },
                formDetails: {
                    $push: {
                        version: "$version",
                        bbDetails: "$bbDetails"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                softwareName: 1,
                logo: 1,
                website: 1,
                documentation: 1,
                email: "$pointOfContact",
                status: 1,
                uniqueId: 1,
                expirationDate: 1,
                description: 1,
                deploymentCompliance: 1,
                formDetails: 1
            }
        }
    ];
};
