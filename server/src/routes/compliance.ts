import express from 'express';
import PaginationMiddleware from '../middlewares/paginationMiddleware';

const buildComplianceRoutes = (controller: any) => {
  const router = express.Router();

  router.get('/compliance/list', PaginationMiddleware.handlePaginationFilters, controller.getAllComplianceReports);

  return router;
};

export default buildComplianceRoutes;
