import mongoose from 'mongoose';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { ComplianceReport } from 'myTypes';

const validateRequiredIfNotDraftForForm = function (this: ComplianceReport, value: any) {
  return this.status == StatusEnum.DRAFT || (value != null && value.length > 0);
};



// SCHEMA FORM CONTENT
const StatusEnum = {
  DRAFT: 0,
  IN_REVIEW: 1,
  APPROVED: 2,
  REJECTED: 3
};

const BBStatusEnum = {
  IN_REVIEW: 1,
  APPROVED: 2,
  REJECTED: 3
}

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
    isCompliant: {
      type: Boolean,
      required: true
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

const deploymentComplianceSchema = new mongoose.Schema({
  documentation: [{
    type: String, // saved as string base64
    required: true
  }],
  deploymentInstructions: {
    type: String,
    required: true
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
    type: [deploymentComplianceSchema],
    validate: {
      validator: validateRequiredIfNotDraftForForm,
      message: 'DeploymentCompliance is required when status is not DRAFT'
    }
  },
  compliance: {
    type: [ComplianceVersionSchema],
    validate: {
      validator: validateRequiredIfNotDraftForForm,
      message: 'Compliance is required when status is not DRAFT'
    }
  }
});

ComplianceDetailSchema.pre('save', function (next) {
  const complianceDetail = this;

  // Ensure requirementSpecificationCompliance exists before proceeding
  if (complianceDetail.requirementSpecificationCompliance) {
    const { crossCuttingRequirements, functionalRequirements } = complianceDetail.requirementSpecificationCompliance;

    // It's mandatory for IN_REVIEW status, but can be empty in DRAFT, where the user is expected to fill it out.
    crossCuttingRequirements.forEach(requirement => {
      if (complianceDetail.status !== StatusEnum.DRAFT && !requirement.fulfillment) {
        throw new Error('Fulfillment is required when status is not DRAFT.');
      }
    });

    functionalRequirements.forEach(requirement => {
      if (complianceDetail.status !== StatusEnum.DRAFT && !requirement.fulfillment) {
        throw new Error('Fulfillment is required when status is not DRAFT.');
      }
    });
  }

  next();
});
const ComplianceReport = mongoose.model('ComplianceReport', ComplianceReportSchema);

export default ComplianceReport;
