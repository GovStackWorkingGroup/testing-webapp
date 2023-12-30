export const bbRequirementsAggregationPipeline = (bbKey: string): any[] => [
    {
        $match: {
          bbKey: bbKey
        }
      },
      {
        $project: {
          _id: 0,
          __v: 0,
        }
      }
];
