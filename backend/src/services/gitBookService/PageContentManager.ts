import { RequirementStatusEnum } from "myTypes";

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

    extractCrossCuttingRequirements(pageContent) {
        if (!pageContent?.document?.nodes) {
            return { error: new GitBookPageManagerError("Invalid page content format.") };
        }

        const nodes = pageContent.document.nodes;
        const requirements: Requirement[] = [];
        const numericPrefixRegex = /^\d+(\.\d+)*\s*/;

        nodes.forEach(node => {
            if (node.type === 'heading-1' && node.nodes) {
                let textContent = node.nodes.map(n => n.leaves.map(leaf => leaf.text).join('')).join('');
                textContent = textContent.replace(numericPrefixRegex, ''); // Remove numeric prefix

                let status = this.extractStatus(textContent);
                if (status !== undefined) {
                    textContent = textContent.replace(/\(REQUIRED\)|\(RECOMMENDED\)|\(OPTIONAL\)/, '').trim();
                    requirements.push({ status, requirement: textContent });
                }
            }
        });

        return { requirements };
    }

    extractFunctionalRequirements(pageContent) {
        if (!pageContent?.document?.nodes) {
            return { error: new GitBookPageManagerError("Invalid page content format.") };
        }

        const nodes = pageContent.document.nodes;
        const requirements: Requirement[] = [];

        nodes.forEach(node => {

            // Check if the node is a list
            if (node.type == 'list-unordered' || node.type == 'list-ordered') {
                node.nodes.forEach(item => {
                    // Traverse the nested nodes to get the text content
                    let itemText = '';
                    if (item.nodes && item.nodes.length > 0) {
                        item.nodes.forEach(innerNode => {
                            if (innerNode.nodes && innerNode.nodes.length > 0) {
                                innerNode.nodes.forEach(textNode => {
                                    if (textNode.object === 'text') {
                                        itemText += textNode.leaves.map(leaf => leaf.text).join('');
                                    }
                                });
                            }
                        });
                    }
                    let status = this.extractStatus(itemText);
                    if (status !== undefined) {
                        itemText = itemText.replace(/\(REQUIRED\)|\(RECOMMENDED\)|\(OPTIONAL\)/, '').trim();
                        requirements.push({ status, requirement: itemText });
                    }
                });
            }
        });

        return { requirements };
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
}

export default GitBookPageContentManager;
