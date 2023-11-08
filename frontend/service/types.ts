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

export type SingleComplianceItem = {
  _id: string;
  bb: string;
  bbVersion: string;
  deploymentCompliance: boolean;
  interfaceCompliance: number;
  requirementSpecificationCompliance: number;
  softwareName: string;
  softwareVersion: string;
  status: number;
  submissionDate: string;
};

export type ComplianceList = {
  count: number;
  data: Record<string, SingleComplianceItem[]>;
};

// Software compliance details
export type ComplianceDetails = {
  level: number;
  note?: string;
};

export type ComplianceItem = {
  requirementSpecificationCompliance: ComplianceDetails;
  interfaceCompliance: ComplianceDetails;
  bbVersion: string;
};

export type Compliance = {
  [key: string]: ComplianceItem;
};

export type SoftwareDetailsType = [
  {
    logo: string;
    website: string;
    documentation: string[];
    pointOfContact: string;
    compliance: [
      {
        formId: string;
        version: string;
        bbDetails: Compliance;
      }
    ];
    softwareName: string;
  }
];

// All types used in Table.tsx and the data connected to it
export type DataType = {
  rows: DataRow[];
};

export type TableProps = {
  data: DataType | Record<string, never>;
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
