/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import mapQueryToSorting from '../requestUtils';
import { Model } from 'mongoose';

export default class ReportGetProductDetailsRequestHandler {

  public req: Request;
  public res: Response;
  public dbConnect: Model<Document>;

  constructor(request: Request, response: Response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getProductDetails(repository: ReportInterfaces.ReportRepository) {
    const {
      limit: queryLimit,
      offset: queryOffset,
    } = this.req.query;
    const {
      id,
    } = this.req.params;

    const limit = (typeof queryLimit === 'string') ? parseInt(queryLimit, 10) : 10; // Defaulting to 10 if undefined
    const offset = (typeof queryOffset === 'string') ? parseInt(queryOffset, 10) : 0; // Defaulting to 0 if undefined

    const mapQueryToMongo = {
      'sort.name': 'endpoint',
      'sort.method': 'method',
      'sort.status': 'passed',
      'sort.uri': 'uri',
    };
    const sorting = mapQueryToSorting(this.req.query, mapQueryToMongo);

    repository.aggregateBBDetailsByProductId({
      id,
    }, sorting, async (err: ErrorType, result: any) => {
      if (err) {
        console.error(err);
        this.res.status(500).send(`Failed to fetch detailed report summary. Details: \n\t${err}`);
        return;
      }

      const aggregatedResult = result[0];

      if (!aggregatedResult) {
        this.res.status(404).send(`Report with ID ${id} not found or has incorrect data structure`);
      } else {
        const paginatedAggregatedData = offset !== undefined
          ? aggregatedResult.data.slice(offset, limit + offset)
          : aggregatedResult.data.slice(0, limit);

        // build response object
        const finalResult = {};
        Object.assign(finalResult, {
          compatibilities: aggregatedResult.compatibilities,
          data: paginatedAggregatedData,
          count: aggregatedResult.data.length,
        });

        this.res.json(finalResult);
      }
    });
  }
};
