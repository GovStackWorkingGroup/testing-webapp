import { Request, Response } from 'express';
import { ComplianceDbRepository } from "myTypes";

export default class UpdateFormRequestHandler {
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

    async updateForm(): Promise<Response> {
        try {
            if (!this.formId) {
                return this.res.status(400).send({ success: false, error: "Form ID is required" });
            }

            const { success, errors } = await this.repository.updateFormData(this.formId, this.updatedData);
            if (!success) {
                return this.res.status(400).send({ success: false, errors });
            }

            return this.res.status(200).send({
                success: true,
                message: "Compliance form updated successfully."
            });
        } catch (error: any) {
            console.error("Error updating compliance form:", error);
            return this.res.status(500).send({ success: false, error: error.message || "Error updating compliance form." });
        }
    }
}
