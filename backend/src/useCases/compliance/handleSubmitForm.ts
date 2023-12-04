import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ComplianceDbRepository } from "myTypes";
import { appConfig } from '../../config';
import axios from 'axios';

class JiraTicketCreationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JiraTicketCreationError';
    }
}

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
        let draftDataForRollback;
        try {
            const uniqueId = this.req.body.uniqueId;
            if (!uniqueId) {
                return this.res.status(400).send({ success: false, error: "Unique ID is required" });
            }

            const { success, errors, originalData } = await this.repository.submitForm(uniqueId);
            draftDataForRollback = originalData;
            if (!success) {
                return this.res.status(400).send({ success: false, errors });
            }
            const jiraTicketResult = await this.createJiraTicket();
            if (jiraTicketResult instanceof Error) {
                throw jiraTicketResult;
            }

            return this.res.status(200).send({
                success: true,
                details: "Form status updated to 'In Review'",
                link: jiraTicketResult
            });
        } catch (error: any) {
            if (error instanceof JiraTicketCreationError) {
                await this.repository.rollbackFormStatus(draftDataForRollback);
            }

            if (error instanceof mongoose.Error.ValidationError) {
                return this.res.status(400).send({ success: false, error: error.message });
            }

            console.error("Error updating form status:", error);
            return this.res.status(500).send({ success: false, error: error.message || "Error updating form status." });
        }
    }

    async createJiraTicket(): Promise<string | Error> {

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
        try {
            const response = await axios.post(jiraConfig.apiEndpoint, payload, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`kolinoks@gmail.com:${jiraConfig.apiKey}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data.self;
        } catch (error: any) {
            console.error('Failed to create Jira ticket:', error.response ? error.response.data : error);
            return new JiraTicketCreationError('Failed to create Jira ticket');
        }
    }
}
