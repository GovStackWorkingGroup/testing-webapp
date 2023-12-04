import { expect } from 'chai';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ComplianceReport from '../src/db/schemas/compliance/compliance';
import { startCronJobs } from '../src/cronJobs';
import * as removeExpiredDrafts from '../src/cronJobs/removeExpiredDrafts';
import { appConfig } from '../src/config';
import sinon from 'sinon';
import ReportChecker from './testUtils';

describe('Cron Job', () => {
  let mongod;
  let clock;
  let originalCronSchedule = appConfig.cron.removeExpiredDraftsSchedule;

  // Setup for the cron job tests
  // This hook prepares the in-memory database, establishes a connection,
  // creates sample data, and configures the fake timers and cron job schedule.
  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    const currentDate = new Date("2023-10-30T12:00:00.000Z");
    const expiredDate = new Date("2023-10-29T12:00:00.000Z"); // One day in the past
    const futureDate = new Date("2023-10-31T12:00:00.000Z");

    await ComplianceReport.create({
      softwareName: "openIMIS",
      logo: "https://openIMIS.com/logo.png",
      website: "https://openIMIS.com",
      documentation: "https://openIMIS.com/doc1",
      pointOfContact: "contact@openIMIS.com",
      status: 0,
      expirationDate: futureDate,
      compliance: [],
      deploymentCompliance: {},
      description: "Sample description.",
      uniqueId: '550e8400-e29b-41d4-a716-446655440000',
    });

    await ComplianceReport.create({
      softwareName: "openIMIS",
      logo: "https://openIMIS.com/logo.png",
      website: "https://openIMIS.com",
      documentation: "https://openIMIS.com/doc1",
      pointOfContact: "contact@openIMIS.com",
      status: 0,
      expirationDate: expiredDate,
      compliance: [],
      deploymentCompliance: {},
      description: "Sample description.",
      uniqueId: '550e8400-e29b-41d4-a716-446655440001'
    });

    clock = sinon.useFakeTimers(currentDate.getTime());
    appConfig.cron.removeExpiredDraftsSchedule = '* * * * * *';
    startCronJobs();
  });

  // Teardown after all tests have been executed.
  // This hook is responsible for cleaning up resources
  // and restoring configurations to their original state.
  after(async () => {
    if (clock) {
      clock.restore();
    }
    appConfig.cron.removeExpiredDraftsSchedule = originalCronSchedule;
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should execute the cron job and call removeSensitiveDataFromExpiredDrafts multiple times', async () => {
    const stub = sinon.stub(removeExpiredDrafts, 'removeSensitiveDataFromExpiredDrafts');

    for (let i = 0; i < 5; i++) {
      await clock.tickAsync(1000);
    }

    expect(stub.callCount).to.be.greaterThanOrEqual(5);
    stub.restore();
  });

  it('should actually remove sensitive data from expired drafts', async () => {
    await removeExpiredDrafts.removeSensitiveDataFromExpiredDrafts();

    const expiredReports = await ComplianceReport.find({ expirationDate: { $lt: new Date() } }).exec();
    const nonExpiredReports = await ComplianceReport.find({ expirationDate: { $gte: new Date() } }).exec();
    const optionalFields = ['__v', 'id', 'uniqueId', 'status', 'deploymentCompliance'];
    const requiredFieldsForExpired = ['uniqueId', 'expirationDate'];
    ReportChecker.checkReports(expiredReports, requiredFieldsForExpired, optionalFields);

    const requiredFieldsForNonExpired = ['softwareName', 'logo', 'website', 'documentation', 'pointOfContact', 'status', 'compliance', 'description'];
    ReportChecker.checkReports(nonExpiredReports, requiredFieldsForNonExpired, optionalFields);
  });

});
