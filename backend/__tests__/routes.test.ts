import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

describe('Unit test example for GET /report', () => {
  let mongod;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should return status 200', async () => {
    await request(app)
      .get('/report')
      .query({ limit: 10, offset: 0 })
      .expect(200);
  });
});
