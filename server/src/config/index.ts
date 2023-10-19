/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import { MongoConnection } from './connectionStringBuilder';
import rateLimit from "express-rate-limit"; 

dotenv.config();

interface AppConfig {
  appName: string;
  isProduction: boolean;
  mongoConnection: MongoConnection;
}

const appConfig: AppConfig = {
  appName: process.env.appName || 'testing-webapp-api',
  isProduction: process.env.envName ? process.env.envName === 'prod' : false,
  mongoConnection: new MongoConnection(),
};

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, 
  message: "Too many requests from this IP, please try again later."
});

export {
  appConfig,
  limiter
};
