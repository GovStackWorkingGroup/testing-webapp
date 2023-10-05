import { Request, Response } from 'express';
import GetAllComplianceReportsRequestHandler from '../useCases/compliance/handleGetAllComplianceReports';
import { default500Error } from './controllerUtils';
import { ComplianceDbRepository } from 'myTypes';

const complianceController = (
  complianceDbRepositoryConstructor: (impl: ComplianceDbRepository) => ComplianceDbRepository,
  complianceDbRepositoryImpl: ComplianceDbRepository
) => {
  const repository = complianceDbRepositoryConstructor(complianceDbRepositoryImpl);

  const getAllComplianceReports = (req: Request, res: Response): void => {
    new GetAllComplianceReportsRequestHandler(req, res, repository)
      .getAllComplianceReports()
      .catch((err: any) => default500Error(res, err));
  };

  return {
    getAllComplianceReports
  };
};

export default complianceController;
