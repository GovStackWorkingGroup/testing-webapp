import mongoose from 'mongoose';
import { ComplianceReport } from 'myTypes';

const validateRequiredIfNotDraftForForm = function(this: ComplianceReport, value: any) {
  return this.status == StatusEnum.DRAFT || (value != null && value.length > 0);
};

// SCHEMA FORM CONTENT
const StatusEnum = {
  DRAFT: 0,
  IN_REVIEW: 1,
  APPROVED: 2,
  REJECTED: 3
};

const RequirementStatusEnum = {
  REQUIRED: 0,
  RECOMMENDED: 1,
  OPTIONAL: 2
};

const SpecificationComplianceLevel = {
  NA: -1,
  LEVEL_1: 1,
  LEVEL_2: 2
};

const RequirementFulfillment = {
  MET: 1,
  NOT_MET: 0
};

// Requirements Schema
const RequirementSchema = new mongoose.Schema({
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
    required: true
  },
  status: {
    type: Number,
    enum: Object.values(RequirementStatusEnum),
    default: RequirementStatusEnum.REQUIRED
  },
});

// SCHEMA FORM CONTENT
const ComplianceDetailSchema = new mongoose.Schema({
  bbSpecification: {
    type: String,
    required: true
  },
  bbVersion: {
    type: String,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  deploymentCompliance: {
    isCompliant: {
      type: Boolean,
      required: true
    },
    details: {
      type: String
    },
    documentation: {
      files: [{
        type: String, // saved as string base64
        required: true
      }],
      containerLink: {
        type: String,
        required: true
      }
    }
  },
  requirementSpecificationCompliance: {
    level: {
      type: Number,
      enum: Object.values(SpecificationComplianceLevel),
      default: SpecificationComplianceLevel.NA,
    },
    crossCuttingRequirements: [RequirementSchema],
    functionalRequirements: [RequirementSchema]
  },
  interfaceCompliance: {
    level: {
      type: Number,
      enum: Object.values(SpecificationComplianceLevel),
      default: SpecificationComplianceLevel.NA,
    },
    testHarnessResult: {
      type: String,
      default: ''
    },
    requirements: [RequirementSchema]
  }
});

const ComplianceVersionSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true
  },
  bbDetails: {
    type: Map,
    of: ComplianceDetailSchema,
    required: true
  }
});

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
    unique: true
  },
  expirationDate: {
    type: Date
  },
  compliance: {
    type: [ComplianceVersionSchema],
    validate: {
      validator: validateRequiredIfNotDraftForForm,
      message: 'Compliance is required when status is not DRAFT'
    }
  }
});

const ComplianceReport = mongoose.model('ComplianceReport', ComplianceReportSchema);

export default ComplianceReport;
