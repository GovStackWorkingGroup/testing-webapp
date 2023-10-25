import { Request, Response } from 'express';
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
            const requiredFields = ['softwareName', 'website', 'documentation', 'description', 'email'];
            const missingFields = requiredFields.filter(field => !this.req.body[field]);
            const files = this.req.files as UploadedFiles;

            if (!files.logo || !files.logo[0]) {
                missingFields.push('logo');
            }
            if (missingFields.length > 0) {
                return this.res.status(400).send(`Missing required fields: ${missingFields.join(', ')}`);
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
        } catch (error) {
            console.error("Error creating draft:", error);
            return this.res.status(500).send("Error creating draft.");
        }
    }
}
