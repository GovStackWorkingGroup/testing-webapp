import express from 'express';
import PaginationMiddleware from '../middlewares/paginationMiddleware';

const buildComplianceRoutes = (controller: any) => {
  const router = express.Router();

  router.get('/compliance/list', controller.getAllComplianceReports);
  router.get('/compliance/:softwareName/detail', controller.getSoftwareComplianceDetail);

  return router;
};

export default buildComplianceRoutes;
