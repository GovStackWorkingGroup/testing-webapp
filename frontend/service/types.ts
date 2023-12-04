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
  deploymentCompliance: number;
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

export type SoftwareDraftDetailsType = {
  deploymentCompliance: DeploymentCompliance;
  description: string;
  documentation: string;
  email: string;
  expirationDate: string;
  formDetails: { bbDetails: [] | null }[];
  logo: string;
  softwareName: string;
  status: number;
  uniqueId: string;
  website: string;
};

export type   Requirement = {
  requirement: string;
  comment: string;
  fulfillment: number;
  status: number;
};
export type DeploymentCompliance = {
  documentation: string | File;
  deploymentInstructions: string | File;
  requirements: Requirement[];
};

export type ComplianceVersion = {
  version: string;
  bbDetails: Map<string, SingleComplianceItem>;
};

export type SoftwareDraftToUpdateType = {
  softwareName?: string;
  logo?: File;
  website?: string;
  documentation?: string;
  pointOfContact?: string;
  compliance?: ComplianceVersion[];
  uniqueId?: string;
  expirationDate?: Date;
  deploymentCompliance?: Partial<DeploymentCompliance>;

};

export type ComplianceRequirementsType = {
  bbName: string,
  bbKey: string,
  bbVersion: string,
  dateOfSave: string,
  requirements: {
    crossCutting: [
      {
        requirement: string,
        comment: string,
        status: number,
        fulfillment: number | null,
        _id: string
      }
    ],
    functional: []
  }
}

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

export type InputOptionsProps = [{
  value: never,
  label: string
}]

export type InputSingleOptionProps = {
  value: ComplianceRequirementsType,
  label: string
}

export type POSTSoftwareAttributesType = {
  success: boolean;
  details: string;
  link: string;
  uniqueId: string;
};
