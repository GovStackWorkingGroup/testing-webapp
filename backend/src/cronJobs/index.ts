import { schedule } from 'node-cron';
import { removeSensitiveDataFromExpiredDrafts } from './removeExpiredDrafts';
import { appConfig } from '../config';
import syncGitBookBBRequirements from './syncGitBookBBRequirements';

export const startCronJobs = (): void => {
  schedule(appConfig.cron.removeExpiredDraftsSchedule, async () => {
    console.log('Running a job to remove sensitive data from expired drafts');
    try {
      await removeSensitiveDataFromExpiredDrafts();
    } catch (error) {
      console.error('An error occurred', error);
    }
  });

  schedule(appConfig.cron.syncGitBookRequirementsSchedule, async () => {
    console.log('Running job to sync GitBook requirements');
    try {
      await syncGitBookBBRequirements();
    } catch (error) {
      console.error('An error occurred in syncGitBookRequirements', error);
    }
  });
};
