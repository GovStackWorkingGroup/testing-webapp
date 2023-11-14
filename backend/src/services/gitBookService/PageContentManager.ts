import { RequirementStatusEnum } from "myTypes";

type Requirement = {
    status: RequirementStatusEnum;
    requirement: string;
};

class GitBookPageContentManager {

    constructor() {
    }

    extractRequirements(pageContent): Requirement[] {
        if (!pageContent || !pageContent.document || !pageContent.document.nodes) {
            console.log("Invalid page content format.");
            return [];
        }

        const nodes = pageContent.document.nodes;
        const requirements: Requirement[] = [];
        const numericPrefixRegex = /^\d+(\.\d+)*\s*/;

        nodes.forEach(node => {
            if (node.type === 'heading-1' && node.nodes) {
                let textContent = node.nodes.map(n => n.leaves.map(leaf => leaf.text).join('')).join('');
                textContent = textContent.replace(numericPrefixRegex, ''); // Remove numeric prefix

                let status;
                if (textContent.includes("(REQUIRED)")) {
                    status = RequirementStatusEnum.REQUIRED;
                } else if (textContent.includes("(RECOMMENDED)")) {
                    status = RequirementStatusEnum.RECOMMENDED;
                } else if (textContent.includes("(OPTIONAL)")) {
                    status = RequirementStatusEnum.OPTIONAL;
                }

                if (status !== undefined) {
                    // Remove the status text from the content
                    textContent = textContent.replace(/\(REQUIRED\)|\(RECOMMENDED\)|\(OPTIONAL\)/, '').trim();
                    requirements.push({ status, requirement: textContent });
                }
            }
        });

        return requirements;
    };

}

export default GitBookPageContentManager;
