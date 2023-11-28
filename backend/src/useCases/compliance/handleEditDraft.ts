import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ComplianceDbRepository, ComplianceReport, StatusEnum } from "myTypes";

type UploadedFiles = {
    logo?: Express.Multer.File[];
    documentation?: Express.Multer.File[];
    deploymentInstructions?: Express.Multer.File[];
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

    private getFrontendUrl(path: string): string {
        let host = this.req.get('host');
    
        if (host?.startsWith('api.')) {
            host = host.substring(4); // delete 'api.' from URL
        }
    
        let baseUrl = `${this.req.protocol}://${host}`;
        return `${baseUrl}${path}`;
    }

    async editDraftForm(draftId: string): Promise<Response> {
        try {

            const files = this.req.files as UploadedFiles;
            // Assuming that we may or may not have files to update.
            const updateData: Partial<ComplianceReport> = {
                ...this.req.body
            };

            updateData.logo = this.updateFilePath(files?.logo, updateData.logo);

            if (!updateData.deploymentCompliance) {
                updateData.deploymentCompliance = {};
            }
            updateData.deploymentCompliance.documentation = this.updateFilePath(
                files['deploymentCompliance[documentation]'],
                updateData.deploymentCompliance.documentation
            );
            updateData.deploymentCompliance.deploymentInstructions = this.updateFilePath(
                files['deploymentCompliance[deploymentInstructions]'],
                updateData.deploymentCompliance.deploymentInstructions
            );

            const updateResult = await this.repository.editDraftForm(draftId, updateData);

            // if (!updateResult) {
            //     return this.res.status(404).send({ success: false, error: "Form not found" });
            // }

            const fullPath = this.getFrontendUrl(`/softwareRequirementsCompliance/form/${draftId}`);
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

    updateFilePath(fileArray, currentPath) {
        return fileArray?.[0] ? (fileArray[0] as Express.Multer.File).path : currentPath;
    }
}
