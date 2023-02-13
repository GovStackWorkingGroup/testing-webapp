const mongoose = require('mongoose');

const MetaSchema = {
  protocolVersion: String,
  implementation: {
    version: String,
    name: String,
  },
  cpu: {
    name: String,
  },
  os: {
    name: String,
    version: String,
  },
  runtime: {
    name: String,
    version: String,
  },
};

const TimeStamp = {
  seconds: {
    type: 'Number',
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
  nanos: {
    type: 'Number',
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
};

const Step = {
  start: TimeStamp,
  finish: TimeStamp,
  result: {
    duration: TimeStamp,
    status: String,
  },
  text: String,
  type: { type: String },
};

const GherkinDocument = {
  feature: {
    tags: mongoose.Schema.Types.Mixed,
    location: {
      line: Number,
      column: Number,
    },
    language: String,
    keyword: String,
    name: String,
    description: String,
    children: [mongoose.Schema.Types.Mixed],
  },
  comments: [],
  uri: String,
};

const TestCase = {
  source: {
    data: String,
    uri: String,
    mediaType: String,
  },
  gherkinDocument: GherkinDocument,
  steps: [Step],
  start: {
    attempt: Number,
    testCaseId: String,
    id: String,
    timestamp: TimeStamp,
  },
  finish: {
    testCaseStartedId: String,
    timestamp: TimeStamp,
    willBeRetried: Boolean,
  },
  name: String,
  passed: Boolean,
};

const TestReportSchema = new mongoose.Schema({
  meta: MetaSchema,
  start: {
    timestamp: TimeStamp,
  },
  finish: {
    timestamp: TimeStamp,
    success: Boolean,
  },
  testCases: [TestCase],
  saveTime: Number,
  buildingBlock: String,
  testSuite: String,
  testApp: String,
  sourceBranch: String,
});

const ReportModel = mongoose.model('Report', TestReportSchema);

module.exports = ReportModel;
