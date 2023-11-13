/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import { MongoConnection } from './connectionStringBuilder';
import rateLimit from "express-rate-limit"; 

dotenv.config();

interface AppConfig {
  appName: string;
  isProduction: boolean;
  mongoConnection: MongoConnection;
  cron: {
    removeExpiredDraftsSchedule: string;
  };
  draftExpirationTime: number;
  gitBook: {
    baseURL: string;
    apiKey: string;
    orgId: string;
  };
}

const appConfig: AppConfig = {
  appName: process.env.appName || 'testing-webapp-api',
  isProduction: process.env.envName ? process.env.envName === 'prod' : false,
  mongoConnection: new MongoConnection(),
  cron: {
    removeExpiredDraftsSchedule: '0 3 * * 0', // Run every Sunday at 3:00 AM
  },
  gitBook: {
    baseURL: process.env.GITBOOK_URL || '',
    apiKey: process.env.GITBOOK_API_KEY || '',
    orgId: process.env.GITBOOK_ORG_ID || '',
  },
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
