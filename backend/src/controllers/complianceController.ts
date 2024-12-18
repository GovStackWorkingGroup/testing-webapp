import { Request, Response } from 'express';
import GetAllComplianceReportsRequestHandler, { AuthenticatedRequest } from '../useCases/compliance/handleGetAllComplianceReports';
import GetSoftwareComplianceDetailRequestHandler from '../useCases/compliance/handleGetSoftwareComplianceDetail';
import GetFormDetailRequestHandler from '../useCases/compliance/handleGetFormDetail';
import CreateDraftRequestHandler from '../useCases/compliance/handleCreateDraft';
import EditDraftRequestHandler from '../useCases/compliance/handleEditDraft';
import { default500Error } from './controllerUtils';
import { ComplianceDbRepository, StatusEnum } from 'myTypes';
import GetAllBBRequirementsRequestHandler from '../useCases/compliance/handleGetAllBBRequirements';
import GetBBRequirementsRequestHandler from '../useCases/compliance/handleGetBBRequirements';
import SubmitFormRequestHandler from '../useCases/compliance/handleSubmitForm';
import GetBBsRequestHandler from '../useCases/compliance/handleGetBBs';
import GetDraftDetailRequestHandler from '../useCases/compliance/handleGetDraftDetail';
import AcceptComplianceFormRequestHandler from '../useCases/compliance/handleAcceptForm';
import RejectComplianceFormRequestHandler from '../useCases/compliance/handleRejectForm';
import DeleteComplianceFormRequestHandler from '../useCases/compliance/handleDeleteForm';
import UpdateFormRequestHandler from '../useCases/compliance/handleUpdateForm';
import GetAvailableFiltersRequestHandler from '../useCases/compliance/handleGetAvailableFiltersRequestHandler';

const complianceController = (
  complianceDbRepositoryConstructor: (impl: ComplianceDbRepository) => ComplianceDbRepository,
  complianceDbRepositoryImpl: ComplianceDbRepository
) => {
  const repository = complianceDbRepositoryConstructor(complianceDbRepositoryImpl);

  const getAllComplianceReports = (req: AuthenticatedRequest, res: Response): void => {
    const isAuthenticated = Boolean(req.user); 
    new GetAllComplianceReportsRequestHandler(req, res, repository, isAuthenticated)
      .getAllComplianceReports()
      .catch((err: any) => default500Error(res, err));
  };

  const getAvailableFilters = (req: Request, res: Response): void => { 
    new GetAvailableFiltersRequestHandler(req, res, repository)
      .getAvailableFilters()
      .catch((err: any) => default500Error(res, err));
  }

  const getSoftwareComplianceDetail = (req: AuthenticatedRequest, res: Response): void => {
    const softwareName = req.params.softwareName;
    const isAuthenticated = Boolean(req.user);
    new GetSoftwareComplianceDetailRequestHandler(req, res, repository, softwareName, isAuthenticated)
      .getSoftwareComplianceDetail()
      .catch((err: any) => default500Error(res, err));
  };

  const getFormDetail = (req: Request, res: Response): void => {
    const formId = req.params.id;

    new GetFormDetailRequestHandler(req, res, repository, formId)
      .getFormDetail()
      .catch((err: any) => default500Error(res, err));
  };

  const getDraftDetail = (req: Request, res: Response): void => {
    const draftUuid = req.params.id;
    new GetDraftDetailRequestHandler(req, res, repository, draftUuid)
      .getDraftDetail()
      .catch((err: any) => default500Error(res, err));
  };

  const createOrSubmitForm = async (req: Request, res: Response): Promise<void> => {
    const status = req.body.status || StatusEnum.DRAFT;
    new CreateDraftRequestHandler(req, res, repository, status)
      .createOrSubmitForm()
      .catch((err: any) => default500Error(res, err));
  };

  const submitForm = async (req: Request, res: Response): Promise<void> => {
    new SubmitFormRequestHandler(req, res, repository)
      .submitForm()
      .catch((err: any) => default500Error(res, err));
  };

  const acceptForm = (req: Request, res: Response): void => {
    const reviewId = req.params.id;
    const updatedData = req.body;

    new AcceptComplianceFormRequestHandler(req, res, repository, reviewId, updatedData)
      .acceptForm()
      .catch((err: any) => default500Error(res, err));
  };

  const rejectForm = (req: Request, res: Response): void => {
    const reviewId = req.params.id;
    const updatedData = req.body;

    new RejectComplianceFormRequestHandler(req, res, repository, reviewId, updatedData)
      .rejectForm()
      .catch((err: any) => default500Error(res, err));
  };

  const updateForm = (req: Request, res: Response): void => {
    const formId = req.params.id;
    const updatedData = req.body;

    new UpdateFormRequestHandler(req, res, repository, formId, updatedData)
      .updateForm()
      .catch((err: any) => default500Error(res, err));
  };

  const deleteForm = (req: Request, res: Response): void => {
    const deleteId = req.params.id;

    new DeleteComplianceFormRequestHandler(req, res, repository, deleteId)
      .deleteForm()
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

  const getBBs = (req: Request, res: Response): void => {
    new GetBBsRequestHandler(req, res, repository)
      .getBBs()
      .catch((err: any) => default500Error(res, err));
  };

  return {
    getAllComplianceReports,
    getSoftwareComplianceDetail,
    getAvailableFilters,
    getFormDetail,
    getDraftDetail,
    createOrSubmitForm,
    submitForm,
    acceptForm,
    rejectForm,
    updateForm,
    deleteForm,
    editDraftForm,
    getAllBBRequirements,
    getBBRequirements,
    getBBs,
  };
};

export default complianceController;
