// Urls
export const COMPLIANCE_TESTING_DETAILS_PAGE =
  'softwareRequirementsCompliance/details/';
export const COMPLIANCE_TESTING_FORM = '/softwareRequirementsCompliance/form';
export const COMPLIANCE_TESTING_RESULT_PAGE = '/softwareRequirementsCompliance';

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
    label: 'app.interface_requirement_specification.label',
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
