import { Request, Response } from 'express';
import { ComplianceDbRepository } from "myTypes";
import { StatusEnum } from '../../db/schemas/compliance/complianceUtils';

export default class RejectComplianceFormRequestHandler {
    private repository: ComplianceDbRepository;
    private formId: string;
    private updatedData;

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository,
        formId: string,
        updatedData
    ) {
        this.repository = repository;
        this.formId = formId;
        this.updatedData = updatedData;
    }

    async rejectForm(): Promise<Response> {
        try {

            if (!this.formId) {
                return this.res.status(400).send({ success: false, error: "Form ID is required" });
            }

            const { success, errors } = await this.repository.updateFormStatus(this.formId, StatusEnum.REJECTED, this.updatedData);
            if (!success) {
                return this.res.status(400).send({ success: false, errors });
            }

            return this.res.status(200).send({
                success: true,
                message: "Compliance form rejected."
            });
        } catch (error: any) {
            console.error("Error rejecting compliance form:", error);
            return this.res.status(500).send({ success: false, error: error.message || "Error rejecting compliance form." });
        }
    }
}
