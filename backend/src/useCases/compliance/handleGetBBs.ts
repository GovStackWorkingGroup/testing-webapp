import { Request, Response } from 'express';
import { ComplianceDbRepository } from "myTypes";

export default class GetBBsRequestHandler {
    private repository: ComplianceDbRepository;

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository,
    ) {
        this.repository = repository;
    }

    async getBBs(): Promise<void> {
        try {
            const bbs = await this.repository.getBBs();

            if (!bbs) {
                this.res.status(404).send(`BBs not found.`);
                return;
            }
            this.res.json(bbs);

        } catch (error) {
            console.error("Error fetching BBs:", error);
            this.res.status(500).send("Error fetching BBs.");
        }
    }

}
