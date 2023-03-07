const express = require('express');
const multer = require('multer');
const PaginationMiddleware = require('../middlewares/paginationMiddleware');

const buildReportRoutes = (reportController) => {
  const reportRoutes = express.Router();

  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  reportRoutes.route('/report/upload').post(upload.single('report'), reportController.saveReport);
  reportRoutes
    .route('/report')
    .get(PaginationMiddleware.handlePaginationFilters, reportController.getProductCompatibility);
  reportRoutes.route('/report/count').get(reportController.getProductsCount);
  return reportRoutes;
};

module.exports = buildReportRoutes;
