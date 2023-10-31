import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ComplianceDbRepository, StatusEnum } from "myTypes";

type UploadedFiles = {
    logo?: Express.Multer.File[];
    documentation?: Express.Multer.File[];
};

export default class CreateDraftRequestHandler {
    private repository: ComplianceDbRepository;
    private status: StatusEnum;

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository,
        status: StatusEnum
    ) {
        this.repository = repository;
        this.status = status;
    }

    private createFullUrl(path: string): string {
        return `${this.req.protocol}://${this.req.get('host')}${path}`;
    }

    async createOrSubmitForm(): Promise<Response> {
        try {
            const files = this.req.files as UploadedFiles;
            if (!files.logo || !files.logo[0]) {
                return this.res.status(400).send({ success: false, error: "Missing required file: logo" });
            }

            const draftData = {
                ...this.req.body,
                status: this.status,
                pointOfContact: this.req.body.email,
                logo: (files.logo![0] as Express.Multer.File).path
            };
            const draftLink = await this.repository.createOrSubmitForm(draftData);

            const response: any = { success: true, details: "Form submitted successfully" };
            if (draftLink) {
                const fullPath = this.createFullUrl(`/compliance/drafts/drafts/${draftLink}`);
                response.details = "Draft created successfully";
                response.link = fullPath;
            }

            return this.res.status(201).send(response);
        } catch (error: any) {
            if (error instanceof mongoose.Error.ValidationError) {
                return this.res.status(400).send({ success: false, error: error.message });
            } else if (error instanceof TypeError) {
                console.error("Type error:", error);
                return this.res.status(400).send({ success: false, error: error.message });
            }

            console.error("Error creating draft:", error);
            return this.res.status(500).send({ success: false, error: error.message || "Error creating draft." });
        }
    }
}
