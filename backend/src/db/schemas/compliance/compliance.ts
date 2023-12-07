import mongoose, { mongo } from 'mongoose';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { ComplianceReport } from 'myTypes';
import {
  BBStatusEnum,
  RequirementFulfillment,
  RequirementStatusEnum,
  SpecificationComplianceLevel,
  StatusEnum,
  validateComplianceDetailObject,
  validateRequiredObject,
  validateRequiredString,
  validateRequiredList,
  validateComplianceDetailRequiredString,
} from './complianceUtils';

// Requirements Schema
export const RequirementSchema = new mongoose.Schema({
  requirement: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    default: ''
  },
  fulfillment: {
    type: Number,
    enum: Object.values(RequirementFulfillment),
    required: false
  },
  status: {
    type: Number,
    enum: Object.values(RequirementStatusEnum),
    default: RequirementStatusEnum.REQUIRED
  },
});

const interfaceComplianceSchema = new mongoose.Schema({
  level: {
    type: Number,
    enum: Object.values(SpecificationComplianceLevel),
    default: SpecificationComplianceLevel.NA,
  },
  testHarnessResult: {
    type: String,
    default: '',
  },
  requirements: {
    type: [RequirementSchema],
    default: [], // Set the default value as an empty array
  }
})

const requirementSpecificationComplianceSchema = new mongoose.Schema({
  level: {
    type: Number,
    enum: Object.values(SpecificationComplianceLevel),
    default: SpecificationComplianceLevel.NA,
  },
  crossCuttingRequirements: {
    type: [RequirementSchema],
    default: [],
  },
  functionalRequirements: {
    type: [RequirementSchema],
    default: [],
  }
})

// SCHEMA FORM CONTENT
const ComplianceDetailSchema = new mongoose.Schema({
  bbSpecification: {
    type: String,
    default: "",
    validate: {
      validator: validateComplianceDetailRequiredString,
      message: 'compliance bbDetails bbSpecification is required when status is not DRAFT'
    }
  },
  bbVersion: {
    type: String,
    default: "",
    validate: {
      validator: validateComplianceDetailRequiredString,
      message: 'compliance bbDetails bbVersion is required when status is not DRAFT'
    }
  },
  status: {
    type: Number,
    enum: Object.values(StatusEnum),
    default: BBStatusEnum.IN_REVIEW
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  deploymentCompliance: {
    type: Number,
    enum: Object.values(SpecificationComplianceLevel),
    default: SpecificationComplianceLevel.LEVEL_1,
  },
  interfaceCompliance: {
    default: {},
    type: interfaceComplianceSchema,
    validate: {
      validator: validateComplianceDetailObject,
      message: 'interfaceCompliance is required when status is not DRAFT'
    }
  },
  requirementSpecificationCompliance: {
    default: {},
    type: requirementSpecificationComplianceSchema,
    validate: {
      validator: validateComplianceDetailObject,
      message: 'requirementSpecificationCompliance is required when status is not DRAFT'
    }
  }
});

const ComplianceVersionSchema = new mongoose.Schema({
  version: {
    type: String,
  },
  bbDetails: {
    type: Map,
    of: ComplianceDetailSchema,
    required: true
  }
}); // Allow partial updates

const deploymentComplianceSchema = new mongoose.Schema({
  documentation: {
    type: String, // saved as string base64
    default: "",
    validate: {
      validator: validateRequiredString,
      message: 'DeploymentCompliance Documentation is required when status is not DRAFT'
    }
  },
  deploymentInstructions: {
    type: String,
    default: "",
    validate: {
      validator: validateRequiredString,
      message: 'DeploymentCompliance deploymentInstructions is required when status is not DRAFT'
    }
  },
  requirements: [{
    requirement: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      enum: Object.values(SpecificationComplianceLevel),
      default: SpecificationComplianceLevel.NA,
    },
  }]
})

const ComplianceReportSchema = new mongoose.Schema({
  softwareName: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true,
  },
  documentation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pointOfContact: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: Object.values(StatusEnum),
    default: StatusEnum.DRAFT
  },
  uniqueId: {
    type: String,
    validate: {
      validator: function (v) {
        return uuidValidate(v) && uuidVersion(v) === 4;
      },
      message: props => `${props.value} is not a valid version 4 UUID`
    }
  },
  expirationDate: {
    type: Date
  },
  deploymentCompliance: {
    type: deploymentComplianceSchema,
    default: () => ({}),
    validate: {
      validator: validateRequiredObject,
      message: 'DeploymentCompliance is required when status is not DRAFT'
    }
  },
  compliance: {
    type: [ComplianceVersionSchema],
    default: () => ([]),
    validate: {
      validator: validateRequiredList,
      message: 'Compliance is required when status is not DRAFT'
    }
  }
});

const ComplianceReport = mongoose.model('ComplianceReport', ComplianceReportSchema);

export default ComplianceReport;
