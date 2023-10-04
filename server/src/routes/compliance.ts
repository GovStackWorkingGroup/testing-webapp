import express from 'express';

const buildComplianceRoutes = (controller: any) => {
  const router = express.Router();

  router.get('/compliance/list', controller.getAllComplianceReports);

  return router;
};

export default buildComplianceRoutes;