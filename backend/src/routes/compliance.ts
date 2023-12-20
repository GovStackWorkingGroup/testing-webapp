import express from 'express';
import PaginationMiddleware from '../middlewares/paginationMiddleware';
import { limiter } from '../config/index';
import { createFileUploadMiddleware } from '../middlewares/fileUpload';

const filesUpload = createFileUploadMiddleware();
const buildComplianceRoutes = (controller: any) => {
  const router = express.Router();


  router.get('/compliance/list', limiter, PaginationMiddleware.handlePaginationFilters, controller.getAllComplianceReports);
  router.get('/compliance/:softwareName/detail', limiter, controller.getSoftwareComplianceDetail);
  router.get('/compliance/forms/:id', limiter, controller.getFormDetail);
  router.get('/compliance/drafts/:id', limiter, controller.getDraftDetail);

  router.get('/compliance/requirements', limiter, controller.getAllBBRequirements);
  router.get('/compliance/requirements/:bbKey', limiter, controller.getBBRequirements);
  router.get('/compliance/bbs', limiter, controller.getBBs);

  router.post('/compliance/drafts', limiter, filesUpload, controller.createOrSubmitForm);

  router.post('/compliance/drafts/submit', limiter, controller.submitForm);
  router.patch('/compliance/forms/:id/accept', limiter, controller.acceptForm);
  router.patch('/compliance/forms/:id/reject', limiter, controller.rejectForm);
  router.patch('/compliance/forms/:id/update', limiter, controller.updateForm);

  router.patch('/compliance/drafts/:draftId', limiter, filesUpload, controller.editDraftForm);

  return router;
};

export default buildComplianceRoutes;
