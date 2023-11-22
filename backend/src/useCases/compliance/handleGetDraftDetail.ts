import { Request, Response } from 'express';
import { ComplianceDbRepository } from "myTypes";

export default class GetDraftDetailRequestHandler {

    private repository: ComplianceDbRepository;
    private draftUuid: string;

    constructor(
        private reg: Request,
        private res: Response,
        repository: ComplianceDbRepository,
        draftUuid: string
    ) {
        this.repository = repository;
        this.draftUuid = draftUuid;
    }

    async getDraftDetail(): Promise<void> {
        try {
            const draftDetail = await this.repository.getDraftDetail(this.draftUuid);

            if (!draftDetail) {
                this.res.status(404).send(`Draft with UUID '${this.draftUuid}' not found.`)
                return;
            }
            this.res.json(draftDetail);
        } catch (error) {
            console.error("Error fetching draft details:", error);
            this.res.status(500).send("Error fetching draft details.");
        }
    }

}

