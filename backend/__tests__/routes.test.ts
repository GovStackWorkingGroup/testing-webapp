import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

describe('Unit test example for GET /report', () => {
  it('should return status 200', async () => {
    await request(app)
      .get('/report')
      .query({ limit: 10, offset: 0 }) // dodanie limitu i offsetu
      .expect(200);
  });
});