import express from 'express';

const buildComplianceRoutes = (controller: any) => {
  const router = express.Router();

  router.get('/compliance/list', controller.getAllComplianceReports);
  router.get('/compliance/:softwareName/detail', controller.getSoftwareComplianceDetail);
  router.get('/compliance/forms/:id', controller.getFormDetail);

  return router;
};

export default buildComplianceRoutes;
