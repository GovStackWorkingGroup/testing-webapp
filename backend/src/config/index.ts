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
    syncGitBookRequirementsSchedule: string;
    removeExpiredDraftsSchedule: string;
  };
  enableJiraIntegration: boolean,
  draftExpirationTime: number,
  frontendHost: string | undefined,
  jira: {
    apiEndpoint: string;
    domain: string;
    apiKey: string;
    email: string;
    projectKey: string;
    issueType: string;
    assigneeId: string;
    labels: string[];
    titleTemplate: string;
    descriptionTemplate: string;
  },
  gitBook: {
    baseURL: string;
    apiKey: string;
    orgId: string;
  };
  gitHub: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    devLoginMode: boolean,
  };
}

const appConfig: AppConfig = {
  appName: process.env.appName || 'testing-webapp-api',
  isProduction: process.env.envName ? process.env.envName === 'prod' : false,
  mongoConnection: new MongoConnection(),
  draftExpirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  frontendHost: process.env.FE_HOST,
  cron: {
    removeExpiredDraftsSchedule: '0 3 * * 0', // Run every Sunday at 3:00 AM
    syncGitBookRequirementsSchedule: '0 3 * * 0', // Run every Sunday at 3:00 AM
  },
  enableJiraIntegration: process.env.ENABLE_JIRA_INTEGRATION ? process.env.ENABLE_JIRA_INTEGRATION === 'true' : false,
  gitBook: {
    baseURL: process.env.GITBOOK_URL || '',
    apiKey: process.env.GITBOOK_API_KEY || '',
    orgId: process.env.GITBOOK_ORG_ID || '',
  },
  gitHub: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackUrl: process.env.GITHUB_CALLBACK_URL!,
    devLoginMode: process.env.GITHUB_DEV_LOGIN_MODE ? process.env.GITHUB_DEV_LOGIN_MODE === 'true' : false,
  },
  // Time is specified in milliseconds.
  jira: {
    apiEndpoint: process.env.JIRA_API_ENDPOINT!,
    domain: process.env.JIRA_API_DOMAIN!,
    apiKey: process.env.JIRA_API_KEY!,
    projectKey: process.env.JIRA_PROJECT_KEY!,
    email: process.env.JIRA_USER_EMAIL!,
    issueType: process.env.JIRA_ISSUE_TYPE!,
    assigneeId: process.env.JIRA_ASSIGNEE_ID!,
    labels: process.env.JIRA_LABELS ? process.env.JIRA_LABELS.split(',') : [],
    titleTemplate: process.env.JIRA_TITLE_TEMPLATE!,
    descriptionTemplate: process.env.JIRA_DESCRIPTION_TEMPLATE!, 
  },
};

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000, 
  message: "Too many requests from this IP, please try again later."
});

export {
  appConfig,
  limiter
};
