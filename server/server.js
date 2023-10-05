/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const { apiKeyAuth } = require('@vpriem/express-api-key-auth');
const { connection } = require('./src/db/connection');
const reportController = require('./src/controllers/reportController');
const { reportRepository } = require('./src/repositories');
const mongoReportRepository = require('./src/db/repositories/reportRepository');
const buildReportRoutes = require('./src/routes/record');
const config = require('./src/config');

const port = process.env.PORT || 5000;
const app = express();

connection(config.appConfig).connectToMongo();
app.use(cors());
app.use('/report/upload', apiKeyAuth(/^API_KEY_/)); // Matching all process.env.API_KEY_*

app.use(express.json());
app.use(buildReportRoutes(reportController(reportRepository, mongoReportRepository)));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

const startApp = async (startUpConfig) => {
  connection(startUpConfig.appConfig).connectToMongo();
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startApp(config); // If not in test mode, start app with default URI
}

module.exports = app;
