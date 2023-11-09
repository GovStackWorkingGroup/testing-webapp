import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ComplianceDbRepository } from "myTypes";
import BBRequirements from '../../db/schemas/bbRequirements';

export default class GetBBRequirementsRequestHandler {
    
    private repository: ComplianceDbRepository;
    private bbKey: string;
    
    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository,
        bbKey: string
    ) {
        this.repository = repository;
        this.bbKey = bbKey;
    }
    
    async getBBRequirements(): Promise<void> {
        try {
            // Assuming your repository has a method getBBRequirements that takes a bbKey
            const bbRequirements = await this.repository.getBBRequirements(this.bbKey);
            
            if (!bbRequirements) {
                this.res.status(404).send(`Requirements for BB key '${this.bbKey}' not found.`);
                return;
            }
            this.res.json(bbRequirements);
        } catch (error) {
            console.error("Error fetching BB requirements:", error);
            this.res.status(500).send("Error fetching BB requirements.");
        }
        
    }
    
}
