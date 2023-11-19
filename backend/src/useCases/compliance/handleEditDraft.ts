import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ComplianceDbRepository, ComplianceReport, StatusEnum } from "myTypes";

type UploadedFiles = {
    logo?: Express.Multer.File[];
    documentation?: Express.Multer.File[];
};

export default class EditDraftRequestHandler {
    private repository: ComplianceDbRepository;

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository
    ) {
        this.repository = repository;
    }

    private createFullUrl(path: string): string {
        return `${this.req.protocol}://${this.req.get('host')}${path}`;
    }

    async editDraftForm(draftId: string): Promise<Response> {
        try {
            // const formId = this.req.params.id; // Assuming there's an ID in the URL parameters to identify the form
            // if (!mongoose.Types.ObjectId.isValid(formId)) {
            //     return this.res.status(400).send({ success: false, error: "Invalid form ID" });
            // }
            const files = this.req.files as UploadedFiles;
            // Assuming that we may or may not have files to update.
            const updateData: Partial<ComplianceReport> = {
                ...this.req.body
              };

            // Update the logo if a new one is provided
            if (files && files.logo && files.logo[0]) {
                updateData.logo = (files.logo[0] as Express.Multer.File).path;
            }

            const updateResult = await this.repository.editDraftForm(draftId, updateData);

            // if (!updateResult) {
            //     return this.res.status(404).send({ success: false, error: "Form not found" });
            // }

            const fullPath = this.createFullUrl(`/compliance/forms/${draftId}`);
            const response = {
                success: true,
                details: "Form updated successfully",
                link: fullPath
            };

            return this.res.status(200).send(response);
        } catch (error: any) {
            if (error instanceof mongoose.Error.ValidationError) {
                return this.res.status(400).send({ success: false, error: error.message });
            } else if (error instanceof TypeError) {
                console.error("Type error:", error);
                return this.res.status(400).send({ success: false, error: error.message });
            }

            console.error("Error editing form:", error);
            return this.res.status(500).send({ success: false, error: error.message || "Error editing form." });
        }
    }
}
