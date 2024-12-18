import { SpecificationComplianceLevel, StatusEnum } from './constants';

export type SpecificationComplianceLevelOptions =
  | SpecificationComplianceLevel.LEVEL_1
  | SpecificationComplianceLevel.LEVEL_2
  | SpecificationComplianceLevel.NA;

export type FormStatusOptions = StatusEnum.APPROVED | StatusEnum.DRAFT | StatusEnum.IN_REVIEW | StatusEnum.REJECTED;

export type BuildingBlockType = {
  id: string;
  buildingBlock: string; // Building block label
  timestamp: number; // Execution time from test [seconds]
  saveTime: number; // Save time in db [ms]
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
  logo: string;
  _id: string;
  bb: string;
  bbVersion: string;
  deploymentCompliance: { level: number; notes: string };
  interfaceCompliance: number;
  requirementSpecificationCompliance: number;
  softwareName: string;
  softwareVersion: string;
  status: number;
  submissionDate: string;
};

export type ParentOfCandidatesResult = {
  name: string;
  children: SingleComplianceItem[];
};

export type ComplianceList = {
  count: number;
  data: Record<string, SingleComplianceItem[]>;
};

// Software compliance details
export type ComplianceDetails = {
  level: number;
  notes?: string;
};

export type ComplianceItem = {
  requirements: ComplianceDetails;
  interface: ComplianceDetails;
  bbVersion: string;
  creationDate: string | null;
  bbName: string;
  deploymentCompliance: { level: number; notes: string };
};

export type Compliance = {
  bbName: string;
  bbVersions: ComplianceItem[];
};

export type SoftwareDetailsTypeCompliance = {
  id: string | undefined;
  uniqueId: string | null;
  status: number;
  version: string;
  bbDetailsArray: ComplianceItem[];
};

export type SoftwareDetailsType = {
  _id: string;
  logo: string;
  website: string;
  documentation: string;
  pointOfContact: string;
  compliance: SoftwareDetailsTypeCompliance[];
  softwareName: string;
  status: number;
}[];

export type BBDetailsType = {
  [key: string]: {
    requirementSpecificationCompliance: {
      crossCuttingRequirements: RequirementsType[];
      functionalRequirements: RequirementsType[];
      keyDigitalFunctionalitiesRequirements: RequirementsType[];
      notes: string;
      level: SpecificationComplianceLevelOptions;
    };
    interfaceCompliance: {
      testHarnessResult: string;
      requirements: RequirementsType[];
      notes: string;
      level: SpecificationComplianceLevelOptions;
    };
    deploymentCompliance: {
      level: SpecificationComplianceLevelOptions;
      notes: string;
    };
  };
};

export type SoftwareDraftDetailsType = {
  deploymentCompliance: DeploymentCompliance;
  description: string;
  documentation: string;
  email: string;
  expirationDate: string;
  formDetails: {
    version: string;
    bbDetails: BBDetailsType;
  }[];
  logo: string;
  softwareName: string;
  status: number;
  uniqueId: string;
  website: string;
  version: string;
};

export type Requirement = {
  requirement: string;
  comment: string;
  fulfillment: number;
  status: number;
  link?: string;
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

export type IRSCSoftwareDraftToUpdateType = {
  bbSpecification: string;
  bbVersion: string;
  dateOfSave: string;
  requirements: {
    crossCutting: RequirementsType[];
    functional: RequirementsType[];
    interface: RequirementsType[];
    keyDigitalFunctionalities: RequirementsType[] | never[];
  };
  interfaceCompliance: {
    testHarnessResult: string;
    requirements: [];
    notes: string;
    level: SpecificationComplianceLevelOptions;
  };
};

export type ComplianceRequirementsType = {
  bbName: string;
  bbKey: string;
  bbVersion: string;
  dateOfSave: string;
  requirements: {
    crossCutting: RequirementsType[] | never[];
    functional: RequirementsType[] | never[];
    interface: RequirementsType[] | never[];
    keyDigitalFunctionalities: RequirementsType[] | never[];
  };
  interfaceCompliance: {
    notes: string;
    level: SpecificationComplianceLevelOptions;
    testHarnessResult: string;
    requirements: RequirementsType[] | [];
  };
};

export type RequirementsType = {
  requirement: string;
  comment: string;
  fulfillment: number;
  _id?: string;
  status: number;
  link?: string;
};

export type SoftwareDetailsDataType = {
  formDetails: {
    id: string;
    bbDetails: BBDetailsType;
    deploymentCompliance: {
      documentation: string;
      deploymentInstructions: string;
    };
  }[];
};

// All types used in Table.tsx and the data connected to it
export type DataType = {
  rows: DataRow[];
};

export type TableProps = {
  data: DataType | Record<string, never>;
  hasVerticalBorders?: boolean;
};

export type CellValue = {
  value: string | number | boolean | formatTranslationType | undefined;
  logo?: string;
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
  logo?: string;
};

export type InputOptionsProps = {
  value: unknown;
  label: string;
};

export type InputSingleOptionProps = {
  value: ComplianceRequirementsType;
  label: string;
};

export type POSTSoftwareAttributesType = {
  success: boolean;
  details: string;
  link: string;
  uniqueId: string;
};

export type PATCHSoftwareAttributesType = {
  success: boolean;
  details: string;
  link: string;
};

export type SubmitDraftResponseType = {
  success: boolean;
  details: string;
  link: string;
};

export type FormErrorResponseType = {
  status: number;
  name: string;
  message: string;
};

type BBDetails = {
  interfaceCompliance: ComplianceDetails;
  deploymentCompliance: ComplianceDetails;
  requirementSpecificationCompliance: ComplianceDetails;
};

export type FormUpdatedObject = {
  bbDetails: Record<string, BBDetails>;
};

export type SubmittingFormResponseType = {
  success: boolean;
  errors?: [string];
  message?: string;
};

export type FilterOptionsType = {
  [key: string]: string[];
};

export type ListFilters = {
  software: { [key: string]: string[] };
  bb: { [key: string]: string[] };
};

// Types used in IRSC/IRSC...Table.tsx and the data connected to it
export type IRSCTableType = {
  selectedData: ComplianceRequirementsType;
  setUpdatedData: (data: ComplianceRequirementsType) => void;
  isTableValid: boolean;
  readOnlyView?: boolean;
  isFormActive?: boolean;
};

export type formatTranslationType =
  | string
  | JSX.Element
  | (string | JSX.Element)[]
  | undefined;
