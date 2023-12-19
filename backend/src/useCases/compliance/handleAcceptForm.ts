import { Request, Response } from 'express';
import { ComplianceDbRepository } from "myTypes";
import { StatusEnum } from '../../db/schemas/compliance/complianceUtils';

export default class AcceptComplianceFormRequestHandler {
    private repository: ComplianceDbRepository;
    private formId: string;

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository,
        formId: string
    ) {
        this.repository = repository;
        this.formId = formId;
    }

    async acceptForm(): Promise<Response> {
        try {

            if (!this.formId) {
                return this.res.status(400).send({ success: false, error: "Form ID is required" });
            }

            const { success, errors } = await this.repository.updateFormStatus(this.formId, StatusEnum.APPROVED);
            if (!success) {
                return this.res.status(400).send({ success: false, errors });
            }

            return this.res.status(200).send({
                success: true,
                message: "Compliance form accepted."
            });
        } catch (error: any) {
            console.error("Error accepting compliance form:", error);
            return this.res.status(500).send({ success: false, error: error.message || "Error accepting compliance form." });
        }
    }
}
