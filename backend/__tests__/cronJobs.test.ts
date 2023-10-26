import { expect } from 'chai';
import sinon from 'sinon';
import { startCronJobs } from '../src/cronJobs';
import * as removeExpiredDrafts from '../src/cronJobs/removeExpiredDrafts';
import { appConfig } from '../src/config';

describe('Cron Job', () => {
    let clock;
    let removeSensitiveDataStub;
    let originalCronSchedule = appConfig.cron.removeExpiredDraftsSchedule;

    before(() => {
        clock = sinon.useFakeTimers(new Date(2023, 0, 1, 12, 0, 0).getTime());
        removeSensitiveDataStub = sinon.stub(removeExpiredDrafts, 'removeSensitiveDataFromExpiredDrafts');
        appConfig.cron.removeExpiredDraftsSchedule = '* * * * * *';
        startCronJobs();
    });

    after(() => {
        clock.restore();
        removeSensitiveDataStub.restore();
        appConfig.cron.removeExpiredDraftsSchedule = originalCronSchedule;
    });

    it('should execute the cron job and call removeSensitiveDataFromExpiredDrafts multiple times', async () => {
        for (let i = 0; i < 5; i++) {
            await clock.tickAsync(1000);
        }
        expect(removeSensitiveDataStub.callCount).to.be.greaterThan(1);
    });
});
