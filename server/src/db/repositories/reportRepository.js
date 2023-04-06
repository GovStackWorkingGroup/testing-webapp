const mongoose = require('mongoose');
const ReportModel = require('../schemas/report');

const { ObjectId } = mongoose.Types;

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
                          if: {
                            $gt: [
                              {
                                $add: ['$$sumPassed', '$$sumFailed'],
                              },
                              0,
                            ],
                          },
                          then: {
                            $add: ['$$sumPassed', '$$sumFailed'],
                          },
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
        compatibilities: {
          $first: '$compatibilities',
        },
        data: {
          $push: {
            id: '$testCases._id',
            uri: '$testCases.gherkinDocument.uri',
            method: {
              $substr: [
                {
                  $first: {
                    $filter: {
                      input: '$testCases.gherkinDocument.feature.tags.name',
                      cond: {
                        $regexMatch: {
                          input: '$$tags',
                          regex: /^@method=/,
                        },
                      },
                      as: 'tags',
                    },
                  },
                },
                // cut method ( remove 8 characters from the beginning and take the rest )
                8,
                -1,
              ],
            },
            endpoint: {
              $substr: [
                {
                  $first: {
                    $filter: {
                      input: '$testCases.gherkinDocument.feature.tags.name',
                      cond: {
                        $regexMatch: {
                          input: '$$tags',
                          regex: /^@endpoint=/,
                        },
                      },
                      as: 'tags',
                    },
                  },
                },
                // cut endpoint ( remove 10 characters from the beginning and take the rest )
                10,
                -1,
              ],
            },
            passed: '$testCases.passed',
            details: [
              {
                id: '$testCases._id',
                scenario: '$testCases.name',
                steps: '$testCases.steps',
              },
            ],
          },
        },
      },
    },
    {
      $unwind: {
        path: '$data',
      },
    },
    {
      $unwind: {
        path: '$data.details',
      },
    },
    {
      $unwind: {
        path: '$data.details.steps',
      },
    },
    {
      $project: {
        compatibilities: 1,
        data: {
          id: 1,
          uri: 1,
          method: 1,
          endpoint: 1,
          passed: 1,
          details: {
            id: 1,
            scenario: 1,
            steps: {
              result: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $eq: ['$data.details.steps.result.status', 'PASSED'],
                      },
                      then: true,
                    },
                  ],
                  default: false,
                },
              },
              text: 1,
              type: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $eq: ['$data.details.steps.type', 'Context'],
                      },
                      then: 'Given',
                    },
                    {
                      case: {
                        $eq: ['$data.details.steps.type', 'Action'],
                      },
                      then: 'When',
                    },
                    {
                      case: {
                        $eq: ['$data.details.steps.type', 'Outcome'],
                      },
                      then: 'Then',
                    },
                  ],
                  default: '',
                },
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: '$data.id',
        steps: {
          $push: '$data.details.steps',
        },
        compatibilities: {
          $first: '$compatibilities',
        },
        data: {
          $first: '$data',
        },
      },
    },
    {
      $sort: {
        'data.details.id': 1,
      },
    },
    {
      $group: {
        _id: '$data.uri',
        compatibilities: {
          $first: '$compatibilities',
        },
        details: {
          $push: {
            scenario: '$data.details.scenario',
            steps: '$steps',
          },
        },
        passed: {
          $push: '$data.passed',
        },
        data: {
          $first: {
            uri: '$data.uri',
            method: '$data.method',
            endpoint: '$data.endpoint',
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        compatibilities: 1,
        data: {
          uri: 1,
          method: 1,
          endpoint: 1,
          passed: {
            $allElementsTrue: ['$passed'],
          },
          details: '$details',
        },
      },
    },
    {
      $group: {
        _id: '$compatibilities',
        compatibilities: {
          $first: '$compatibilities',
        },
        data: {
          $push: '$data',
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
