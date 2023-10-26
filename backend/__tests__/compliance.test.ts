import { expect } from 'chai';
import request from 'supertest';
import app from '../server';

describe('Compliance API', () => {
  describe('GET /compliance/list', () => {
    it('should return status 200', async () => {
      const res = await request(app).get('/compliance/list');
      expect(res.statusCode).to.equal(200);
    });
  });
});
