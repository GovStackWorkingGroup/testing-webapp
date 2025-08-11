import { schedule } from 'node-cron';
import { removeSensitiveDataFromExpiredDrafts } from './removeExpiredDrafts';
import { appConfig } from '../config';
import syncGitBookBBRequirements from './syncGitBookBBRequirements';
import { acquireLock, releaseLock } from '../shared/maintenanceLock';

export const startCronJobs = (): void => {
  schedule(appConfig.cron.removeExpiredDraftsSchedule, async () => {
    if (!acquireLock()) {
      console.log('Maintenance is already running, skipping remove expired drafts job');
      return;
    }

    console.log('Running a job to remove sensitive data from expired drafts');
    try {
      await removeSensitiveDataFromExpiredDrafts();
    } catch (error) {
      console.error('An error occurred', error);
    } finally {
      releaseLock();
    }
  });

  schedule(appConfig.cron.syncGitBookRequirementsSchedule, async () => {
    if (!acquireLock()) {
      console.log('Maintenance is already running, skipping sync GitBook requirements job');
      return;
    }

    console.log('Running job to sync GitBook requirements');
    try {
      await syncGitBookBBRequirements();
    } catch (error) {
      console.error('An error occurred in syncGitBookRequirements', error);
    } finally {
      releaseLock();
    }
  });
};
