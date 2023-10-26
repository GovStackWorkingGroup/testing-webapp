export type BuildingBlockType = {
  id: string;
  buildingBlock: string; // Building block label
  timestamp: number; // Execution time from test [seconds]
  saveTime: number; // Save time in db [miliseconds]
  testsPassed: number;
  testsFailed: number;
  compatibility: number;
};

export type ProductsType = {
  _id: {
    testApp: string; // Label of the product
    testSuite: string; // Test suite label
    sourceBranch: string; // Branch on which tests were executed
    version: string; // Version on which tests were executed
  };
  compatibilities: BuildingBlockType[];
  overallCompatibility: number;
  lastUpdate: number;
};

export type BuildingBlockEndpointTest = {
  uri: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | '';
  endpoint: string;
  passed: boolean;
  details: TestsDetailsType[];
};

export type TestsDetailsType = {
  scenario: string;
  steps: {
    text: string;
    result: boolean;
    type: string;
  }[];
};

export type ProductsListType = ProductsType[];

export type BuildingBlockTestSummary = {
  compatibilities: BuildingBlockType;
  data: BuildingBlockEndpointTest[];
  count: number;
};

// All types used in Table.tsx and the data connected to it
export type TableProps = {
  data: { headers: string[]; rows: DataRow[] } | Record<string, never>;
  hasVerticalBorders?: boolean;
};

export type CellValue = {
  value: string | number | boolean;
};

export type Cell = CellValue | { values: CellValue[] };

export type DataRow = {
  cell: Cell[];
  subHeader?: string;
};
