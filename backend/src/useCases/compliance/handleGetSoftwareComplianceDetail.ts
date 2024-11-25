import { Request, Response } from 'express';
import { ComplianceDbRepository } from "myTypes";

export default class GetSoftwareComplianceDetailRequestHandler {

    private repository: ComplianceDbRepository;
    private softwareName: string;
    private isAuthenticated: Boolean;

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository,
        softwareName: string,
        isAuthenticated: Boolean
    ) {
        this.repository = repository;
        this.softwareName = softwareName;
        this.isAuthenticated = isAuthenticated;
    }

    async getSoftwareComplianceDetail(): Promise<void> {
        try {
            const softwareComplianceDetail = await this.repository.getSoftwareComplianceDetail(
                this.softwareName, this.isAuthenticated
            );
            if (softwareComplianceDetail.length === 0) {
                this.res.status(404).send(`Software with name '${this.softwareName}' not found.`);
                return;
            }
            this.res.json(softwareComplianceDetail);
        } catch (error) {
            console.error("Error fetching compliance reports:", error);
            this.res.status(500).send("Error fetching compliance reports.");
        }
    }
}

