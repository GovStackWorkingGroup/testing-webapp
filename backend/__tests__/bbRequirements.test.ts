import chai, { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import BBRequirements from '../src/db/schemas/bbRequirements';
import fs from 'fs';
import path from 'path';

describe('Compliance API', () => {
  let mongod;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    const testDataPath = path.join(__dirname, 'testData', 'bbRequirementsTestData.json');
    const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
    await BBRequirements.insertMany(testData); // Wstaw dane testowe do bazy danych

  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
  });

  describe('GET /compliance/bbs', () => {
    it('should return status 200', async () => {
      const res = await request(app).get('/compliance/bbs');
      expect(res.statusCode).to.equal(200);
    });

    it('should have the expected format', async () => {
      const res = await request(app).get('/compliance/bbs');
      expect(res.statusCode).to.equal(200);

      const responseData = res.body;
      expect(responseData).to.be.an('array');

      responseData.forEach(item => {
        expect(item).to.have.property('bb-key').that.is.a('string');
        expect(item).to.have.property('bb-name').that.is.a('string');
      });
    });
  });
});
