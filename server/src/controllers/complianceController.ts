import { Request, Response } from 'express';
import GetAllComplianceReportsRequestHandler from '../useCases/compliance/handleGetAllComplianceReports';
import { default500Error } from './controllerUtils';

const complianceController = (complianceDbRepository: any, complianceDbRepositoryImpl: any) => {
  const repository = complianceDbRepository(complianceDbRepositoryImpl);

  const getAllComplianceReports = (req: Request, res: Response): void => {
    new GetAllComplianceReportsRequestHandler(req, res)
      .getAllComplianceReports(repository)
      .catch((err: any) => default500Error(res, err));
  };

  return {
    getAllComplianceReports
  };
};

export default complianceController;