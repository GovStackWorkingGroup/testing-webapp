import mongoose from 'mongoose';

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
    type: String,
    enum: ['in review', 'approved', 'rejected'],
    default: 'in review'
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
      enum: [-1, 1, 2]
    },
    note: String
  },
  interfaceCompliance: {
    level: {
      type: Number,
      enum: [-1, 1, 2]
    },
    note: String
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
    match: /^http[s]?:\/\/.*/
  },
  documentation: [{
    type: String,
    required: true,
    match: /^http[s]?:\/\/.*/
  }],
  pointOfContact: {
    type: String,
    required: true
  },
  compliance: [ComplianceVersionSchema]
});

const ComplianceReport = mongoose.model('ComplianceReport', ComplianceReportSchema);

export default ComplianceReport;
