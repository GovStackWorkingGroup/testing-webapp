/// <reference types="mocha" />
import chai, { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import app from '../server';
import * as removeExpired from '../src/cronJobs/removeExpiredDrafts';
import * as syncGitBook from '../src/cronJobs/syncGitBookBBRequirements';
import * as lock from '../src/shared/maintenanceLock';
import { appConfig } from '../src/config';

describe('Maintenance API', () => {
  let token: string;

  before(() => {
    // Create a valid GitHub token
    token = jwt.sign({ user: 'test' }, appConfig.gitHub.jwtSecret);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should reject unauthorized requests', async () => {
    const res = await request(app).post('/maintenance/sync');
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'User not authorized');
  });

  it('should execute maintenance tasks when authenticated', async () => {
    const removeStub = sinon.stub(removeExpired, 'removeSensitiveDataFromExpiredDrafts').resolves();
    const syncStub = sinon.stub(syncGitBook, 'default').resolves();

    const res = await request(app)
      .post('/maintenance/sync')
      .set('Authorization', `Bearer ${token}`);

    expect(removeStub.calledOnce).to.be.true;
    expect(syncStub.calledOnce).to.be.true;
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      success: true,
      message: 'Maintenance tasks completed successfully'
    });
  });

  it('should prevent concurrent executions', async () => {
    sinon.stub(lock, 'acquireLock').returns(false);

    const res = await request(app)
      .post('/maintenance/sync')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(409);
    expect(res.body).to.deep.equal({
      success: false,
      message: 'Maintenance is already in progress'
    });
  });
});
