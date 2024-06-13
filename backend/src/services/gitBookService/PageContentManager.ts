import { RequirementStatusEnum } from "myTypes";
import KeyDigitalFunctionalitiesExtractor from "./KeyDigitalFunctionalitiesExtractor";

type Requirement = {
    status: RequirementStatusEnum;
    requirement: string;
};

class GitBookPageManagerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GitBookPageManagerError';
    }
}

class GitBookPageContentManager {
    static REQUIRED_TEXT = "(REQUIRED)";
    static RECOMMENDED_TEXT = "(RECOMMENDED)";
    static OPTIONAL_TEXT = "(OPTIONAL)";

    private kdfExtractor: KeyDigitalFunctionalitiesExtractor;

    constructor() {
        this.kdfExtractor = new KeyDigitalFunctionalitiesExtractor();
    }

    extractInterfaceRequirements(documentObject, _) {
        if (!documentObject.pages || !Array.isArray(documentObject.pages)) {
            return { error: new Error("Invalid or missing 'pages' property in documentObject") };
        }

        const numericPrefixRegex = /^\d+(\.\d+)*\s*/;
        const CROSS_CUTTING_REQUIREMENTS_REGEX = /cross[\s-]?cutting[\s-]?requirements/i;

        const pageTitleRegex = new RegExp(numericPrefixRegex.source + CROSS_CUTTING_REQUIREMENTS_REGEX.source, 'i');

        const filteredPages = documentObject.pages.filter(page => pageTitleRegex.test(page.title));
        const requirements: Requirement[] = [];

        filteredPages.forEach(doc => {
            doc.pages.forEach(page => {
                let textContent = page.header; // assuming 'header' is the property containing the text
                textContent = textContent.replace(numericPrefixRegex, ''); // Remove numeric prefix

                let status = this.extractStatus(textContent); // Assuming extractStatus function exists
                if (status !== undefined) {
                    textContent = textContent.replace(/\(REQUIRED\)|\(RECOMMENDED\)|\(OPTIONAL\)/, '').trim();
                    requirements.push({ status, requirement: textContent });
                }
            });
        });

        return { requirements };
    }



    extractCrossCuttingRequirements(pageContent, _) {
        try {
            if (!pageContent?.document?.nodes) {
                throw new GitBookPageManagerError("Invalid page content format.");
            }

            const nodes = pageContent.document.nodes;
            const requirements: Requirement[] = [];

            let currentRequirement: Requirement | null = null;

            nodes.forEach((node: any) => {
                if ((node.type === 'heading-1' || node.type === 'heading-2' || node.type === 'heading-3') && node.nodes) {
                    if (currentRequirement) {
                        requirements.push(currentRequirement);
                        currentRequirement = null;
                    }
                    let headerText = node.nodes.map((n: any) => n.leaves.map((leaf: any) => leaf.text).join('')).join('');
                    this.processTextForRequirement(headerText, requirements);
                    currentRequirement = requirements.pop() || null; // Extract the processed requirement to continue appending text
                } else if (currentRequirement) {
                    if (node.object === 'block') {
                        let textContent = node.nodes.map((n: any) => this.extractText(n)).join('');
                        currentRequirement.requirement += ' ' + textContent.trim();
                    }
                }
            });

            if (currentRequirement) {
                requirements.push(currentRequirement);
            }

            return { requirements };
        } catch (error) {
            return { error: new GitBookPageManagerError((error as Error).message) };
        }
    }

    private extractText(node: any): string {
        if (node.object === 'text') {
            return node.leaves.map((leaf: any) => leaf.text).join('');
        } else if (node.object === 'block' || node.object === 'inline') {
            return node.nodes.map((n: any) => this.extractText(n)).join('');
        }
        return '';
    }

    extractFunctionalRequirements(pageContent) {
        if (!pageContent?.document?.nodes) {
            return { error: new GitBookPageManagerError("Invalid page content format.") };
        }

        const nodes = pageContent.document.nodes;
        const requirements: Requirement[] = [];

        nodes.forEach(node => {
            if (node.type == 'heading-2') {
                const headingText = node.nodes.map(textNode => {
                    return textNode.leaves.map(leaf => leaf.text).join('');
                }).join('');
                this.processTextForRequirement(headingText, requirements);
            }
            else if (node.type == 'list-unordered' || node.type == 'list-ordered') {
                node.nodes.forEach(item => {
                    let itemText = this.extractTextFromNode(item);
                    this.processTextForRequirement(itemText, requirements);
                });
            }
        });

        return { requirements };
    }

    extractKeyDigitalFunctionalitiesRequirements(pageContent: any) {
        return this.kdfExtractor.extractKeyDigitalFunctionalitiesRequirements(pageContent);
    }

    extractTextFromNode(node) {
        let textContent = '';
        let foundStatus = false;
        if (node.nodes && node.nodes.length > 0) {
            node.nodes.forEach(innerNode => {
                if (innerNode.nodes && innerNode.nodes.length > 0) {
                    innerNode.nodes.forEach(textNode => {
                        if (textNode.object === 'text' && !foundStatus) {
                            textNode.leaves.forEach(leaf => {
                                const statusMatch = leaf.text.match(/(\(REQUIRED\)|\(RECOMMENDED\)|\(OPTIONAL\))/);
                                if (statusMatch) {
                                    const statusIndex = leaf.text.indexOf(statusMatch[0]);
                                    textContent += leaf.text.slice(0, statusIndex + statusMatch[0].length);
                                    foundStatus = true; // Stop processing further text after finding the status
                                } else if (!foundStatus) {
                                    textContent += leaf.text;
                                }
                            });
                        }
                    });
                }
            });
        }
        return textContent;
    }

    processTextForRequirement(text, requirements) {
        // Remove leading numeric sequences like "number.number.number"
        const sanitizedText = text.replace(/^\d+\.\d+(\.\d+)?\s*/, '').trim();
        
        let status = this.extractStatus(text);
        if (status !== undefined) {
            const regex = /\((REQUIRED|RECOMMENDED|OPTIONAL)\)/;
            const match = sanitizedText.match(regex);
            const textReqRecOpt = match ? match[0] : '';
            const modifiedText = sanitizedText.replace(regex, '').trim();
            const finalText = textReqRecOpt + ' ' + modifiedText + ".";

            requirements.push({ status, requirement: finalText });
        }
    }

    private extractStatus(textContent) {
        if (textContent.includes(GitBookPageContentManager.REQUIRED_TEXT)) {
            return RequirementStatusEnum.REQUIRED;
        } else if (textContent.includes(GitBookPageContentManager.RECOMMENDED_TEXT)) {
            return RequirementStatusEnum.RECOMMENDED;
        } else if (textContent.includes(GitBookPageContentManager.OPTIONAL_TEXT)) {
            return RequirementStatusEnum.OPTIONAL;
        }
        return undefined;
    }

    async filterPagesByTitle(documentObject, titleRegex: RegExp): Promise<string[]> {
        // Ensure that the document object has a 'pages' property and it's an array
        if (!documentObject.pages || !Array.isArray(documentObject.pages)) {
            throw new Error("Invalid or missing 'pages' property in documentObject");
        }

        // Filter the pages based on the regex applied to their titles
        const filteredPageIds: string[] = documentObject.pages
            .filter(page => titleRegex.test(page.title))
            .map(page => page.id); // Extract the page IDs

        return filteredPageIds;
    }
}

export default GitBookPageContentManager;
