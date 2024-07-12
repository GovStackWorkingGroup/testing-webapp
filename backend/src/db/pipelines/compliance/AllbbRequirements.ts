export const aggregationPipeline = (): any[] => [
    // Sort by bbName, bbKey, bbVersion, and dateOfSave descending
    { $sort: { bbName: 1, bbKey: 1, dateOfSave: -1 } },
    // Group by the unique combination of bbName, bbKey, and bbVersion
    {
      $group: {
        _id: {
          bbName: "$bbName",
          bbKey: "$bbKey",
          bbVersion: "$bbVersion"
        },
        document: { $first: "$$ROOT" } // Take the first document after sorting which is the most recent
      }
    },
    // Replace the root to promote the most recent document to the top level
    {
      $replaceRoot: { newRoot: "$document" }
    },
    // Project the required fields with the nested 'requirements' object
    {
      $project: {
        _id: 0, // Exclude the _id
        bbName: 1,
        bbKey: 1,
        bbVersion: 1,
        dateOfSave: 1,
        requirements: {
          crossCutting: "$requirements.crossCutting",
          functional: "$requirements.functional",
          interface: "$requirements.interface",
        }
      }
    }
  ];
  