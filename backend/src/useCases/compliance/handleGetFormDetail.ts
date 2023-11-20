import { Request, Response } from 'express';
import { ComplianceDbRepository } from "myTypes";

export default class GetFormDetailRequestHandler {

    private repository: ComplianceDbRepository;
    private formId: string | undefined;
    private draftUuid: string | undefined;

    constructor(
        private reg: Request,
        private res: Response,
        repository: ComplianceDbRepository,
        formId: string | undefined,
        draftUuid: string | undefined,
    ) {
        this.repository = repository;
        this.formId = formId;
        this.draftUuid = draftUuid;
    }

    async getFormDetail(): Promise<void> {
        try {
            const formDetail = await this.repository.getFormDetail(this.formId, this.draftUuid);

            if (!formDetail) {
                this.res.status(404).send(`Form with ID '${this.formId}' not found.`)
                return;
            }
            this.res.json(formDetail);
        } catch (error) {
            console.error("Error fetching form details:", error);
            this.res.status(500).send("Error fetching form details.");
        }
    }

}

