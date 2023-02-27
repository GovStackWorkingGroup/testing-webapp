import { ProductsType } from '../../../../service/types';

export const productsList: ProductsType = {
  _id: {
    testApp: 'Test Product',
    testSuite: 'Test suite',
    sourceBranch: 'Test branch',
  },
  compatibilities: [
    {
      id: '234bj3bj4b23jr',
      buildingBlock: 'Building block label',
      timestamp: 1674924957,
      saveTime: 1676213907348,
      testsPassed: 30,
      testsFailed: 2,
      compatibility: 0.3455,
    },
  ],
};
