const mongoose = require('mongoose');
const ReportModel = require('../schemas/report');

const { ObjectId } = mongoose.Types;

// eslint-disable-next-line class-methods-use-this, no-unused-vars
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

// eslint-disable-next-line class-methods-use-this, no-unused-vars
function getReportDetailsPipeline(id) {
  return [
    {
      $match: {
        'finish.timestamp.seconds': { $exists: 1 },
        buildingBlock: { $exists: 1 },
        testSuite: { $exists: 1 },
        testApp: { $exists: 1 },
        sourceBranch: { $exists: 1 },
        saveTime: { $exists: 1 },
        _id: ObjectId(id),
      },
    },
    {
      $group: {
        _id: {
          productId: '$_id',
          buildingBlock: '$buildingBlock',
          testSuite: '$testSuite',
          testApp: '$testApp',
          sourceBranch: '$sourceBranch',
        },
        latest: {
          $last: {
            testCases: '$testCases',
          },
        },
      },
    },
    {
      $unwind: {
        path: '$latest.testCases',
      },
    },
    {
      $project: {
        _id: '$_id',
        uri: '$latest.testCases.gherkinDocument.uri',
        testCases: '$latest.testCases',
        passed: '$latest.testCases.passed',
      },
    },
    {
      $addFields: {
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
      },
    },
    {
      $group: {
        _id: '$_id',
        data: {
          $push: {
            uri: '$uri',
            method: '$method',
            endpoint: '$endpoint',
            passed: '$passed',
          },
        },
        testCases: { $push: '$testCases' },
      },
    },
    {
      $group: {
        _id: '$_id',
        data: { $first: '$data' },
        compatibilities: {
          $push: {
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
    },
    {
      $project: {
        _id: 1,
        data: 1,
        compatibilities: { $first: '$compatibilities' },
      },
    },
    { $sort: { _id: 1, data: 1 } },
  ];
}

const repository = () => {
  const add = (report, callback) => {
    const newReport = new ReportModel(report);
    return newReport.save(callback);
  };

  const aggregateByProduct = (filters, callback) => {
    const aggregation = ReportModel.aggregate(getLatestReportPipeline());

    if (filters.offset !== undefined) {
      aggregation.append({ $skip: filters.offset });
    }

    if (filters.limit !== undefined) {
      aggregation.append({ $limit: filters.limit });
    }

    aggregation.exec(callback);
  };

  const aggregateByProductId = (productId, callback) => {
    const { id } = productId;
    const aggregation = ReportModel.aggregate(getReportDetailsPipeline(id));

    aggregation.exec(callback);
  };

  const productsCount = (callback) => {
    ReportModel.aggregate(getLatestReportPipeline())
      .append([{ $count: 'count' }])
      .exec(callback);
  };

  return {
    add,
    aggregateByProduct,
    aggregateByProductId,
    productsCount,
  };
};

module.exports = repository();
