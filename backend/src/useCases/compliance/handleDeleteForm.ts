import { Request, Response } from 'express';
import { ComplianceDbRepository } from "myTypes";

export default class DeleteComplianceFormRequestHandler {
    private repository: ComplianceDbRepository;
    private formId: string;

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository,
        formId: string,
    ) {
        this.repository = repository;
        this.formId = formId;
    }

    async deleteForm(): Promise<Response> {
        try {
            if (!this.formId) {
                return this.res.status(400).send({ success: false, error: "Form ID is required" });
            }

            const { success, errors } = await this.repository.deleteForm(this.formId);
            if (!success) {
                return this.res.status(400).send({ success: false, errors });
            }

            return this.res.status(200).send({
                success: true,
                message: "Compliance form deleted."
            });
        } catch (error: any) {
            console.error("Error deleting compliance form:", error);
            return this.res.status(500).send({ success: false, error: error.message || "Error deleting compliance form." });
        }
    }
}
