import express from 'express';
import multer from 'multer';
import PaginationMiddleware from '../middlewares/paginationMiddleware';

const buildReportRoutes = (reportController: ReportInterfaces.ReportController) => {
  const reportRoutes = express.Router();

  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  const filesUpload = upload.fields([
    { name: 'report', maxCount: 1 },
    { name: 'META', maxCount: 1 },
  ]);
  reportRoutes.route('/report/upload').post(filesUpload, reportController.saveReport);
  reportRoutes
    .route('/report')
    .get(PaginationMiddleware.handlePaginationFilters, reportController.getProductCompatibility);
  reportRoutes.route('/report/count').get(reportController.getProductsCount);
  reportRoutes.route('/report/bbs').get(reportController.getBuildingBlocks);
  reportRoutes
    .route('/report/:id')
    .get(PaginationMiddleware.handlePaginationFilters, reportController.getProductDetails);

  return reportRoutes;
};

export default buildReportRoutes;
