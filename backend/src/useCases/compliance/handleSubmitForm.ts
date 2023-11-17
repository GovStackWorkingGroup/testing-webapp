import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ComplianceDbRepository } from "myTypes";
import { appConfig } from '../../config';
import axios from 'axios';

export default class SubmitFormRequestHandler {
    private repository: ComplianceDbRepository;

    constructor(
        private req: Request,
        private res: Response,
        repository: ComplianceDbRepository
    ) {
        this.repository = repository;
    }

    async submitForm(): Promise<Response> {
        try {
            const uniqueId = this.req.body.uniqueId;
            if (!uniqueId) {
                return this.res.status(400).send({ success: false, error: "Unique ID is required" });
            }

            const updateResult = await this.repository.submitForm(uniqueId);
            if (!updateResult) {
                return this.res.status(404).send({ success: false, error: "Form not found" });
            }

            const jiraTicketLink = await this.createJiraTicket();

            return this.res.status(200).send({
                success: true,
                details: "Form status updated to 'In Review'",
                link: "placeholder for Jira ticket link"
            });
        } catch (error: any) {
            if (error instanceof mongoose.Error.ValidationError) {
                return this.res.status(400).send({ success: false, error: error.message });
            }

            console.error("Error updating form status:", error);
            return this.res.status(500).send({ success: false, error: error.message || "Error updating form status." });
        }
    }

    async createJiraTicket(): Promise<string> {

        
        const jiraConfig = appConfig.jira;
    
        const descriptionText = jiraConfig.descriptionTemplate.replace('{{submitter}}', 'Submitter Name');

        const descriptionADF = {
            type: "doc",
            version: 1,
            content: [
                {
                    type: "paragraph",
                    content: [
                        {
                            text: descriptionText,
                            type: "text"
                        }
                    ]
                }
            ]
        };

        const payload = {
            fields: {
                project: {
                    key: jiraConfig.projectKey,
                },
                summary: jiraConfig.titleTemplate.replace('{{form_title}}', 'Your Form Title'),
                description: descriptionADF,
                issuetype: {
                    name: jiraConfig.issueType,
                },
                assignee: {
                    id: jiraConfig.assigneeId,
                }
                        },
        };
        console.log(jiraConfig.apiEndpoint);
        try {
            const response = await axios.post(jiraConfig.apiEndpoint, payload, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`kolinoks@gmail.com:${jiraConfig.apiKey}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            return response.data.self; // Ensure this field exists in the response
        } catch (error: any) {
            console.error('Failed to create Jira ticket:', error.response ? error.response.data : error);
            throw new Error('Failed to create Jira ticket');
        }
    }
}
