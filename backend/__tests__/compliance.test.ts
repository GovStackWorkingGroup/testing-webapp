import chai, { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import ComplianceReport from '../src/db/schemas/compliance/compliance';
import complianceDataApp from './testData/complianceTestData.json';

describe('Compliance API', () => {
  let mongod;
  let createdCompliance;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    const complianceData = {
      softwareName: "openIMIS",
      logo: "https://openIMIS.com/logo.png",
      website: "https://openIMIS.com",
      documentation: "https://openIMIS.com/doc1",
      pointOfContact: "contact@openIMIS.com",
      status: 0,
      uniqueId: "550e8400-e29b-41d4-a716-446655440001",
      expirationDate: new Date("2024-11-24T00:00:00.000Z"),
      description: "Sample description.",
      deploymentCompliance: {
        "documentation": "https://openIMIS.com/doc1",
        "deploymentInstructions": "github.com/openIMIS",
        "requirements": [{ "requirement": "re1", "level": 1 }]
      },
      compliance: [
        {
          version: "23Q3",
          bbDetails: {
            "bb-digital registries": {
              bbSpecification: "SpecificationA",
              bbVersion: "1.2.0",
              submissionDate: new Date("2025-10-01T14:48:00.000Z"),
              status: 0,
              deploymentCompliance: 1,
              requirementSpecificationCompliance: {
                level: 1,
                crossCuttingRequirements: [
                  { requirement: "Req1", comment: "Comment1", fulfillment: 1, status: 0 },
                ],
                functionalRequirements: [
                  { requirement: "FuncReq1", comment: "FuncComment1", fulfillment: 1, status: 2 },
                ]
              },
              interfaceCompliance: {
                level: 2,
                testHarnessResult: "ResultA",
                requirements: [
                  { requirement: "InterReq1", comment: "InterComment1", fulfillment: 1, status: 0 },
                ]
              }
            },
          }
        },
      ]
    };
    await ComplianceReport.create(complianceData);
    createdCompliance = await ComplianceReport.create(complianceDataApp[0]);
  
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
  });

  describe('GET /compliance/list', () => {
    it('should return status 200', async () => {
      const res = await request(app).get('/compliance/list');
      expect(res.statusCode).to.equal(200);
    });

    it('should have the expected format', async () => {
      const res = await request(app).get('/compliance/list');
      expect(res.statusCode).to.equal(200);

      const responseData = res.body;
      expect(responseData).to.be.an('object');
      expect(responseData).to.have.all.keys('count', 'data');
      expect(responseData.count).to.be.a('number');
    
      const { data } = responseData;
      expect(data).to.be.an('object');
    
      for (const softwareName in data) {
        expect(data[softwareName]).to.be.an('array');
    
        data[softwareName].forEach(item => {
          expect(item).to.have.property('softwareVersion').that.is.a('string');
          expect(item).to.have.property('bb').that.is.a('string');
          expect(item).to.have.property('bbVersion').that.is.a('string');
          expect(item).to.have.property('status').that.is.oneOf([0, 1, 2, 3]);
          expect(item).to.have.property('submissionDate').to.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)$/);
          expect(item).to.have.property('deploymentCompliance').that.is.a('number');
          expect(item).to.have.property('requirementSpecificationCompliance').that.is.oneOf([null, -1, 1, 2]);
          expect(item).to.have.property('interfaceCompliance').that.is.oneOf([null, -1, 1, 2]);
        });
      }
    }); 
    
    it('should have the expected sorting', async () => {

      const res = await request(app).get('/compliance/list');
      const responseData = res.body;
      const { data } = responseData;
      expect(data).to.be.an('object');
      for (const softwareName in data) {
        const versions = data[softwareName].map(item => item.softwareVersion);
        // Check if the versions array is sorted lexicographically as strings
        for (let bbIndex = 0; bbIndex < versions.length - 1; bbIndex++) {
          expect(versions[bbIndex] >= versions[bbIndex + 1], `Versions in ${softwareName} are not sorted correctly`).to.be.true;
        }
      }
    });
  });
});