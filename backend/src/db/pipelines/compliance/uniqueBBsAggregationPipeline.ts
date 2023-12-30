export const uniqueBBsAggregationPipeline = (): any[] => [
    {
        $group: {
            _id: "$bbKey",
            bbName: { $first: "$bbName" }
        }
    },
    {
        $project: {
            _id: 0,
            "bb-key": "$_id",
            "bb-name": "$bbName"
        }
    }
];
