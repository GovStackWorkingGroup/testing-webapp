const mongoose = require('mongoose');
const ReportModel = require('../schemas/report');

const { ObjectId } = mongoose.Types;

// class-methods-use-this
function getLatestReportPipeline() {
  return [
    {
      $match: {
        'finish.timestamp.seconds': { $exists: 1 },
        buildingBlock: { $exists: 1 },
        testSuite: { $exists: 1 },
        testApp: { $exists: 1 },
        sourceBranch: { $exists: 1 },
        saveTime: { $exists: 1 },
      },
    },
    {
      $group: {
        _id: {
          buildingBlock: '$buildingBlock',
          testSuite: '$testSuite',
          testApp: '$testApp',
          sourceBranch: '$sourceBranch',
        },
        latest: {
          $last: {
            date: '$finish.timestamp.seconds',
            saveTime: '$saveTime',
            id: '$_id',
            testCases: '$testCases',
          },
        },
      },
    },
    {
      $group: {
        _id: {
          testApp: '$_id.testApp',
          testSuite: '$_id.testSuite',
          sourceBranch: '$_id.sourceBranch',
        },
        compatibilities: {
          $push: {
            id: '$latest.id',
            buildingBlock: '$_id.buildingBlock',
            timestamp: '$latest.date',
            saveTime: '$latest.saveTime',
            testsPassed: {
              $size: {
                $filter: {
                  input: '$latest.testCases',
                  as: 'case',
                  cond: {
                    $eq: ['$$case.passed', true],
                  },
                },
              },
            },
            testsFailed: {
              $size: {
                $filter: {
                  input: '$latest.testCases',
                  as: 'case',
                  cond: {
                    $eq: ['$$case.passed', false],
                  },
                },
              },
            },
            compatibility: {
              $let: {
                vars: {
                  sumPassed: {
                    $size: {
                      $filter: {
                        input: '$latest.testCases',
                        as: 'case',
                        cond: {
                          $eq: ['$$case.passed', true],
                        },
                      },
                    },
                  },
                  sumFailed: {
                    $size: {
                      $filter: {
                        input: '$latest.testCases',
                        as: 'case',
                        cond: {
                          $eq: ['$$case.passed', false],
                        },
                      },
                    },
                  },
                },
                in: {
                  $round: [
                    {
                      $divide: [
                        '$$sumPassed',
                        {
                          $cond: {
                            if: { $gt: [{ $add: ['$$sumPassed', '$$sumFailed'] }, 0] },
                            then: { $add: ['$$sumPassed', '$$sumFailed'] },
                            else: 1,
                          },
                        },
                      ],
                    },
                    4,
                  ],
                },
              },
            },
          },
        },
      },
    },
    {
      $set: {
        overallCompatibility: {
          $let: {
            vars: {
              sumPassed: {
                $sum: '$compatibilities.testsPassed',
              },
              sumFailed: {
                $sum: '$compatibilities.testsFailed',
              },
            },
            in: {
              $round: [
                {
                  $divide: [
                    '$$sumPassed',
                    {
                      $cond: {
                        if: { $gt: [{ $add: ['$$sumPassed', '$$sumFailed'] }, 0] },
                        then: { $add: ['$$sumPassed', '$$sumFailed'] },
                        else: 1,
                      },
                    },
                  ],
                },
                4,
              ],
            },
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ];
}

// class-methods-use-this
function getReportDetailsPipeline(id) {
  return [
    {
      $match: {
        _id: ObjectId(id),
      },
    },
    {
      $addFields: {
        compatibilities: {
          buildingBlock: '$buildingBlock',
          testApp: '$testApp',
          timestamp: '$finish.timestamp.seconds',
          saveTime: '$saveTime',
          testsPassed: {
            $size: {
              $filter: {
                input: '$testCases',
                as: 'case',
                cond: {
                  $eq: ['$$case.passed', true],
                },
              },
            },
          },
          testsFailed: {
            $size: {
              $filter: {
                input: '$testCases',
                as: 'case',
                cond: {
                  $eq: ['$$case.passed', false],
                },
              },
            },
          },
          compatibility: {
            $let: {
              vars: {
                sumPassed: {
                  $size: {
                    $filter: {
                      input: '$testCases',
                      as: 'case',
                      cond: {
                        $eq: ['$$case.passed', true],
                      },
                    },
                  },
                },
                sumFailed: {
                  $size: {
                    $filter: {
                      input: '$testCases',
                      as: 'case',
                      cond: {
                        $eq: ['$$case.passed', false],
                      },
                    },
                  },
                },
              },
              in: {
                $round: [
                  {
                    $divide: [
                      '$$sumPassed',
                      {
                        $cond: {
                          if: { $gt: [{ $add: ['$$sumPassed', '$$sumFailed'] }, 0] },
                          then: { $add: ['$$sumPassed', '$$sumFailed'] },
                          else: 1,
                        },
                      },
                    ],
                  },
                  4,
                ],
              },
            },
          },
        },
      },
    },
    {
      $unwind: {
        path: '$testCases',
      },
    },
    {
      $group: {
        _id: '$_id',
        compatibilities: { $first: '$compatibilities' },
        data: {
          $push: {
            uri: '$testCases.gherkinDocument.uri',
            method: {
              $filter: {
                input: '$testCases.gherkinDocument.feature.tags.name',
                cond: {
                  $regexMatch: { input: '$$tags', regex: /^@method=/ },
                },
                as: 'tags',
              },
            },
            endpoint: {
              $filter: {
                input: '$testCases.gherkinDocument.feature.tags.name',
                cond: {
                  $regexMatch: { input: '$$tags', regex: /^@endpoint=/ },
                },
                as: 'tags',
              },
            },
            passed: '$testCases.passed',
          },
        },
      },
    },
  ];
}

const repository = () => {
  const add = (report, callback) => {
    const newReport = new ReportModel(report);
    return newReport.save(callback);
  };

  const aggregateCompatibilityByProduct = (filters, callback) => {
    const aggregation = ReportModel.aggregate(getLatestReportPipeline());

    if (filters.offset !== undefined) {
      aggregation.append({ $skip: filters.offset });
    }

    if (filters.limit !== undefined) {
      aggregation.append({ $limit: filters.limit });
    }

    aggregation.exec(callback);
  };

  const aggregateBBDetailsByProductId = (productId, callback) => {
    ReportModel.aggregate(getReportDetailsPipeline(productId.id)).exec(callback);
  };

  const productsCount = (callback) => {
    ReportModel.aggregate(getLatestReportPipeline())
      .append([{ $count: 'count' }])
      .exec(callback);
  };

  return {
    add,
    aggregateCompatibilityByProduct,
    aggregateBBDetailsByProductId,
    productsCount,
  };
};

module.exports = repository();
