import { appConfig } from "../../config";
import { RequirementStatusEnum } from "../../db/schemas/compliance/complianceUtils";

class GitBookPageManagerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GitBookPageManagerError';
    }
}

class KeyDigitalFunctionalitiesExtractor {
    extractKeyDigitalFunctionalitiesRequirements(pageContent: any, spaceID, requirementURL) {
        if (!pageContent?.document?.nodes) {
            return { error: new GitBookPageManagerError("Invalid page content format.") };
        }

        const requirements: { status: number; requirement: string; link: string }[] = [];
        const nodes: any[] = pageContent.document.nodes;

        nodes.forEach((node, index) => {    
            if (this.isRelevantHeading(node, '4.')) {
                this.processHeadingAndSubHeadings(nodes, index, requirements, spaceID, requirementURL);
            }
        });

        return { requirements };
    }

    private isRelevantHeading(node: any, prefix: string): boolean {
        if (node.type && node.type.startsWith('heading-')) {
            const headingText = this.extractTextFromNodeKDF(node);
            return headingText.startsWith(prefix);
        }
        return false;
    }

    private processHeadingAndSubHeadings(nodes: any[], startIndex: number, requirements: { status: number; requirement: string; link: string }[], spaceID: string, requirementURL: string) {
        const { headingText, currentHeadingLevel, contentUnderHeading } = this.initializeHeadingProcessing(nodes, startIndex);

        let index = startIndex + 1;
        let hasList = false;
        const keyDigitalFunctionalitiesStatus = "(REQUIRED)";

        while (index < nodes.length) {
            const node = nodes[index];
            if (this.isNewSection(node, currentHeadingLevel)) break;

            if (this.isRelevantHeading(node, '4.')) {
                this.processHeadingAndSubHeadings(nodes, index, requirements, spaceID, requirementURL);
                index++;
                continue;
            }

            if (this.isListNode(node.type)) {
                hasList = true;
                this.processListNode(node, requirements, spaceID, requirementURL, headingText);
            } else if (!hasList) {
                contentUnderHeading.push(this.extractTextFromNodeKDF(node));
            }

            index++;
        }

        if (!hasList && contentUnderHeading.length > 0) {
            const link = this.generateLink(headingText, spaceID, requirementURL);
            requirements.push({
                status: RequirementStatusEnum.REQUIRED,
                requirement: `${keyDigitalFunctionalitiesStatus} ${contentUnderHeading.join(' ').trim()}`,
                link
            });
        }
    }

    private initializeHeadingProcessing(nodes: any[], startIndex: number) {
        const headingText = this.extractTextFromNodeKDF(nodes[startIndex]);
        const currentHeadingLevel = this.getHeadingLevel(headingText);
        const contentUnderHeading: string[] = [];

        return { headingText, currentHeadingLevel, contentUnderHeading };
    }

    private isNewSection(node: any, currentHeadingLevel: number): boolean {
        if (node.type && node.type.startsWith('heading-')) {
            const nextHeadingLevel = this.getHeadingLevel(this.extractTextFromNodeKDF(node));
            return nextHeadingLevel <= currentHeadingLevel;
        }
        return false;
    }

    private getHeadingLevel(headingText: string): number {
        const match = headingText.match(/^(\d+(\.\d+)*).*/);
        return match ? match[1].split('.').length : 0;
    }

    private processListNode(node: any, requirements: { status: number; requirement: string; link: string }[], spaceID: string, url: string, headingText: string) {
        if (node.nodes) {
            node.nodes.forEach((item: any) => {
                const itemText = this.extractTextFromNodeKDF(item);
                if (itemText.trim()) {
                    const link = this.generateLink(headingText, spaceID, url);
                    requirements.push({ status: 0, requirement: itemText.trim(), link });
                }
            });
        }
    }

    private generateLink(heading, spaceID, requirementURL) {
        const modifiedBaseURL = appConfig.gitBook.baseURL.replace('api', 'app');
        const id = 'id-' + heading.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\.-]/g, '');
        return `${modifiedBaseURL}/o/${appConfig.gitBook.orgId}/s/${spaceID}/${requirementURL}#${id}`;
    }

    private extractTextFromNodeKDF(node: any): string {
        if (node.object === 'text') {
            return node.leaves.map((leaf: any) => leaf.text).join(' ').trim();
        } else if (node.object === 'block' || node.object === 'inline') {
            return node.nodes.map((innerNode: any) => this.extractTextFromNodeKDF(innerNode)).join(' ').trim();
        }
        return '';
    }

    private isListNode(type: string): boolean {
        return ['list-unordered', 'list-ordered'].includes(type);
    }
}

export default KeyDigitalFunctionalitiesExtractor;
