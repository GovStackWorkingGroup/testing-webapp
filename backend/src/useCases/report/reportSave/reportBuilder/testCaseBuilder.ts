import TestDataAggregation from './dataAggregation';
import { TestCaseStep, TestCase, TestExecution } from './dataModels';

export default class TestCaseBuilder {

  public testCaseInfo: any;
  public aggregatedData: any;

  constructor(testCaseInfo: any, DataAggregator: any = TestDataAggregation) {
    this.testCaseInfo = testCaseInfo;
    this.aggregatedData = new DataAggregator(testCaseInfo).aggregate().data;
  }

  buildExecutionResult(): TestExecution {
    if (!this.aggregatedData) {
      throw new Error('Data in TestCaseBuilder has to be aggregated using aggregateTestCaseInfo() before building executionResult');
    }

    return new TestExecution(
      this.aggregatedData.meta,
      this.aggregatedData.start,
      this.aggregatedData.finish,
      this.buildTestCases(),
    );
  }

  buildTestCases(): TestCase[] {
    const testCases: TestCase[] = [];
    const testCasesMap = new Map(Object.entries(this.aggregatedData.testCases));
    testCasesMap.forEach((testCase: any) => {
      const { pickleId, id } = testCase;
      const pickle = this.aggregatedData.pickles[pickleId];
      const source = this.aggregatedData.sources[pickle.uri];
      const gherkinDocument = this.aggregatedData.gherkinDocuments[pickle.uri];
      const start = this.aggregatedData.testCasesStarted[id];
      const finish = this.aggregatedData.testCasesFinished[start.id];
      const steps = this.buildTestCaseSteps(pickle);
      const passed = steps.filter((x) => x.result?.status === 'FAILED').length === 0;
      const { name } = pickle;
      testCases.push(new TestCase(
        source,
        gherkinDocument,
        steps,
        start,
        finish,
        name,
        passed,
      ));
    });

    return testCases;
  }

  buildTestCaseSteps(pickle: any): TestCaseStep[] {
    const steps: TestCaseStep[] = [];
    const testCaseStep = this.aggregatedData.testCases[pickle.id];

    pickle.steps.forEach((step) => {
      // First element of this list is testStepID, second is tesetCase mark
      const testStepId = testCaseStep
        .testSteps.filter((x) => !!x.pickleStepId && x.pickleStepId === step.id)[0].id;
      const start = this.aggregatedData.testCasesStepsStarted[testStepId];
      const finish = this.aggregatedData.testCasesStepsFinished[testStepId];
      // Finish entry in message sometimes is not parsed correctly
      const result = finish ? finish.testStepResult : {};
      const { text, type } = step;
      steps.push(new TestCaseStep(
        start.timestamp,
        finish ? finish.timestamp : null,
        result,
        text,
        type,
      ));
    });

    return steps;
  }
}
