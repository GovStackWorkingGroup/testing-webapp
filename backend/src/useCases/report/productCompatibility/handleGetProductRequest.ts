/* eslint-disable no-console */
import { Request, Response } from 'express'; 
import mapQueryToSorting from '../requestUtils';

interface Filters {
  limit: number;
  offset: number;
  branch: string;
}

interface Repository {
  aggregateCompatibilityByProduct(
    filters: Filters,
    sorting: any,
    callback: (err: Error | null, result: any) => void
  ): void;
}

export class ReportGetProductRequestHandler {
  public req: Request;
  public res: Response;
  public dbConnect: any;

  constructor(request: Request, response: Response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getReports(repository: Repository): Promise<void> {
    const { limit, offset, branch } = this.req.query;
    const mapQueryToMongo = {
      'sort.testApp': '_id.testApp',
      'sort.testSuite': '_id.testSuite',
      'sort.sourceBranch': '_id.sourceBranch',
      'sort.version': '_id.version',
      'sort.overallCompatibility': 'overallCompatibility',
      'sort.lastUpdate': 'lastUpdate',
    };
    const sorting = mapQueryToSorting(this.req.query, mapQueryToMongo);

    const filters: Filters = {
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      branch: branch as string
    };

    repository.aggregateCompatibilityByProduct(filters, sorting, async (err, result) => {
      if (err) {
        console.error(err);
        this.res.status(500).send(`Failed to fetch report summary. Details: \n\t${err}`);
        return;
      }
      this.res.json(result);
    });
  }
};
