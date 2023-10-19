/// <reference path="../../@types/report/reportInterfaces.d.ts" />
import ReportUploadRequestHandler from '../useCases/report/reportSave/handleSaveRequest';
import { ReportGetProductRequestHandler } from '../useCases/report/productCompatibility/handleGetProductRequest';
import ProductCountRequestHandler from '../useCases/report/productCount/handleGetProductCountRequest';
import ProductDetailsRequestHandler from '../useCases/report/productTestCases/handleGetProductDetailsRequest';
import { default500Error } from './controllerUtils';
import ReportGetBuildingBlocksRequestHandler from '../useCases/report/buildingBlocks/handleGetBuildingBlocksRequest';
import { Request, Response } from 'express';
import 'multer';


const reportController = (
  reportDbRepository: (impl: ReportInterfaces.ReportRepository) => ReportInterfaces.ReportRepository,
  reportDbRepositoryImpl: ReportInterfaces.ReportRepository
): ReportInterfaces.ReportController => {
  const repository = reportDbRepository(reportDbRepositoryImpl);

  const saveReport = (req: Request, res: Response): void => {
    if (!req.files) {
      res.status(400).send('Invalid form, file not provided.');
      return;
    }

    new ReportUploadRequestHandler(req, res)
      .saveData(repository)
      .catch((err: any) => default500Error(res, err));
  };

  const getProductCompatibility = (req: Request, res: Response): void => {
    new ReportGetProductRequestHandler(req, res)
      .getReports(repository)
      .catch((err: any) => default500Error(res, err));
  };

  const getProductsCount = (req: Request, res: Response): void => {
    new ProductCountRequestHandler(req, res)
      .getProductsCount(repository)
      .catch((err: any) => default500Error(res, err));
  };

  const getProductDetails = (req: Request, res: Response): void => {
    new ProductDetailsRequestHandler(req, res)
      .getProductDetails(repository)
      .catch((err: any) => default500Error(res, err));
  };

  const getBuildingBlocks = (req: Request, res: Response): void => {
    new ReportGetBuildingBlocksRequestHandler(req, res)
      .getBuildingBlocks(repository)
      .catch((err: any) => res.status(500).send(`Unexpected exception occurred: ${err}`));
  };

  return {
    saveReport,
    getProductCompatibility,
    getProductsCount,
    getProductDetails,
    getBuildingBlocks,
  };
};

export default reportController;
