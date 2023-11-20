declare type ErrorType = (err: Error | null) => void;

declare module 'myTypes' {
  export const enum StatusEnum {
    DRAFT = 0,
    IN_REVIEW = 1,
    APPROVED = 2,
    REJECTED = 3
  }

  export enum SpecificationComplianceLevel {
    NA = -1,
    LEVEL_1 = 1,
    LEVEL_2 = 2
  }

  export const enum RequirementStatusEnum {
    REQUIRED = 0,
    RECOMMENDED = 1,
    OPTIONAL = 2
  }

  export interface ComplianceDetail {
    bbSpecification: string;
    bbVersion: string;
    submissionDate?: Date;
    deploymentCompliance: {
      isCompliant: boolean;
      details?: string;
    };
    requirementSpecificationCompliance: {
      level: SpecificationComplianceLevel;
    };
    interfaceCompliance: {
      level: SpecificationComplianceLevel;
    };
  }

  export interface ComplianceVersion {
    version: string;
    bbDetails: Map<string, ComplianceDetail>;
  }
  
  export interface DeploymentCompliance {
    documentation: string;
    deploymentInstructions: string;
    requirements: Requirement[];
  }
  
  export interface ComplianceReport {
    softwareName: string;
    logo: string;
    website: string;
    documentation: string;
    pointOfContact: string;
    compliance: ComplianceVersion[];
    uniqueId?: string;
    expirationDate?: Date;
    deploymentCompliance: Partial<DeploymentCompliance>;
    status: StatusEnum;
  }

  export interface ComplianceDetailTransformed {
    interface: {
      level: SpecificationComplianceLevel;
      note?: string;
    };
    requirementSpecification: {
      level: SpecificationComplianceLevel;
      note?: string;
    };
  }

  export interface BbDetailTransformed {
    [bbVersion: string]: ComplianceDetailTransformed;
  }

  export interface ComplianceVersionTransformed {
    version: string;
    bbDetails: {
      [bbName: string]: BbDetailTransformed;
    };
  }

  export interface SoftwareDetailsResult {
    softwareName: string;
    logo: string;
    website: string;
    documentation: string[];
    pointOfContact: string;
    compliance: ComplianceVersionTransformed[];
  }

  export interface FormDetailResult {
    interfaceCompliance: {
      testHarnessResult: string;
      requirements: Requirement[];
    };
    requirementSpecificationCompliance: {
      crossCuttingRequirements: Requirement[];
      functionalRequirements: Requirement[];
    };
    deploymentCompliance: {
      documentation: {
        files: string[];
        containerLink: string;
      }
    };
  }

  export interface Requirement {
    requirement: string;
    comment: string;
    fulfillment: number;
    status: RequirementStatusEnum;
  }

  // pipelines
  export interface SoftwareNameGroup {
    _id: string;
    records: ComplianceReport[];
  }

  export interface ComplianceAggregationListResult {
    data: SoftwareNameGroup[];
    count: number;
  }

  // BB Requirements
  export interface BBRequirement {
    bbName: string;
    bbKey: string;
    bbVersion: string;
    dateOfSave: Date;
    requirements: {
      crossCutting: Requirement[];
      functional: Requirement[];
    }
  }

  export type AllBBRequirements = BBRequirement[];

  type FindResult = ComplianceReport[];
  type SofwareDetailsResults = SoftwareDetailsResult[];
  type FormDetailsResults = FormDetailResult;

  export interface ComplianceDbRepository {
    findAll: () => Promise<FindResult>;
    aggregateComplianceReports: (limit: number, offset: number) => Promise<ComplianceAggregationListResult>;
    getSoftwareComplianceDetail: (softwareName: string) => Promise<SofwareDetailsResults>;
    getFormDetail: (formId: string) => Promise<FormDetailsResults>;
    createOrSubmitForm: (draftData: Partial<ComplianceReport>) => Promise<string>;
    editDraftForm: (draftId: string, updateData: Partial<ComplianceReport>) => Promise<void>;
    getAllBBRequirements: () => Promise<AllBBRequirements>;
    getBBRequirements(bbKey: string): Promise<BBRequirement[]>;
  }
}
