import mongoose from 'mongoose';

// SCHEMA FORM CONTENT
const StatusEnum = {
  DRAFT: 0,
  IN_REVIEW: 1,
  APPROVED: 2,
  REJECTED: 3
};

<<<<<<< HEAD:server/src/db/schemas/compliance.ts
const RequirementStatusEnum = {
  REQUIRED: 0,
  RECOMMENDED: 1,
  OPTIONAL: 2
};

=======
>>>>>>> develop:backend/src/db/schemas/compliance.ts
const SpecificationComplianceLevel = {
  NA: -1,
  LEVEL_1: 1,
  LEVEL_2: 2
};

<<<<<<< HEAD:server/src/db/schemas/compliance.ts
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

=======
>>>>>>> develop:backend/src/db/schemas/compliance.ts
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
    default: StatusEnum.DRAFT
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
      required: true
<<<<<<< HEAD:server/src/db/schemas/compliance.ts
    },
    crossCuttingRequirements: [RequirementSchema],
    functionalRequirements: [RequirementSchema]
=======
    }
>>>>>>> develop:backend/src/db/schemas/compliance.ts
  },
  interfaceCompliance: {
    level: {
      type: Number,
      enum: Object.values(SpecificationComplianceLevel),
      required: true
<<<<<<< HEAD:server/src/db/schemas/compliance.ts
    },
    testHarnessResult: {
      type: String,
      default: ''
    },
    requirements: [RequirementSchema]
=======
    }
>>>>>>> develop:backend/src/db/schemas/compliance.ts
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
  documentation: [{
    type: String,
    required: true,
  }],
  pointOfContact: {
    type: String,
    required: true
  },
  compliance: [ComplianceVersionSchema]
});

const ComplianceReport = mongoose.model('ComplianceReport', ComplianceReportSchema);

export default ComplianceReport;
