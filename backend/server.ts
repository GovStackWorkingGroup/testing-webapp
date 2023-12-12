/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import path from 'path';
import { apiKeyAuth } from '@vpriem/express-api-key-auth';

import { appConfig } from './src/config';
import { createConnection } from './src/db/connection';

import reportController from './src/controllers/reportController';
import complianceController from "./src/controllers/complianceController";

import reportRepository from './src/repositories';
import complianceRepository from "./src/repositories/complianceRepository";

import mongoReportRepository from './src/db/repositories/reportRepository';
import mongoComplianceRepository from "./src/db/repositories/complianceRepository";

import buildReportRoutes from './src/routes/record';
import buildComplianceRoutes from "./src/routes/compliance";
import { startCronJobs } from "./src/cronJobs";
import buildAuthRoutes from "./src/routes/auth";

const port: number = parseInt(process.env.PORT as string, 10) || 5000;
const app =  express();

createConnection(appConfig).connectToMongo();
app.use(cors());
app.use('d', apiKeyAuth(/^API_KEY_/)); // Matching all process.env.API_KEY_*

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(buildReportRoutes(reportController(reportRepository, mongoReportRepository)));
app.use(buildComplianceRoutes(complianceController(complianceRepository, mongoComplianceRepository)));
app.use(buildAuthRoutes());

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  startCronJobs();
});

export default app;

