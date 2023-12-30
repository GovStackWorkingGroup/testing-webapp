import chai, { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import BBRequirements from '../src/db/schemas/bbRequirements';
import fs from 'fs';
import path from 'path';
import GitBookPageContentManager from '../src/services/gitBookService/PageContentManager';
import { RequirementStatusEnum, StatusEnum } from '../src/db/schemas/compliance/complianceUtils';

describe('GitBook API', () => {
    let mongod;

    before(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        await mongoose.connect(uri);

    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
        await mongod.stop();
    });

    describe('GitBook - Functional Requirements', () => {
        it('should successfully process the data from the file and save it', async () => {
            // Read test data from JSON file
            const testDataPath = path.join(__dirname, 'testData', 'gitBookDocumentFunctionalRequirements.json');
            const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

            // Process the data
            const contentManager = new GitBookPageContentManager();
            const result = contentManager.extractFunctionalRequirements(testData);
            if ('error' in result) {
                throw result.error;
            }
            const { requirements } = result;

            expect(requirements).to.be.an('array').with.lengthOf(3);
            expect(requirements[0]).to.have.property('status', RequirementStatusEnum.REQUIRED);
            expect(requirements[0]).to.have.property('requirement');

            expect(requirements[1]).to.have.property('status', RequirementStatusEnum.RECOMMENDED);
            expect(requirements[1]).to.have.property('requirement');

            expect(requirements[2]).to.have.property('status', RequirementStatusEnum.OPTIONAL);
            expect(requirements[2]).to.have.property('requirement');

        });

        it('should successfully create bb requirements record with functional requirements', async () => {
            // Read test data from JSON file
            const testDataPath = path.join(__dirname, 'testData', 'gitBookDocumentFunctionalRequirements.json');
            const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
          
            // Process the data
            const contentManager = new GitBookPageContentManager();
            const result = contentManager.extractFunctionalRequirements(testData);
            if ('error' in result) {
                throw result.error;
            }
          
            // Create and save BBRequirements instance
            const bbKey = 'some_key'; 
            const bbName = 'some_name'; 
            const spaceInfo = { version: '1.0.0' }; 
            const dateOfSave = new Date().toISOString().split('T')[0]; // To match the date format without time
            const bbRequirement = new BBRequirements({ bbKey, bbName, bbVersion: spaceInfo.version, dateOfSave, requirements: { functional: result.requirements } });
            await bbRequirement.save();
          
            // Assertions for the bbRequirement record
            expect(bbRequirement).to.have.property('bbKey', bbKey);
            expect(bbRequirement).to.have.property('bbName', bbName);
            expect(bbRequirement).to.have.property('bbVersion', spaceInfo.version);
            expect(bbRequirement).to.have.property('dateOfSave');
            expect(bbRequirement).to.have.property('requirements').that.is.an('object');
            // Further checking the structure of the requirements
            expect(bbRequirement.requirements).to.have.property('functional').that.is.an('array').with.lengthOf(3);

            // Assuming the first requirement should have status REQUIRED
            expect(bbRequirement.requirements?.functional[0]).to.have.property('status', RequirementStatusEnum.REQUIRED);
            
            // Assuming the second requirement should have status RECOMMENDED
            expect(bbRequirement.requirements?.functional[1]).to.have.property('status', RequirementStatusEnum.RECOMMENDED);
            
            // Assuming the third requirement should have status OPTIONAL
            expect(bbRequirement.requirements?.functional[2]).to.have.property('status', RequirementStatusEnum.OPTIONAL);
            expect(bbRequirement.requirements).to.have.property('crossCutting').that.is.an('array').with.lengthOf(0);
          
          });
    });

    describe('GitBook - Cross-Cutting Requirements', () => {
        it('should successfully process the data from the file and save it', async () => {
            // Read test data from JSON file
            const testDataPath = path.join(__dirname, 'testData', 'gitBookDocumentCrossCuttingRequirements.json');
            const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

            // Process the data
            const contentManager = new GitBookPageContentManager();
            const result = contentManager.extractCrossCuttingRequirements(testData);
            if ('error' in result) {
                throw result.error;
            }
            const { requirements } = result;

            expect(requirements).to.be.an('array').with.lengthOf(3);
            expect(requirements[0]).to.have.property('status', RequirementStatusEnum.REQUIRED);
            expect(requirements[0]).to.have.property('requirement');

            expect(requirements[1]).to.have.property('status', RequirementStatusEnum.RECOMMENDED);
            expect(requirements[1]).to.have.property('requirement');

            expect(requirements[2]).to.have.property('status', RequirementStatusEnum.OPTIONAL);
            expect(requirements[2]).to.have.property('requirement');

        });

        it('should successfully create bb requirements record with cross-cutting requirements', async () => {
            // Read test data from JSON file
            const testDataPath = path.join(__dirname, 'testData', 'gitBookDocumentCrossCuttingRequirements.json');
            const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
          
            // Process the data
            const contentManager = new GitBookPageContentManager();
            const result = contentManager.extractCrossCuttingRequirements(testData);
            if ('error' in result) {
                throw result.error;
            }

            // Create and save BBRequirements instance
            const bbKey = 'some_key_cross_cutting'; 
            const bbName = 'some_name_cross_cutting'; 
            const spaceInfo = { version: '1.0.0' }; 
            const dateOfSave = new Date().toISOString().split('T')[0]; // To match the date format without time
            const bbRequirement = new BBRequirements({ bbKey, bbName, bbVersion: spaceInfo.version, dateOfSave, requirements: { crossCutting: result.requirements } });
            await bbRequirement.save();
            
            // Assertions for the bbRequirement record
            expect(bbRequirement).to.have.property('bbKey', bbKey);
            expect(bbRequirement).to.have.property('bbName', bbName);
            expect(bbRequirement).to.have.property('bbVersion', spaceInfo.version);
            expect(bbRequirement).to.have.property('dateOfSave');
            expect(bbRequirement).to.have.property('requirements').that.is.an('object');
          
            // Further checking the structure of the requirements
            expect(bbRequirement.requirements).to.have.property('crossCutting').that.is.an('array').with.lengthOf(3);

            // Assuming the first requirement should have status REQUIRED
            expect(bbRequirement.requirements?.crossCutting[0]).to.have.property('status', RequirementStatusEnum.REQUIRED);
            
            // Assuming the second requirement should have status RECOMMENDED
            expect(bbRequirement.requirements?.crossCutting[1]).to.have.property('status', RequirementStatusEnum.RECOMMENDED);
            
            // Assuming the third requirement should have status OPTIONAL
            expect(bbRequirement.requirements?.crossCutting[2]).to.have.property('status', RequirementStatusEnum.OPTIONAL);
            expect(bbRequirement.requirements).to.have.property('functional').that.is.an('array').with.lengthOf(0);
          
          });
    });
});
