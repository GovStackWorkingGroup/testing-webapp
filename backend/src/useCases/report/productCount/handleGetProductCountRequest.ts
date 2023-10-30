/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { Request, Response } from 'express';

type ProductsCountCallback = (err: Error | null, result: any) => void;

interface Repository {
  productsCount: (params: { branch: string }, callback: ProductsCountCallback) => void;
}

export default class ProductCountRequestHandler {
  public req: Request;
  public res: Response;
  public dbConnect: any;

  constructor(request: Request, response: Response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getProductsCount(repository: Repository) {
    const { branch } = this.req.query;
    repository.productsCount({ branch: branch as string }, (err, result) => {
      if (err) {
        console.error(err);
        this.res.status(500).send(`Failed to fetch products count. Details: \n\t${err}`);
        return;
      }
      this.res.json(result[0]);
    });
  }
};
