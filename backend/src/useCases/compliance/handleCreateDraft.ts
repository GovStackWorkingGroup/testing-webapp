import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ComplianceDbRepository, StatusEnum } from "myTypes";
import { EmailTemplateSender, defaultEmailSender } from './../../services/email/emailTemplateSender';
import { appConfig } from '../../config';

type UploadedFiles = {
    logo?: Express.Multer.File[];
    documentation?: Express.Multer.File[];
};

export default class CreateDraftRequestHandler {
    private repository: ComplianceDbRepository;
    private status: StatusEnum;
    private emailSender: EmailTemplateSender

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository,
        status: StatusEnum
    ) {
        this.repository = repository;
        this.status = status;
        this.emailSender = defaultEmailSender()
    }

    private getFrontendUrl(path: string): string {
        let host = this.req.get('host');
    
        if (host?.startsWith('api.')) {
            host = host.substring(4); // delete 'api.' from URL
        }
    
        let baseUrl = `${this.req.protocol}://${host}`;
        return `${baseUrl}${path}`;
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
            const draftUniqueId = await this.repository.createOrSubmitForm(draftData);

            const response: any = { success: true, details: "Form submitted successfully" };
            if (draftUniqueId) {
                const fullPath = this.getFrontendUrl(`/softwareRequirementsCompliance/form?draftUUID=${draftUniqueId}&formStep=1`);
                response.details = "Draft created successfully";
                response.link = fullPath;
                response.uniqueId = draftUniqueId;
                this.sendDraftSubmittionEmail(this.req.body.email, this.req.body.softwareName, fullPath)
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

    async sendDraftSubmittionEmail(email: string, softwareName: string, draftLink: string): Promise<void> {
        if (appConfig.emailsEnabled) {
            this.emailSender.sendEmail('draftSubmitted', {
                'recipient': email,
                'parameters': {'softwareName': softwareName, 'draftLink': draftLink,
                'expireDate': new Date(Date.now() + appConfig.draftExpirationTime).toISOString().split('T')[0]}
            }).then(() => console.log('Email sent using customized template'))
                .catch(error => console.error('Error sending email:', error));
        }
    }
}
