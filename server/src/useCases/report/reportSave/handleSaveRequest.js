/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const streamline = require('streamifier');
const { jsonToMessages } = require('@cucumber/json-to-messages');
const readline = require('readline');
const yaml = require('js-yaml');
const { validate } = require('jsonschema');
const MemoryStream = require('memorystream');
const TestCaseBuilder = require('./reportBuilder/testCaseBuilder');

const RequestSchema = {
  type: 'object',
  properties: {
    files: {
      type: 'Object',
      properties: {
        report: { type: 'Object' },
        meta: { type: 'Object' },
      },
      required: [
        'report',
      ],
    },
    body: {
      type: 'Object',
      properties: {
        buildingBlock: { type: 'string' },
        testSuite: { type: 'string' },
        testApp: { type: 'string' },
        sourceBranch: { type: 'string' },
        version: {type: 'string'},
      },
      required: [
        'buildingBlock',
        'testSuite',
        'testApp',
        'sourceBranch',
      ],
    },
    meta: { type: 'Object' },
  },
  required: [
    'files',
    'body',
  ],
};

module.exports = class ReportUploadRequestHandler {
  constructor(saveRequest, response) {
    this.req = saveRequest;
    this.res = response;
    this.dbConnect = saveRequest.app.locals.reportCollection;
  }

  async saveData(repository) {
    if (!this.isRequestValid()) {
      return false;
    }
    const dataToSave = new TestCaseBuilder(await this.loadData()).buildExecutionResult();
    const productMetaData = await this.loadProductInfo();
    await this.jsonSave(repository, dataToSave, productMetaData);
    return true;
  }

  isRequestValid() {
    const validationResult = validate(this.req, RequestSchema);
    if (validationResult.errors.length > 0) {
      this.sendValidationError(validationResult.errors);
      return false;
    }
    return true;
  }

  async readFirstLine(stream) {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      rl.once('line', (line) => {
        rl.close();
        resolve(line);
      });

      rl.once('error', (err) => {
        rl.close();
        reject(err);
      });
    });
  }

  isJSONFormat(line) {
    return line[0] === '[';
  }

  async loadData() {
    const items = [];
    const errors = [];

    const rl = await this.loadReportFromJsonFormatBuffer() || await this.loadReportFromBuffer();
    // eslint-disable-next-line no-restricted-syntax
    for await (const line of rl) {
      try {
        const searchTerm = '{';
        const indexOfFirst = line.indexOf(searchTerm);
        // Message format sometimes have artefacts at start of line
        const fixedLine = line.substring(indexOfFirst);
        items.push(JSON.parse(fixedLine));
      } catch (e) {
        console.log(e.stack);
        errors.push(e);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Failed to parse report, errors:\n${errors}`);
    }

    return items;
  }

  async loadReportFromJsonFormatBuffer() {
    try {
      const firstLine = await this.readFirstLine(
        streamline.createReadStream(this.req.files.report[0].buffer),
      );
      if (this.isJSONFormat(firstLine)) {
        let rawdata = this.req.files.report[0].buffer.toString();
        const memStream = new MemoryStream();
        await jsonToMessages(rawdata, memStream);
        memStream.end(); // End the memorystream writing
        const rl = readline.createInterface({
          input: streamline.createReadStream(memStream.read()),
          crlfDelay: Infinity,
        });
        return rl;
      }
    } catch (e) {
      console.log(e.stack);
    }
    return null;
  }

  async loadReportFromBuffer() {
    return readline.createInterface({
      input: streamline.createReadStream(this.req.files.report[0].buffer),
      crlfDelay: Infinity,
    });
  }

  async loadProductInfo() {
    // Product info is passed through META file field inside of payload.
    // It's not used in aggregation, and is not mandatory.
    // At the moment it provides information about product name.
    // If name is missing it's replaced with <testSuite> (missing META.yml).
    if (!this.req.files.META) {
      return {
        name: `${this.req.body.testApp} (candidate META.yml missing)`,
      };
    }
    const productMetaProperties = yaml.load(this.req.files.META[0].buffer);
    return productMetaProperties;
  }

  async jsonSave(repository, data, productMetaData) {
    const report = data;
    report.buildingBlock = this.req.body.buildingBlock;
    report.testSuite = this.req.body.testSuite;
    report.testApp = this.req.body.testApp;
    report.sourceBranch = this.req.body.sourceBranch;
    report.version = this.req.body.version;
    report.productMetaData = productMetaData;

    this.saveToDatabase(repository, report);
  }

  saveToDatabase(repository, data) {
    const { res } = this;

    repository.add(data, (err, result) => {
      if (err) {
        if (err.name === 'ValidationError') {
          res.status(404).send(err);
        } else {
          res.status(400).send(`Error inserting report: ${err}`);
        }
      } else {
        // eslint-disable-next-line no-underscore-dangle
        console.log(`Added a new report with id ${result._id}`);
        res.status(201).send({ success: true });
      }
    });
  }

  sendValidationError(errors) {
    this.res.status(400).send({
      success: false,
      details: `Invalid report format. Details on report parsing:\n${errors}\n`,
    });
  }
};
