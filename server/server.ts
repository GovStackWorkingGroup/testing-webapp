/* eslint-disable no-console */
import express from "express";

import cors from "cors";
import { apiKeyAuth } from '@vpriem/express-api-key-auth';
import { createConnection } from './src/db/connection';
import reportController from './src/controllers/reportController';
import reportRepository from './src/repositories';
import mongoReportRepository from './src/db/repositories/reportRepository';
import buildReportRoutes from './src/routes/record';
import { appConfig } from './src/config';

const port: number = parseInt(process.env.PORT as string, 10) || 5000;
const app =  express();

createConnection(appConfig).connectToMongo();
app.use(cors());
app.use('d', apiKeyAuth(/^API_KEY_/)); // Matching all process.env.API_KEY_*

app.use(express.json());
app.use(buildReportRoutes(reportController(reportRepository, mongoReportRepository)));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export default app;

