import { Request, Response } from 'express';
import GetAllComplianceReportsRequestHandler from '../useCases/compliance/handleGetAllComplianceReports';
<<<<<<< HEAD:server/src/controllers/complianceController.ts
import GetSoftwareComplianceDetailRequestHandler from '../useCases/compliance/handleGetSoftwareComplianceDetail';
import GetFormDetailRequestHandler from '../useCases/compliance/handleGetFormDetail';
=======
>>>>>>> develop:backend/src/controllers/complianceController.ts
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

<<<<<<< HEAD:server/src/controllers/complianceController.ts
  const getSoftwareComplianceDetail = (req: Request, res: Response): void => {
    const softwareName = req.params.softwareName;

    new GetSoftwareComplianceDetailRequestHandler(req, res, repository, softwareName)
      .getSoftwareComplianceDetail()
      .catch((err: any) => default500Error(res, err));
  };

  const getFormDetail = (req: Request, res: Response): void => {
    const formId = req.params.id;

    new GetFormDetailRequestHandler(req, res, repository, formId)
      .getFormDetail()
      .catch((err: any) => default500Error(res, err));
  }

  return {
    getAllComplianceReports,
    getSoftwareComplianceDetail,
    getFormDetail
=======
  return {
    getAllComplianceReports
>>>>>>> develop:backend/src/controllers/complianceController.ts
  };
};

export default complianceController;
