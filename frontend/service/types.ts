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
  deploymentCompliance: {
    documentation: string;
    deploymentInstructions: string;
    requirements: { requirement: string; level: number }[];
  };
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
  requirements: ComplianceDetails;
  interface: ComplianceDetails;
  bbVersion: string;
  deploymentCompliance: { requirement: string; level: number }[];
};

export type Compliance = {
  bbName: string;
  bbVersions: ComplianceItem[];
};

export type SoftwareDetailsType = [
  {
    logo: string;
    website: string;
    documentation: string;
    pointOfContact: string;
    compliance: [
      {
        softwareVersion: string;
        bbDetails: Compliance[];
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

export type CellValues = {
  values: CellValue[];
};

export type Cell =
  | CellValue
  | { values: CellValue[] }
  | { values: CellValues[] };

export type DataRow = {
  cell: Cell[];
  subHeader?: string;
};
