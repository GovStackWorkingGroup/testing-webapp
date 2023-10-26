import express from 'express';
import PaginationMiddleware from '../middlewares/paginationMiddleware';
<<<<<<< HEAD:server/src/routes/compliance.ts
import { limiter } from '../config/index';
=======
>>>>>>> develop:backend/src/routes/compliance.ts

const buildComplianceRoutes = (controller: any) => {
  const router = express.Router();

<<<<<<< HEAD:server/src/routes/compliance.ts
  router.get('/compliance/list', limiter, controller.getAllComplianceReports);
  router.get('/compliance/:softwareName/detail', limiter, controller.getSoftwareComplianceDetail);
  router.get('/compliance/forms/:id', limiter, controller.getFormDetail);
=======
  router.get('/compliance/list', PaginationMiddleware.handlePaginationFilters, controller.getAllComplianceReports);
>>>>>>> develop:backend/src/routes/compliance.ts

  return router;
};

export default buildComplianceRoutes;
