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

  router.post('/compliance/drafts', limiter, filesUpload, controller.createOrSubmitForm);
  
  router.get('/fetch_data', limiter, async (_req, res) => {
    // get collections 
    // /v1/orgs/pxmRWOPoaU8fUAbbcrus/collections
    // get spaces for collection P6VwekZdnw37TKGOdRc3
    // /v1/collections/0usSj5SjaAsqoOEju90C/spaces
    // get spaces of given collection
    // /v1/collections/0usSj5SjaAsqoOEju90C/spaces
    // get pages in given spaceId 
    // /v1/spaces/Vqte0R2TeBFaehnRpdeG/content
    // get content of given page
    // /v1/spaces/8B7scSfa9NpeR1BmaFM2/content/page/21tFDRp33yYrt2tJ5ifP
    // here we have to filter each heading 1 which starts with "5" and then filter out if there is info
    // if it is required
    try {
      const response = await processBBRequirements();
      res.json(response);
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        res.status(500).json({
          message: error.response.message,
          response: error.response.data,
          status: error.response.status,
        });
      } else {
        res.status(500).json({ message: error.message });
      }
    };

    
  });

  router.get('/fetch_data1', limiter, async (_req, res) => {
    try {
      const response = await gitBookClient.get(`/v1/orgs/pxmRWOPoaU8fUAbbcrus/collections`);
      res.json(response.data);
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        res.status(500).json({
          message: error.response.message,
          response: error.response.data,
          status: error.response.status,
        });
      } else {
        res.status(500).json({ message: error.message });
      }
    };

    
  });
  

  return router;
};

export default buildComplianceRoutes;
