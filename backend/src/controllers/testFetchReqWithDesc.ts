import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { RequirementStatusEnum } from 'myTypes'; // Adjust the import path based on your project structure
import GitBookPageContentManager from '../services/gitBookService/PageContentManager';
import BBRequirements from '../db/schemas/bbRequirements';
import * as XLSX from 'xlsx';
import { processBBRequirements } from '../services/gitBookService/bbRequirementsProcessing';
import syncGitBookBBRequirements from '../cronJobs/syncGitBookBBRequirements';

// Initialize GitBookPageContentManager instance
const gitBookPageContentManager = new GitBookPageContentManager();

// Function to fetch requirements and transform them
async function fetchRequirements() {
    const requirements = await BBRequirements.find().lean();

    return requirements.map(bb => ({
        bbName: bb.bbName,
        requirements: {
            crossCutting: (bb.requirements?.crossCutting ?? []).map((req: any) => req.requirement),
            functional: (bb.requirements?.functional ?? []).map((req: any) => req.requirement),
            interface: (bb.requirements?.interface ?? []).map((req: any) => req.requirement),
            keyDigitalFunctionalities: (bb.requirements?.keyDigitalFunctionalities ?? []).map((req: any) => req.requirement),
        }
    }));
}

// Controller function
export const testFetchReqWithDesc = async (_: Request, res: Response) => {
    try {
        const result = await processBBRequirements();

        const requirements = await fetchRequirements();

        res.status(200).json({ requirements: requirements });
    } catch (error) {
        console.error('Error processing requirements:', error);
        res.status(500).json({ error: 'Failed to process requirements' });
    }
};