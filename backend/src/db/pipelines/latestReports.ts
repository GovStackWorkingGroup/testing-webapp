const getLatestReportPipeline = () => [
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
    $sort: {
      'finish.timestamp.seconds': 1,
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
    $addFields: {
      passedTests: {
        $size: {
          $filter: {
            input: '$latest.testCases',
            as: 'case',
            cond: { $eq: ['$$case.passed', true] },
          },
        },
      },
      failedTests: {
        $size: {
          $filter: {
            input: '$latest.testCases',
            as: 'case',
            cond: { $eq: ['$$case.passed', false] },
          },
        },
      },
    },
  },
  {
    $addFields: {
      compatibility: {
        $cond: {
          if: { $gt: [{ $add: ['$passedTests', '$failedTests'] }, 0] },
          then: {
            $round: [
              {
                $divide: ['$passedTests', { $add: ['$passedTests', '$failedTests'] }],
              }, 4],
          },
          else: 0,
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
          testsPassed: '$passedTests',
          testsFailed: '$failedTests',
          compatibility: '$compatibility',
        },
      },
    },
  },
  {
    $unwind: '$compatibilities',
  },
  {
    $sort: { 'compatibilities.buildingBlock': 1 },
  },
  {
    $group: {
      _id: '$_id',
      compatibilities: {
        $push: '$compatibilities',
      },
      overallCompatibility: {
        $avg: '$compatibilities.compatibility',
      },
      lastUpdate: { $max: '$compatibilities.saveTime' },
    },
  },
  {
    $sort: { _id: 1 },
  },
];

const sortLatestReports = (sorting) => [
  {
    $sort: { ...sorting },
  },
];

const branchReports = (branchName) => [
  {
    $match: {
      sourceBranch: branchName,
    },
  },
];

export {
  getLatestReportPipeline,
  sortLatestReports,
  branchReports,
};
