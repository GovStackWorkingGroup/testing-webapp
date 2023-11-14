import multer from 'multer';
import path from 'path';
import express from 'express';
import PaginationMiddleware from '../middlewares/paginationMiddleware';
import { appConfig, limiter } from '../config/index';

// to be relocated to other file:
import gitBookClient from '../services/gitBookService/gitBookClient';
import { processBBRequirements } from '../services/gitBookService/bbRequirementsProcessing';


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

  router.get('/compliance/requirements/:bbKey', limiter, controller.getBBRequirements);

  router.post('/compliance/drafts', limiter, filesUpload, controller.createOrSubmitForm);
  return router;
};

export default buildComplianceRoutes;
