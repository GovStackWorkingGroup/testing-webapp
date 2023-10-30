/* eslint-disable no-console */
import { Request, Response } from 'express';
import { Callback, CallbackError } from 'mongoose';

type AggregateCallback = (err: ErrorType, result: any) => void;

interface BuildingBlocksRepository {
  aggregateByBuildingBlock: (callback: Callback<any>) => void;
}

export default class ReportGetBuildingBlocksRequestHandler {
  
  public req: Request;
  public res: Response;
  public dbConnect: any;
  
  constructor(request: Request, response: Response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getBuildingBlocks(repository: BuildingBlocksRepository) {
    repository.aggregateByBuildingBlock(async (err: CallbackError | null, result: any) => {
      if (err) {
        console.error(err);
        this.res.status(500).send(`Failed to fetch building blocks list. Details: \n\t${err}`);
        return;
      }
      this.res.json(result);
    });
  }
};
