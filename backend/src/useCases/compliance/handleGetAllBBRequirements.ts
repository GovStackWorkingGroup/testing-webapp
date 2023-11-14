import { Request, Response } from 'express';
import { ComplianceDbRepository, AllBBRequirements } from "myTypes";

export default class GetAllBBRequirementsRequestHandler {

    private repository: ComplianceDbRepository;

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository
    ) {
        this.repository = repository;
    }

    async getAllBBRequirements(): Promise<void> {
        try {
            const allBBRequirements: AllBBRequirements = await this.repository.getAllBBRequirements();

            if (!allBBRequirements || allBBRequirements.length === 0) {
                this.res.status(404).send("No requirements found for any BB.");
                return;
            }
            this.res.json(allBBRequirements);
        } catch (error) {
            console.error("Error fetching all BB requirements:", error);
            this.res.status(500).send("Error fetching all BB requirements.");
        }
    }
}
