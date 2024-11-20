// Urls
export const COMPLIANCE_TESTING_DETAILS_PAGE =
  'requirements/details/';
export const COMPLIANCE_TESTING_FORM = '/requirements/form';
export const COMPLIANCE_TESTING_RESULT_PAGE = '/requirements';
export const API_TESTING_RESULT_PAGE = '/apiTesting';
export const DATA_PROTECTION_NOTICE_PAGE = '/data-protection-notice';
export const IMPRINT_PAGE = '/imprint';
export const CONFLUENCE_INSTRUCTIONS_LINK =
  'https://govstack-global.atlassian.net/wiki/spaces/GH/pages/376012801/Instructions+for+Software+Requirements+Compliance';

// Data
export const softwareComplianceFormSteps = [
  {
    label: 'app.software_attributes.label',
    step: 1,
  },
  {
    label: 'table.deployment_compliance.label',
    step: 2,
  },
  {
    label: 'app.api_requirement_specification.label',
    step: 3,
  },
  {
    label: 'app.evaluation_summary.label',
    step: 4,
  },
];

// Local storage
export const SOFTWARE_ATTRIBUTES_STORAGE_NAME = 'software_attributes';
export const DEPLOYMENT_COMPLIANCE_STORAGE_NAME = 'deployment_compliance';
export const INTERFACE_COMPLIANCE_STORAGE_NAME = 'interface_compliance';
export const REQUIREMENT_SPEC_STORAGE_NAME =
  'requirement_specification_compliance';

// Enums
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
