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
  draftExpirationTime: number,
  jira: {
    apiEndpoint: string;
    apiKey: string;
    email: string;
    projectKey: string;
    issueType: string;
    assigneeId: string;
    labels: string[];
    titleTemplate: string;
    descriptionTemplate: string;
  }
}

const appConfig: AppConfig = {
  appName: process.env.appName || 'testing-webapp-api',
  isProduction: process.env.envName ? process.env.envName === 'prod' : false,
  mongoConnection: new MongoConnection(),
  cron: {
    removeExpiredDraftsSchedule: '0 3 * * 0', // Run every Sunday at 3:00 AM
  },
  // Time is specified in milliseconds.
  draftExpirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  jira: {
    apiEndpoint: process.env.JIRA_API_ENDPOINT!,
    apiKey: process.env.JIRA_API_KEY!,
    projectKey: process.env.JIRA_PROJECT_KEY!,
    email: process.env.JIRA_USER_EMAIL!,
    issueType: process.env.JIRA_ISSUE_TYPE!,
    assigneeId: process.env.JIRA_ASSIGNEE_ID!,
    labels: process.env.JIRA_LABELS!.split(','),
    titleTemplate: process.env.JIRA_TITLE_TEMPLATE!,
    descriptionTemplate: process.env.JIRA_DESCRIPTION_TEMPLATE!, 
  },
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
