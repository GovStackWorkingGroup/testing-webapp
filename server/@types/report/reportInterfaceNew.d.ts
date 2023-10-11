interface ReportRepository {
    add(report: TestReport | Document, callback: Callback): void;
    aggregateCompatibilityByProduct(filters: Filters, sorting: Record<string, number>, callback: Callback): void;
    productsCount(filters: Filters, callback: Callback): void;
    aggregateBBDetailsByProductId(params: { id: string; }, sorting: Record<string, number>, callback: Callback): void;
    aggregateByBuildingBlock(callback: Callback): void;
  }
  
  interface ReportItem {
    [key: string]: any;
  }
  
  interface ProductMetaData {
    name: string;
  }
  
  interface MetaSchema {
    protocolVersion?: string;
    implementation?: {
      version?: string;
      name?: string;
    };
    cpu?: {
      name?: string;
    };
    os?: {
      name?: string;
      version?: string;
    };
    runtime?: {
      name?: string;
      version?: string;
    };
  }
  
  interface TimeStamp {
    seconds: number;
    nanos: number;
  }
  
  interface Step {
    start: TimeStamp;
    finish: TimeStamp;
    result: {
      duration: TimeStamp;
      status: string;
    };
    text: string;
    type: string;
  }
  
  interface GherkinDocumentFeature {
    tags: any[];
    location: {
      line: number;
      column: number;
    };
    language: string;
    keyword: string;
    name: string;
    description: string;
    children: any[];
  }
  
  interface GherkinDocument {
    feature: GherkinDocumentFeature;
    comments: any[];
    uri: string;
  }
  
  interface TestCase {
    source: {
      data: string;
      uri: string;
      mediaType: string;
    };
    gherkinDocument: GherkinDocument;
    steps: Step[];
    start: {
      attempt: number;
      testCaseId: string;
      id: string;
      timestamp: TimeStamp;
    };
    finish: {
      testCaseStartedId: string;
      timestamp: TimeStamp;
      willBeRetried: boolean;
    };
    name: string;
    passed: boolean;
  }
  
  interface TestReport {
    meta: MetaSchema;
    productMetaData: ProductMetaData;
    start: {
      timestamp: TimeStamp;
    };
    finish: {
      timestamp: TimeStamp;
      success: boolean;
    };
    testCases: TestCase[];
    saveTime: number;
    buildingBlock: string;
    testSuite: string;
    testApp: string;
    sourceBranch: string;
    version: string;
  }
  
  interface AggregatedData {
    meta: any;
    start: any;
    finish: any;
    pickles: Record<string, any>;
    sources: Record<string, any>;
    gherkinDocuments: Record<string, any>;
    stepCasesDefinitions: Record<string, Record<string, any>>;
    testCases: Record<string, any>;
    testCasesStarted: Record<string, any>;
    testCasesFinished: Record<string, any>;
    testCasesStepsStarted: Record<string, any>;
    testCasesStepsFinished: Record<string, any>;
  }
  
  interface Filters {
    limit: number;
    offset: number;
    branch: string;
  }
  
  interface Repository123 {
    aggregateCompatibilityByProduct(
      filters: Filters,
      sorting: any,
      callback: (err: Error | null, result: any) => void
    ): void;
  }
  