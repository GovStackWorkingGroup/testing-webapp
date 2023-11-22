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

    extractRequirements(pageContent) {
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

                let status;
                if (textContent.includes(GitBookPageContentManager.REQUIRED_TEXT)) {
                    status = RequirementStatusEnum.REQUIRED;
                } else if (textContent.includes(GitBookPageContentManager.RECOMMENDED_TEXT)) {
                    status = RequirementStatusEnum.RECOMMENDED;
                } else if (textContent.includes(GitBookPageContentManager.OPTIONAL_TEXT)) {
                    status = RequirementStatusEnum.OPTIONAL;
                }

                if (status !== undefined) {
                    // Remove the status text from the content
                    textContent = textContent.replace(/\(REQUIRED\)|\(RECOMMENDED\)|\(OPTIONAL\)/, '').trim();
                    requirements.push({ status, requirement: textContent });
                }
            }
        });

        return { requirements };
    };

}

export default GitBookPageContentManager;
