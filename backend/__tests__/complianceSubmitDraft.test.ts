import chai, { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import ComplianceReport from '../src/db/schemas/compliance';
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

  describe('Submit draft with all fields completed ', () => {
    it('should successfully submit the draft without errors', async () => {
      const submissionData = {
        uniqueId: createdCompliance.uniqueId
      };
      console.log("STARTING FUNCTION CONSOLE LOG - Submit draft with all fields completed")
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
        compliance
      });

      const submissionData = {
        uniqueId: incompleteCompliance.uniqueId
      };

      const res = await request(app).post('/compliance/drafts/submit').send(submissionData);
      expect(res.statusCode).to.equal(400);
      console.log(res.body.error);
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

    it('should block submission when crossCutting and functional requirements are missing', async () => {
      // Extract necessary fields from a sample compliance data
      const {
        softwareName, logo, website,
        documentation, pointOfContact, status,
        uniqueId, expirationDate, description, compliance
      } = complianceData[2]; // Assuming complianceData[2] has all necessary data
    
      // Modify the compliance data to remove crossCutting and functional requirements
      const modifiedCompliance = compliance.map(version => ({
        ...version,
        bbDetails: Object.fromEntries(Object.entries(version.bbDetails).map(([key, detail]) => {
          // Assert that detail is of the expected object type
          const detailObject = detail as { requirementSpecificationCompliance: any; [key: string]: any };
          
          return [key, {
            ...detailObject,
            requirementSpecificationCompliance: {
              ...detailObject.requirementSpecificationCompliance,
              crossCuttingRequirements: [], // Set to empty or undefined
              functionalRequirements: [] // Set to empty or undefined
            }
          }];
        }))
      }));
    
      // Creating an incomplete compliance report with the modified compliance data
      let incompleteComplianceReport = await ComplianceReport.create({
        softwareName,
        logo,
        website,
        documentation,
        pointOfContact,
        status,
        uniqueId,
        expirationDate,
        description,
        compliance: modifiedCompliance // Use the modified compliance data
      });
    
      // Prepare submission data
      const submissionData = {
        uniqueId: incompleteComplianceReport.uniqueId
      };
    
      // Attempt to submit the incomplete compliance report
      const res = await request(app).post('/compliance/drafts/submit').send(submissionData);
      expect(res.statusCode).to.equal(400); // Expecting an error status code
      expect(res.body).to.have.property('error'); // Expecting an error property in the response
      expect(res.body.error).to.include('ComplianceReport validation failed'); // Expecting a specific error message
    });
    


  });
});
