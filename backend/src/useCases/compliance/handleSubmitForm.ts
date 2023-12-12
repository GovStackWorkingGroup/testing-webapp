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
            let jiraTicketResult: string | Error = "";
            const uniqueId = this.req.body.uniqueId;
            if (!uniqueId) {
                return this.res.status(400).send({ success: false, error: "Unique ID is required" });
            }

            const { success, errors, originalData } = await this.repository.submitForm(uniqueId);
            draftDataForRollback = originalData;
            if (!success) {
                return this.res.status(400).send({ success: false, errors });
            }

            // Create Jira ticket only if integration is enabled
            if (appConfig.enableJiraIntegration) {
                jiraTicketResult = await this.createJiraTicket(
                    draftDataForRollback.softwareName,
                    draftDataForRollback.bbKeys
                );
                if (jiraTicketResult instanceof Error) {
                    throw jiraTicketResult;
                }
            } else {
                console.log('Jira integration is disabled.');
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

    async createJiraTicket(softwareName: string, buildingBlocks): Promise<string | Error> {
        const jiraConfig = appConfig.jira;
        const formFullPath = this.getFrontendUrl(`/softwareRequirementsCompliance/details/`, softwareName);
        const buildingBlocksArray = Array.isArray(buildingBlocks) ? buildingBlocks : buildingBlocks.split(',');

        // Create bulleted list for building blocks
        const buildingBlocksList = buildingBlocksArray.map(bb => ({
            type: 'listItem',
            content: [{
                type: 'paragraph',
                content: [{
                    type: 'text',
                    text: bb.trim(),
                }]
            }]
        }));

        const descriptionADF = {
        type: "doc",
        version: 1,
        content: [
            {
                type: "paragraph",
                content: [
                    {
                        text: `${softwareName} has submitted a self-assessment for `,
                        type: "text"
                    }
                ]
            },
            {
                type: 'bulletList',
                content: buildingBlocksList
            },
            {
                type: "paragraph",
                content: [
                    {
                        text: 'View the submission at ',
                        type: 'text'
                    },
                    {
                        type: 'text',
                        text: formFullPath,
                        marks: [
                            {
                                type: 'link',
                                attrs: {
                                    href: formFullPath
                                }
                            }
                        ]
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
                summary: jiraConfig.titleTemplate.replace('{{software_name}}', softwareName),
                description: descriptionADF,
                issuetype: {
                    name: jiraConfig.issueType,
                },
                // assignee: {
                //     id: jiraConfig.assigneeId,
                // }
            },
        };
        try {
            const response = await axios.post(jiraConfig.apiEndpoint, payload, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${jiraConfig.email}:${jiraConfig.apiKey}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            });
            // Extract the issue key from the response
    const issueKey = response.data.key; // Assuming 'key' is the correct field

    // Construct the browse URL
    const browseUrl = `https://${jiraConfig.domain}/browse/${issueKey}`;

    return browseUrl;
        } catch (error: any) {
            console.error('Failed to create Jira ticket:', error.response ? error.response.data : error);
            return new JiraTicketCreationError('Failed to create Jira ticket');
        }
    }

    private getFrontendUrl(path: string, softwareName: string): string {
        let host = this.req.get('host');
        const softwareNameForURL = softwareName.replace(' ', '%20');

        if (host?.startsWith('api.')) {
            host = host.substring(4); // delete 'api.' from URL
        }

        let baseUrl = `${this.req.protocol}://${host}`;
        return `${baseUrl}${path}${softwareNameForURL}`;
    }
}
