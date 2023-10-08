import { Request, Response } from 'express';
import GetAllComplianceReportsRequestHandler from '../useCases/compliance/handleGetAllComplianceReports';
import GetSoftwareComplianceDetailRequestHandler from '../useCases/compliance/handleGetSoftwareComplianceDetail';
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

  const getSoftwareComplianceDetail = (req: Request, res: Response): void => {
    const softwareName = req.params.softwareName;

    new GetSoftwareComplianceDetailRequestHandler(req, res, repository, softwareName)
      .getSoftwareComplianceDetail()
      .catch((err: any) => default500Error(res, err));
  };

  return {
    getAllComplianceReports,
    getSoftwareComplianceDetail
  };
};

export default complianceController;
