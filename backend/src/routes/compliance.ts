import multer from 'multer';
import path from 'path';
import express from 'express';
import PaginationMiddleware from '../middlewares/paginationMiddleware';
import { limiter } from '../config/index';

const buildComplianceRoutes = (controller: any) => {
  const router = express.Router();

  const storage = multer.diskStorage({
    destination: (_req, _file, done) => done(null, 'uploads/'),
    filename: (_req, file, done) => done(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  });

  const filesUpload = multer({ storage }).fields([
    { name: 'logo', maxCount: 1 }
  ]);

  router.get('/compliance/list', limiter, PaginationMiddleware.handlePaginationFilters, controller.getAllComplianceReports);
  router.get('/compliance/:softwareName/detail', limiter, controller.getSoftwareComplianceDetail);
  router.get('/compliance/forms/:id', limiter, controller.getFormDetail);

  router.get('/compliance/requirements', limiter, controller.getAllBBRequirements);
  router.get('/compliance/requirements/:bbKey', limiter, controller.getBBRequirements);

  router.post('/compliance/drafts', limiter, filesUpload, controller.createOrSubmitForm);

  router.post('/compliance/drafts/submit', limiter, controller.submitForm);

  return router;
};

export default buildComplianceRoutes;
