import { schedule } from 'node-cron';
import removeSensitiveDataFromExpiredDrafts from './removeExpiredDrafts';
import { appConfig } from '../config';

export const startCronJobs = (): void => {
    schedule(appConfig.cron.removeExpiredDraftsSchedule, async () => {
      console.log('Running a job');
      try {
        await removeSensitiveDataFromExpiredDrafts();
      } catch (error) {
        console.error('An error occurred', error);
      }
    });
  };