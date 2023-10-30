import mongoose from 'mongoose';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

// SCHEMA FORM CONTENT
const StatusEnum = {
  DRAFT: 0,
  IN_REVIEW: 1,
  APPROVED: 2,
  REJECTED: 3
};

const SpecificationComplianceLevel = {
  NA: -1,
  LEVEL_1: 1,
  LEVEL_2: 2
};

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
    }
  },
  requirementSpecificationCompliance: {
    level: {
      type: Number,
      enum: Object.values(SpecificationComplianceLevel),
      required: true
    }
  },
  interfaceCompliance: {
    level: {
      type: Number,
      enum: Object.values(SpecificationComplianceLevel),
      required: true
    }
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
  expirationDate: {
    type: Date
  },
  status: {
    type: Number,
    require: true
  },
  compliance: [ComplianceVersionSchema],
  uniqueId: {
    type: String,
    validate: {
      validator: function(v) {
        return uuidValidate(v) && uuidVersion(v) === 4;
      },
      message: props => `${props.value} is not a valid version 4 UUID`
    },
  }
});

const ComplianceReport = mongoose.model('ComplianceReport', ComplianceReportSchema);

export default ComplianceReport;
