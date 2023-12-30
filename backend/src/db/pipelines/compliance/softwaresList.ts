import { ComplianceListFilters, StatusEnum } from "myTypes";

export const softwaresListPipeline = (): any[] => {
  const aggregationPipeline: unknown[] = [
    {
      $group: {
        _id: '$softwareName',
        versions: { $addToSet: '$compliance.version' }
      }
    },
    {
      $group: {
        _id: null,
        allSoftwares: {
          $push: {
            k: '$_id',
            v: '$versions'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        allSoftwares: {
          $map: {
            input: '$allSoftwares',
            as: 'software',
            in: {
              k: '$$software.k',
              v: {
                $reduce: {
                  input: '$$software.v',
                  initialValue: [],
                  in: { $concatArrays: ['$$value', '$$this'] }
                }
              }
            }
          }
        }
      }
    },
    {
      $project: {
        data: {
          $arrayToObject: '$allSoftwares'
        }
      }
    },
    {
      $replaceRoot: { newRoot: '$data' }
    }
  ];

  return aggregationPipeline;
};
