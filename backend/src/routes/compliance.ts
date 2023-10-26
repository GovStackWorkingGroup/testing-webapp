import express from 'express';
import PaginationMiddleware from '../middlewares/paginationMiddleware';
import { limiter } from '../config/index';

const buildComplianceRoutes = (controller: any) => {
  const router = express.Router();

  router.get('/compliance/list', limiter, controller.getAllComplianceReports);
  router.get('/compliance/:softwareName/detail', limiter, controller.getSoftwareComplianceDetail);
  router.get('/compliance/forms/:id', limiter, controller.getFormDetail);

  return router;
};

export default buildComplianceRoutes;
