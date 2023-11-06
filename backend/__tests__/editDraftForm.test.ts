import chai, { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import ComplianceReport from '../src/db/schemas/compliance';
import complianceData from './testData/complianceTestData.json'; 

describe('Compliance API', () => {
  let mongod;

  before(async () => {

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);
    const createdCompliance = await ComplianceReport.create(complianceData);
      
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
    console.log(res);
    console.log(res.body);
    // expect(res.statusCode).to.equal(404); // Or another appropriate error code
    expect(res.body).to.have.property('success', false);
    expect(res.body).to.have.property('error', 'Draft with unique ID 34e7dfbf-5de0-4146-8946-321378713533 does not exist.');
  });
  
});

});
