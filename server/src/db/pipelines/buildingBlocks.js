const getBuildingBlockListPipeline = () => [
  {
    $match: {
      'finish.timestamp.seconds': {
        $exists: 1,
      },
      buildingBlock: {
        $exists: 1,
      },
      testSuite: {
        $exists: 1,
      },
      testApp: {
        $exists: 1,
      },
      saveTime: {
        $exists: 1,
      },
    },
  },
  {
    $group: {
      _id: {
        buildingBlock: '$buildingBlock',
        testApp: '$testApp',
      },
    },
  },
  {
    $group: {
      _id: {
        buildingBlock: '$_id.buildingBlock',
      },
      bbs: { $addToSet: { bbs: '$_id' } },
    },
  },
  {
    $project: {
      _id: 0,
      buildingBlock: '$_id.buildingBlock',
      supportedSoftwares: { $size: '$bbs' },
    },
  },
];

module.exports = {
  getBuildingBlockListPipeline,
};
