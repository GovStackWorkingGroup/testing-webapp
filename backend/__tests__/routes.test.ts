import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

describe('Unit test example for GET /report', () => {
  it('should return status 200', async () => {
    const res = await request(app).get('/report');
    expect(res.statusCode).to.equal(200);
  });
});