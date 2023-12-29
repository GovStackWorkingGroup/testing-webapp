import { ComplianceListFilters, StatusEnum } from "myTypes";

export const bbsListPipeline = (
): any[] => {
    const aggregationPipeline: unknown[] = [
        {
          $unwind: "$compliance"
        },
        {
          $project: {
            bbDetails: {
              $objectToArray: "$compliance.bbDetails"
            }
          }
        },
        {
          $unwind: "$bbDetails"
        },
        {
          $group: {
            _id: "$bbDetails.k",
            versions: {
              $addToSet: "$bbDetails.v.bbVersion"
            }
          }
        },
        {
          $project: {
            _id: 0,
            bbName: "$_id",
            versions: 1
          }
        },
        {
          $group: {
            _id: null,
            allBBs: {
              $push: {
                k: "$bbName",
                v: "$versions"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            data: {
              $arrayToObject: "$allBBs"
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: "$data"
          }
        }
      ];
      return aggregationPipeline;
};
