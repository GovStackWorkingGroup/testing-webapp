import {
  BuildingBlockEndpointTest,
  BuildingBlockTestSummary,
  BuildingBlockType,
  ProductsType,
  TestsDetailsType,
} from '../../../../service/types';

export const mockedProduct: ProductsType = {
  _id: {
    testApp: 'Test Product',
    testSuite: 'Test suite',
    sourceBranch: 'Test branch',
    version: 'Version',
  },
  compatibilities: [
    {
      id: '234bj3bj4b23jr',
      buildingBlock: 'bb-messaging',
      timestamp: 1674924957,
      saveTime: 1676213907348,
      testsPassed: 30,
      testsFailed: 2,
      compatibility: 0.3455,
    },
  ],
  overallCompatibility: 0.2355,
  lastUpdate: 1676213907348,
};

export const buildingBlock: BuildingBlockType = {
  id: '07112c0a-8263-4717-92ce-c52bca785624',
  buildingBlock: 'bb-payments',
  timestamp: 1,
  saveTime: 1659380963000,
  testsPassed: 2,
  testsFailed: 2,
  compatibility: 0.3455,
};

export const testPassedDetails: TestsDetailsType = {
  scenario:
    'The user successfully creates record "John Smith" in the Digital Registries database.',
  steps: [
    {
      text: 'The user wants to create a new record "John Smith" in the Digital Registries database',
      result: true,
      type: 'Given',
    },
    {
      text: 'The user triggers an action to create a new record "John Smith" in the database',
      result: true,
      type: 'When',
    },
    {
      text: 'Operation finishes successfully for create user "John Smith"',
      result: true,
      type: 'Then',
    },
  ],
};

export const testFailedDetails: TestsDetailsType = {
  scenario:
    'The user is not able to create a record in the database which not exist',
  steps: [
    {
      text: 'The user wants to create a new record "Anna Stock" in the Digital Registries database',
      result: false,
      type: 'Given',
    },
    {
      text: 'The user triggers an action to create a new record "Anna Stock" in the database',
      result: false,
      type: 'When',
    },
    {
      text: 'Operation results in an error for create "Anna Stock"',
      result: false,
      type: 'Then',
    },
  ],
};

export const endpointTestResult: BuildingBlockEndpointTest = {
  endpoint: '/data/{someparameter}/method',
  method: 'GET',
  passed: true,
  uri: 'features/some_endpoint.feature',
  details: [testPassedDetails, testFailedDetails],
};

export const buildingBlockTestSummary: BuildingBlockTestSummary = {
  compatibilities: buildingBlock,
  data: [endpointTestResult],
  count: 1,
};
