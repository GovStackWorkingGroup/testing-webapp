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
  let createdCompliance;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    createdCompliance = await ComplianceReport.create(complianceData[0]);

  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
  });

  describe('Submit draft', () => {
    it('should successfully submit the draft without errors', async () => {
      const submissionData = {
        uniqueId: createdCompliance.uniqueId
      };
      const res = await request(app).post('/compliance/drafts/submit').send(submissionData);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('link').that.is.a('string');
      expect(res.body).to.have.property('details').that.is.a('string');

      // Verify if the status of the report has been updated
      const updatedReport = await ComplianceReport.findById(createdCompliance._id);
      expect(updatedReport?.status).to.equal(StatusEnum.IN_REVIEW);
    });

    it('should block submission with missing basic info', async () => {
      let validCreatedCompliance: any = await ComplianceReport.create(complianceData[0]);
      validCreatedCompliance.softwareName = undefined;
      validCreatedCompliance.logo = undefined;
      validCreatedCompliance.website = undefined;
      validCreatedCompliance.documentation = undefined;
      validCreatedCompliance.pointOfContact = undefined;
      validCreatedCompliance.description = undefined;

      let error;
      try {
        await validCreatedCompliance.save();
      } catch (e) {
        error = e;
      }
      expect(error).to.be.an.instanceof(mongoose.Error.ValidationError);
      expect(error.errors.softwareName).to.exist;
      expect(error.errors.logo).to.exist;
      expect(error.errors.website).to.exist;
      expect(error.errors.documentation).to.exist;
      expect(error.errors.pointOfContact).to.exist;
      expect(error.errors.description).to.exist;

      expect(error.errors.softwareName.message).to.include('Path `softwareName` is required.');
      expect(error.errors.logo.message).to.include('Path `logo` is required.');
      expect(error.errors.website.message).to.include('Path `website` is required.');
      expect(error.errors.documentation.message).to.include('Path `documentation` is required.');
      expect(error.errors.pointOfContact.message).to.include('Path `pointOfContact` is required.');
      expect(error.errors.description.message).to.include('Path `description` is required.');

    });

    it('should block submission with missing deployment compliance', async () => {
      const {
        softwareName, logo, website,
        documentation, pointOfContact, status,
        expirationDate, description, compliance
      } = complianceData[0];

      let incompleteCompliance = await ComplianceReport.create({
        softwareName,
        logo,
        website,
        documentation,
        pointOfContact,
        status,
        uniqueId: "34e7dfbf-5de0-4146-8946-387135332555",
        expirationDate,
        description,
        compliance,
      });

      const submissionData = {
        uniqueId: incompleteCompliance.uniqueId
      };

      const res = await request(app).post('/compliance/drafts/submit').send(submissionData);
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('ComplianceReport validation failed');
      expect(res.body.error).to.include('deploymentCompliance.documentation: DeploymentCompliance Documentation is required when status is not DRAFT');
      expect(res.body.error).to.include('deploymentCompliance.deploymentInstructions: DeploymentCompliance deploymentInstructions is required when status is not DRAFT');
    });

    it('should block submission when deployment compliance lacks documentation and deployment instructions', async () => {
      const {
        softwareName, logo, website,
        documentation, pointOfContact, status,
        uniqueId, expirationDate, description, compliance
      } = complianceData[2];

      let incompleteCompliance3 = await ComplianceReport.create({
        softwareName,
        logo,
        website,
        documentation,
        pointOfContact,
        status,
        uniqueId,
        expirationDate,
        compliance,
        description,
        deploymentCompliance: {
          "deploymentInstructions": undefined,
          "requirements": [{ "requirement": "re1", "level": 1 }]
        },
      });

      const submissionData = {
        uniqueId: incompleteCompliance3.uniqueId
      };

      const res = await request(app).post('/compliance/drafts/submit').send(submissionData);
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('ComplianceReport validation failed');
    });

  });

  describe('Interface and Requirements Specification Validation', () => {


    it('should submit draft when interface is missing but requirements specification is present', async () => {
      // Extract necessary fields from a sample compliance data
      const {
        softwareName, logo, website,
        documentation, pointOfContact, status, deploymentCompliance,
        expirationDate, description, compliance
      } = complianceData[0]; // Assuming complianceData[2] has all necessary data

      // Creating an incomplete compliance report with the modified compliance data
      let incompleteComplianceReport = await ComplianceReport.create({
        softwareName, logo, website,
        documentation, pointOfContact, status, deploymentCompliance,
        uniqueId: "34e7dfbf-5de0-4146-8946-387135339004", expirationDate, description,
        compliance: compliance // Use the modified compliance data
      });
      await incompleteComplianceReport.save();

      // Prepare submission data
      const submissionData = {
        uniqueId: incompleteComplianceReport.uniqueId
      };

      // Attempt to submit the complete compliance report
      const res = await request(app).post('/compliance/drafts/submit').send(submissionData);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('success', 'details', 'link');
      expect(res.body.success).to.be.true;
      expect(res.body.details).to.equal("Form status updated to 'In Review'");
      expect(res.body.link).to.be.a('string');
    });

    it('should submit draft when requirements specification is missing but interface is present', async () => {
      // Extract necessary fields from a sample compliance data
      const {
        softwareName, logo, website,
        documentation, pointOfContact, status,
        expirationDate, description, deploymentCompliance
      } = complianceData[4]; // Assuming complianceData[4] has all necessary data

      const compliance = [
        {
          "version": "2.0",
          "bbDetails": {
            "bb-digital-registries": {
              "bbSpecification": "SpecificationA",
              "bbVersion": "1.2.0",
              "status": 1,
              "submissionDate": "2025-10-01T14:48:00.000Z",
              "deploymentCompliance": 1,
              "interfaceCompliance": {
                "level": 2,
                "testHarnessResult": "ResultA",
                "requirements": [
                  {
                    "requirement": "InterReq1",
                    "comment": "InterComment1",
                    "fulfillment": 1,
                    "status": 0
                  }
                ]
              }
            }
          }
        }
      ]

      // Creating an incomplete compliance report with the modified compliance data
      let incompleteComplianceReport = await ComplianceReport.create({
        softwareName, logo, website,
        documentation, pointOfContact, status, deploymentCompliance,
        uniqueId: "34e7dfbf-5de0-4146-8946-387135339003", expirationDate, description,
        compliance: compliance
      });

      // Prepare submission data
      const submissionData = {
        uniqueId: "34e7dfbf-5de0-4146-8946-387135339003"
      };

      // Attempt to submit the complete compliance report
      const res = await request(app).post('/compliance/drafts/submit').send(submissionData);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('success', 'details', 'link');
      expect(res.body.success).to.be.true;
      expect(res.body.details).to.equal("Form status updated to 'In Review'");
      expect(res.body.link).to.be.a('string');
    });

    it('should block submission when interface is present but incomplete, and requirements specification is present', async () => {
      // Extract necessary fields from a sample compliance data
      const {
        softwareName, logo, website,
        documentation, pointOfContact, status,
        expirationDate, description, deploymentCompliance
      } = complianceData[4]; // Assuming complianceData[2] has all necessary data

      const compliance = [
        {
          "version": "2.0",
          "bbDetails": {
            "bb-digital-registries": {
              "bbSpecification": "SpecificationA",
              "bbVersion": "1.2.0",
              "status": 1,
              "submissionDate": "2025-10-01T14:48:00.000Z",
              "deploymentCompliance": 1,
              "requirementSpecificationCompliance": {
                "level": 1,
                "crossCuttingRequirements": [
                  {
                    "requirement": "Req1",
                    "comment": "Comment1",
                    "fulfillment": 1,
                    "status": 0
                  },
                ],
                "functionalRequirements": [
                  {
                    "requirement": "FuncReq1",
                    "comment": "FuncComment1",
                    "fulfillment": 1,
                    "status": 2
                  },
                ]
              },
              "interfaceCompliance": {
                "level": 2,
                "testHarnessResult": "ResultA",
                "requirements": [
                  {
                    "requirement": "InterReq1",
                    "comment": "InterComment1",
                    "fulfillment": 1,
                    "status": 0
                  },
                ]
              }
            },
            "bb-payments": {
              "bbSpecification": "SpecificationB",
              "bbVersion": "1.1.2",
              "status": 1,
              "submissionDate": "2022-11-01T14:48:00.000Z",
              "deploymentCompliance": 1,
              "requirementSpecificationCompliance": {
                "level": 1,
                "crossCuttingRequirements": [
                  {
                    "requirement": "Req1",
                    "comment": "Comment1",
                    "fulfillment": 1,
                    "status": 0
                  },
                ],
                "functionalRequirements": [
                  {
                    "requirement": "FuncReq1",
                    "comment": "FuncComment1",
                    "fulfillment": 1,
                    "status": 2
                  },
                ]
              },
              "interfaceCompliance": {
                "level": 2,
                "testHarnessResult": "ResultA",
                "requirements": [
                  {
                    "requirement": "InterReq1",
                    "comment": "InterComment1",
                    "fulfillment": -1,
                    "status": 0
                  },
                ]
              }
            }
          }
        }
      ]

      // Creating an incomplete compliance report with the modified compliance data
      let incompleteComplianceReport = await ComplianceReport.create({
        softwareName, logo, website,
        documentation, pointOfContact, status, deploymentCompliance,
        uniqueId: "34e7dfbf-5de0-4146-8946-387135339006", expirationDate, description,
        compliance: compliance // Use the modified compliance data
      });

      // Prepare submission data
      const submissionData = {
        uniqueId: "34e7dfbf-5de0-4146-8946-387135339006"
      };

      // Attempt to submit the complete compliance report
      const res = await request(app).post('/compliance/drafts/submit').send(submissionData);
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.false;
      expect(res.body.error).to.include("Validation failed: ");
      expect(res.body.error).to.include("0: Required 'InterReq1' unfulfilled");
    });

    it('should block submission when requirements specification is present but incomplete, and interface is present', async () => {
      // Extract necessary fields from a sample compliance data
      const {
        softwareName, logo, website,
        documentation, pointOfContact, status,
        expirationDate, description, deploymentCompliance
      } = complianceData[4]; // Assuming complianceData[2] has all necessary data

      const compliance = [
        {
          "version": "2.0",
          "bbDetails": {
            "bb-digital-registries": {
              "bbSpecification": "SpecificationA",
              "bbVersion": "1.2.0",
              "status": 1,
              "submissionDate": "2025-10-01T14:48:00.000Z",
              "deploymentCompliance": 1,
              "requirementSpecificationCompliance": {
                "level": 1,
                "crossCuttingRequirements": [
                  {
                    "requirement": "Req1",
                    "comment": "Comment1",
                    "fulfillment": 1,
                    "status": 0
                  },
                ],
                "functionalRequirements": [
                  {
                    "requirement": "FuncReq1",
                    "comment": "FuncComment1",
                    "fulfillment": 1,
                    "status": 2
                  },
                ]
              },
              "interfaceCompliance": {
                "level": 2,
                "testHarnessResult": "ResultA",
                "requirements": [
                  {
                    "requirement": "InterReq1",
                    "comment": "InterComment1",
                    "fulfillment": 1,
                    "status": 0
                  },
                ]
              }
            },
            "bb-payments": {
              "bbSpecification": "SpecificationB",
              "bbVersion": "1.1.2",
              "status": 1,
              "submissionDate": "2022-11-01T14:48:00.000Z",
              "deploymentCompliance": 1,
              "requirementSpecificationCompliance": {
                "level": 1,
                "crossCuttingRequirements": [
                  {
                    "requirement": "Req1",
                    "comment": "Comment1",
                    "fulfillment": -1,
                    "status": 0
                  },
                ],
                "functionalRequirements": [
                  {
                    "requirement": "FuncReq1",
                    "comment": "FuncComment1",
                    "fulfillment": -1,
                    "status": 0
                  },
                ]
              },
              "interfaceCompliance": {
                "level": 2,
                "testHarnessResult": "ResultA",
                "requirements": [
                  {
                    "requirement": "InterReq1",
                    "comment": "InterComment1",
                    "fulfillment": 1,
                    "status": 0
                  },
                ]
              }
            }
          }
        }
      ]

      // Creating an incomplete compliance report with the modified compliance data
      let incompleteComplianceReport = await ComplianceReport.create({
        softwareName, logo, website,
        documentation, pointOfContact, status, deploymentCompliance,
        uniqueId: "34e7dfbf-5de0-4146-8946-387135339007", expirationDate, description,
        compliance: compliance // Use the modified compliance data
      });

      // Prepare submission data
      const submissionData = {
        uniqueId: "34e7dfbf-5de0-4146-8946-387135339007"
      };

      // Attempt to submit the complete compliance report
      const res = await request(app).post('/compliance/drafts/submit').send(submissionData);

      expect(res.statusCode).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.be.false;
      expect(res.body.error).to.include("Validation failed: ");
      expect(res.body.error).to.include("0: Required 'Req1' unfulfilled");
      expect(res.body.error).to.include("1: Required 'FuncReq1' unfulfilled");
    });

  });


});
