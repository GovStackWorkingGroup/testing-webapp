/* eslint-disable max-classes-per-file */
export class TestCaseStep {
  public start: Date;
  public finish: Date;
  public result: any;
  public text: string;
  public type: string;

  constructor(start, finish, result, text, type) {
    this.start = start;
    this.finish = finish;
    this.result = result;
    this.text = text;
    this.type = type;
  }
}

export class TestCase {

  public source: string;
  public gherkinDocument: any;
  public steps: TestCaseStep[];
  public start: Date;
  public finish: Date;
  public name: string;
  public passed: boolean;

  constructor(source, gherkinDocument, steps, start, finish, name, passed) {
    this.source = source;
    this.gherkinDocument = gherkinDocument;
    this.steps = steps;
    this.start = start;
    this.finish = finish;
    this.name = name;
    this.passed = passed;
  }
}

export class TestExecution {

  public meta: any;
  public start: Date;
  public finish: Date;
  public testCases: TestCase[];
  public saveTime: number;

  constructor(meta, start, finish, testCases) {
    this.meta = meta;
    this.start = start;
    this.finish = finish;
    this.testCases = testCases;
    this.saveTime = Date.now();
  }
}
