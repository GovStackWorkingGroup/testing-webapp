/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/// <reference path="../../../../@types/report/reportInterfaces.d.ts" />
/// <reference path="../../../../@types/report/reportTypes.d.ts" />

import { jsonToMessages } from '@cucumber/json-to-messages';
import { Response } from 'express';
import { Model } from 'mongoose';
import { validate, ValidatorResult } from 'jsonschema';
import readline, { Interface } from 'readline';
import streamline from 'streamifier';
import yaml from 'js-yaml';

import MemoryStream from 'memorystream';
import TestCaseBuilder from './reportBuilder/testCaseBuilder';

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
        version: { type: 'string' },
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

export default class ReportUploadRequestHandler {
  public req: CommonTypes.MulterRequest;
  public res: Response;
  public dbConnect: Model<Document>;

  constructor(saveRequest: any, response: any) {
    this.req = saveRequest;
    this.res = response;
    this.dbConnect = saveRequest.app.locals.reportCollection;
  }

  async saveData(repository: ReportInterfaces.ReportRepository): Promise<boolean> {
    if (!this.isRequestValid()) {
      return false;
    }
    const executionResult: any = new TestCaseBuilder(
      await this.loadData()
    ).buildExecutionResult();

    const dataToSave: ReportInterfaces.TestReport = {
      ...(executionResult as unknown as ReportInterfaces.TestReport),
      buildingBlock: this.req.body.buildingBlock,
      testSuite: this.req.body.testSuite,
      testApp: this.req.body.testApp,
      sourceBranch: this.req.body.sourceBranch,
      version: this.req.body.version,
      productMetaData: await this.loadProductInfo(),
      start: {
        timestamp: {
          seconds: executionResult.start.getTime() / 1000,
          nanos: (executionResult.start.getMilliseconds() % 1000) * 1e6
        }
      },
    };

    await this.jsonSave(repository, dataToSave, dataToSave.productMetaData);
    return true;
  }

  isRequestValid(): boolean {
    const validationResult: ValidatorResult = validate(this.req, RequestSchema);
    if (validationResult.errors.length > 0) {
        this.sendValidationError(validationResult.errors);
        return false;
    }
    return true;
}

  async readFirstLine(stream: NodeJS.ReadableStream): Promise<string> {
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

  isJSONFormat(line: string): boolean {
    return line[0] === '[';
  }

  async loadData(): Promise<ReportInterfaces.ReportItem[]> {
    const items: ReportInterfaces.ReportItem[] = [];
    const errors: string[] = [];

    const rl = await this.loadReportFromJsonFormatBuffer() || await this.loadReportFromBuffer();
    // eslint-disable-next-line no-restricted-syntax
    for await (const line of rl) {
      try {
        const searchTerm = '{';
        const indexOfFirst = line.indexOf(searchTerm);
        const fixedLine = line.substring(indexOfFirst);
        items.push(JSON.parse(fixedLine));
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(e.stack);
          errors.push(`Failed to parse a line due to: ${e.message}`);
        } else {
          // Handle or log other kinds of thrown values if necessary
          errors.push(`Failed to parse a line due to an unexpected error.`);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(`Failed to parse report, errors:\n${errors}`);
    }

    return items;
  }

  async loadReportFromJsonFormatBuffer(): Promise<Interface | null> {
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.stack);
      } else {
        console.log('An unexpected error occurred:', e);
      }
    }
    return null;
  }

  async loadReportFromBuffer(): Promise<Interface> {
    return readline.createInterface({
      input: streamline.createReadStream(this.req.files.report[0].buffer),
      crlfDelay: Infinity,
    });
  }

  async loadProductInfo(): Promise<ReportTypes.MetaYamlOutput> {
    // Product info is passed through META file field inside of payload.
    // It's not used in aggregation, and is not mandatory.
    // At the moment it provides information about product name.
    // If name is missing it's replaced with <testSuite> (missing META.yml).
    if (!this.req.files.META) {
      return {
        name: `${this.req?.body?.testApp} (candidate META.yml missing)`,
      };
    }
    const productMetaProperties = yaml.load(this.req.files.META[0].buffer) as ReportTypes.MetaYamlOutput;
    return productMetaProperties;
  }

  async jsonSave(repository: ReportInterfaces.ReportRepository, data: ReportInterfaces.TestReport, productMetaData: any): Promise<void> {
    const report = data;
    report.buildingBlock = this.req.body.buildingBlock;
    report.testSuite = this.req.body.testSuite;
    report.testApp = this.req.body.testApp;
    report.sourceBranch = this.req.body.sourceBranch;
    report.version = this.req.body.version;
    report.productMetaData = productMetaData;

    this.saveToDatabase(repository, report);
  }

  saveToDatabase(repository: ReportInterfaces.ReportRepository, data: ReportInterfaces.TestReport): void {
    const { res } = this;

    repository.add(data, (err: any, result: any) => {
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

  sendValidationError(errors: any): void {
    this.res.status(400).send({
      success: false,
      details: `Invalid report format. Details on report parsing:\n${errors}\n`,
    });
  }
};
