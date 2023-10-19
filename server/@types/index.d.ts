declare type ErrorType = (err: Error | null) => void;

declare module 'myTypes' {
    export enum StatusEnum {
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
  
    export interface ComplianceDetail {
      bbSpecification: string;
      bbVersion: string;
      status: StatusEnum;
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
  
    export interface ComplianceReport {
      softwareName: string;
      logo: string;
      website: string;
      documentation: string[];
      pointOfContact: string;
      compliance: ComplianceVersion[];
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
  
    type FindResult = ComplianceReport[];
    type AggregateResult = Record<string, any>;
    type SofwareDetailsResults = SoftwareDetailsResult[];

    export interface ComplianceDbRepository {
      findAll: () => Promise<FindResult>;
      aggregateComplianceReports: (limit, offset) => Promise<AggregateResult>;
      getSoftwareComplianceDetail: (softwareName: string) => Promise<SofwareDetailsResults>;
    }
  }
