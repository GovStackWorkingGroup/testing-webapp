import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

import ReportModel from '../src/db/schemas/report';
import fs from 'fs';
import path from 'path';

const convertTypes = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (obj[key]['$oid']) {
          obj[key] = new mongoose.Types.ObjectId(obj[key]['$oid']);
        } else if (obj[key]['$numberLong']) {
          obj[key] = Number(obj[key]['$numberLong']);
        } else {
          convertTypes(obj[key]);
        }
      }
    }
  }
};

describe('Unit test example for GET /report', () => {
  let mongod;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    const sampleDataPath = path.join(__dirname, 'testData', 'reportTestData.json');
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));
    convertTypes(sampleData);
    await ReportModel.insertMany(sampleData);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should return status 200 and data in expected format', async () => {
    const response = await request(app)
      .get('/report')
      .query({ limit: 10, offset: 0 })
      .expect(200);
  
    expect(response.body).to.be.an('array');
  
    if (response.body.length > 0) {
      const item = response.body[0];
      expect(item).to.have.nested.property('_id.testApp').that.is.a('string');
      expect(item).to.have.nested.property('_id.testSuite').that.is.a('string');
      expect(item).to.have.nested.property('_id.sourceBranch').that.is.a('string');
      expect(item).to.have.property('compatibilities').that.is.an('array');
  
      if (item.compatibilities.length > 0) {
        const compatibility = item.compatibilities[0];
        expect(compatibility).to.have.property('id').that.is.a('string');
        expect(compatibility).to.have.property('buildingBlock').that.is.a('string');
        expect(compatibility).to.have.property('timestamp').that.is.a('number');
        expect(compatibility).to.have.property('saveTime').that.is.a('number');
        expect(compatibility).to.have.property('testsPassed').that.is.a('number');
        expect(compatibility).to.have.property('testsFailed').that.is.a('number');
        expect(compatibility).to.have.property('compatibility').that.is.a('number');
      }
  
      expect(item).to.have.property('overallCompatibility').that.is.a('number');
      expect(item).to.have.property('lastUpdate').that.is.a('number');
    }
  });
  
});
