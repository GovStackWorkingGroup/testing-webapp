import { Request, Response } from 'express';
import GetAllComplianceReportsRequestHandler from '../useCases/compliance/handleGetAllComplianceReports';
import GetSoftwareComplianceDetailRequestHandler from '../useCases/compliance/handleGetSoftwareComplianceDetail';
import GetFormDetailRequestHandler from '../useCases/compliance/handleGetFormDetail';
import CreateDraftRequestHandler from '../useCases/compliance/handleCreateDraft';
import EditDraftRequestHandler from '../useCases/compliance/handleEditDraft';
import { default500Error } from './controllerUtils';
import { ComplianceDbRepository, StatusEnum } from 'myTypes';
import GetAllBBRequirementsRequestHandler from '../useCases/compliance/handleGetAllBBRequirements';
import GetBBRequirementsRequestHandler from '../useCases/compliance/handleGetBBRequirements';
import { validate as isUuid } from 'uuid';

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

  const getFormDetail = (req: Request, res: Response): void => {
    const id = req.params.id;
    let draftUuid, formId;
  
    if (isUuid(id)) {
      draftUuid = id;
    } else {
      formId = id;
    }

    new GetFormDetailRequestHandler(req, res, repository, formId, draftUuid)
      .getFormDetail()
      .catch((err: any) => default500Error(res, err));
  }

  const createOrSubmitForm = async (req: Request, res: Response): Promise<void> => {
    const status = req.body.status || StatusEnum.DRAFT;
    new CreateDraftRequestHandler(req, res, repository, status)
      .createOrSubmitForm()
      .catch((err: any) => default500Error(res, err));
  };

  const editDraftForm = async (req: Request, res: Response): Promise<void> => {
    const draftId = req.params.draftId;

    new EditDraftRequestHandler(req, res, repository)
      .editDraftForm(draftId)
      .catch((err: any) => default500Error(res, err));
  };
  
  const getAllBBRequirements = (req: Request, res: Response): void => {
    new GetAllBBRequirementsRequestHandler(req, res, repository)
      .getAllBBRequirements()
      .catch((err: any) => default500Error(res, err));
  };
  const getBBRequirements = (req: Request, res: Response): void => {
    const bbKey = req.params.bbKey;

    new GetBBRequirementsRequestHandler(req, res, repository, bbKey)
      .getBBRequirements()
      .catch((err: any) => default500Error(res, err));
  };

  return {
    getAllComplianceReports,
    getSoftwareComplianceDetail,
    getFormDetail,
    createOrSubmitForm,
    editDraftForm,
    getAllBBRequirements,
    getBBRequirements,
  };
};

export default complianceController;
