/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import { MongoConnection } from './connectionStringBuilder';
import rateLimit from "express-rate-limit"; 

dotenv.config();

interface AppConfig {
  appName: string;
  isProduction: boolean;
  mongoConnection: MongoConnection;
  draftExpirationTime: number
}

const appConfig: AppConfig = {
  appName: process.env.appName || 'testing-webapp-api',
  isProduction: process.env.envName ? process.env.envName === 'prod' : false,
  mongoConnection: new MongoConnection(),
  // Time is specified in milliseconds.
  draftExpirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, 
  message: "Too many requests from this IP, please try again later."
});

export {
  appConfig,
  limiter
};
