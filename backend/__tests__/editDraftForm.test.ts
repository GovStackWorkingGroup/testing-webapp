import chai, { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import ComplianceReport from '../src/db/schemas/compliance/compliance';
import complianceData from './testData/complianceTestData.json';
import { StatusEnum } from 'myTypes';

describe('Compliance API', () => {
  let mongod;

  before(async () => {

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);
    const createdCompliance = await ComplianceReport.create(complianceData[0]);

  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
  });

  describe('Compliance Report Draft Update', () => {
    it('should return status 200 and the data exists', async () => {
      const res = await request(app).get('/compliance/list');
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.not.be.empty;
    });

    it('should return an error when trying to update a non-existent report', async () => {
      const nonExistentUniqueId = '34e7dfbf-5de0-4146-8946-321378713533';
      const updateData = {
        softwareName: "Updated openIMIS",
      };

      const res = await request(app).patch(`/compliance/drafts/${nonExistentUniqueId}`).send(updateData);
      // expect(res.statusCode).to.equal(404); // Or another appropriate error code
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('error', 'Draft with unique ID 34e7dfbf-5de0-4146-8946-321378713533 does not exist.');
    });

  });

  describe('Compliance Report Draft Update with status not equal to draft', () => {
    const statuses = [
      { status: StatusEnum.IN_REVIEW, name: "Original Software Name", uniqueId: "34e7dfbf-5de0-4146-8946-387135333b22" },
      { status: StatusEnum.APPROVED, name: "Original Software Name APPROVED", uniqueId: "34e7dfbf-5de0-4146-8946-387135333b23"},
      { status: StatusEnum.REJECTED, name: "Original Software Name REJECTED", uniqueId: "34e7dfbf-5de0-4146-8946-387135333b24" },
    ];
  
    statuses.forEach(({ status, name, uniqueId }) => {
      it(`should not allow updating softwareName when status is ${status}`, async () => {
        let draftData = { ...complianceData[2], softwareName: name, status, uniqueId };
        let draft = await ComplianceReport.create(draftData);
        const updateData = { softwareName: "Updated Software Name" };
        const res = await request(app).patch(`/compliance/drafts/${draft.uniqueId}`).send(updateData);
  
        expect(res.statusCode).not.to.equal(200);
        expect(res.body).to.have.property('success', false);
        expect(res.body).to.have.property('error', 'You cannot edit a form that is not in the draft status.');
  
        const updatedDraft = await ComplianceReport.findOne({ softwareName: draft.softwareName });
        expect(updatedDraft?.softwareName).to.equal(name);
      });
    });
  });
});
