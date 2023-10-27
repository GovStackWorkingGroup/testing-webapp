import { expect } from 'chai';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ComplianceReport from '../src/db/schemas/compliance';
import { startCronJobs } from '../src/cronJobs';
import * as removeExpiredDrafts from '../src/cronJobs/removeExpiredDrafts';
import { appConfig } from '../src/config';
import sinon from 'sinon';

describe('Cron Job', () => {
    let mongod;
    let clock;
    let originalCronSchedule = appConfig.cron.removeExpiredDraftsSchedule;

    before(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        await mongoose.connect(uri);

        const currentDate = new Date();
        const expiredDate = new Date(currentDate);
        expiredDate.setDate(expiredDate.getDate() - 1);
        const futureDate = new Date(currentDate);
        futureDate.setDate(futureDate.getDate() + 1);

        await ComplianceReport.create({
            softwareName: "openIMIS",
            logo: "https://openIMIS.com/logo.png",
            website: "https://openIMIS.com",
            documentation: ["https://openIMIS.com/doc1", "https://openIMIS.com/doc2"],
            pointOfContact: "contact@openIMIS.com",
            status: 0,
            expirationDate: new Date("2024-11-24T00:00:00.000Z"),
            compliance: [],
            link: "12345"
        });
        
        await ComplianceReport.create({
            softwareName: "openIMIS",
            logo: "https://openIMIS.com/logo.png",
            website: "https://openIMIS.com",
            documentation: ["https://openIMIS.com/doc1", "https://openIMIS.com/doc2"],
            pointOfContact: "contact@openIMIS.com",
            status: 0,
            expirationDate: new Date("2022-11-24T00:00:00.000Z"),
            compliance: [],
            link: "123456"
        });

        clock = sinon.useFakeTimers(currentDate.getTime());
        appConfig.cron.removeExpiredDraftsSchedule = '* * * * * *';
        startCronJobs();
    });

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

        expect(stub.callCount).to.be.greaterThan(1);
        stub.restore();
    });

    it('should actually remove sensitive data from expired drafts', async () => {
        await removeExpiredDrafts.removeSensitiveDataFromExpiredDrafts();
        
        const expiredReports = await ComplianceReport.find({ 
          expirationDate: { $lt: new Date() } 
        }).exec();
      
        const nonExpiredReports = await ComplianceReport.find({ 
          expirationDate: { $gte: new Date() } 
        }).exec();
        
        const reportsAfterUpdate = await ComplianceReport.find({}).exec();

        expiredReports.forEach(report => {
            const reportObj = report.toObject();
          
            expect(reportObj).to.have.property('link');
            expect(reportObj).to.have.property('expirationDate');
          
            const sensitiveFields = ["softwareName", "logo", "website", "documentation", "pointOfContact", "compliance", "status"];
            sensitiveFields.forEach(field => {
              expect(reportObj[field]).to.satisfy(val => val === undefined || val === null || (Array.isArray(val) && val.length === 0));
            });
          });
      
          nonExpiredReports.forEach(report => {
            const expectedRequiredKeys = ['_id', 'softwareName', 'logo', 'website', 'documentation', 'pointOfContact', 'status', 'compliance'];
            const expectedOptionalKeys = ['__v', 'link', 'expirationDate'];
            const allExpectedKeys = [...expectedRequiredKeys, ...expectedOptionalKeys];
          
            const reportObj = report.toObject();
            const reportKeys = Object.keys(reportObj);
          
            expectedRequiredKeys.forEach(key => {
              expect(reportObj).to.have.property(key);
            });
          
            reportKeys.forEach(key => {
              expect(allExpectedKeys).to.include(key);
            });
          });
    });
});
