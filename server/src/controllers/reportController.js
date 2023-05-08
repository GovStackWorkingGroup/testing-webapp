const ReportUploadRequestHandler = require('../useCases/report/reportSave/handleSaveRequest');
const ReportProductGetRequestHandler = require('../useCases/report/productCompatibility/handleGetProductRequest');
const ProductCountRequestHandler = require('../useCases/report/productCount/handleGetProductCountRequest');
const ProductDetailsRequestHandler = require('../useCases/report/productTestCases/handleGetProductDetailsRequest');
const ReportGetBuildingBlocksRequestHandler = require('../useCases/report/buildingBlocks/handleGetBuildingBlocksRequest');

const reportController = (reportDbRepository, reportDbRepositoryImpl) => {
  const repository = reportDbRepository(reportDbRepositoryImpl);

  const saveReport = (req, res) => {
    if (!req.files) {
      res.status(400).send('Invalid form, file not provided.');
      return;
    }

    new ReportUploadRequestHandler(req, res)
      .saveData(repository)
      .catch((err) => res.status(500).send(`Unexpected exception occurred: ${err}`));
  };

  const getProductCompatibility = (req, res) => {
    new ReportProductGetRequestHandler(req, res)
      .getReports(repository)
      .catch((err) => res.status(500).send(`Unexpected exception occurred: ${err}`));
  };

  const getProductsCount = (req, res) => {
    new ProductCountRequestHandler(req, res)
      .getProductsCount(repository)
      .catch((err) => res.status(500).send(`Unexpected exception occurred: ${err}`));
  };

  const getProductDetails = (req, res) => {
    new ProductDetailsRequestHandler(req, res)
      .getProductDetails(repository)
      .catch((err) => res.status(500).send(`Unexpected exception occurred: ${err}`));
  };

  const getBuildingBlocks = (req, res) => {
    new ReportGetBuildingBlocksRequestHandler(req, res)
      .getBuildingBlocks(repository)
      .catch((err) => res.status(500).send(`Unexpected exception occurred: ${err}`));
  };

  return {
    saveReport,
    getProductCompatibility,
    getProductsCount,
    getProductDetails,
    getBuildingBlocks,
  };
};

module.exports = reportController;
