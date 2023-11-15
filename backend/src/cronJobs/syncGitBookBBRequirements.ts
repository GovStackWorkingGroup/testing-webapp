import { processBBRequirements } from "../services/gitBookService/bbRequirementsProcessing";

export async function syncGitBookBBRequirements() {
    try {
        console.log('Starting to fetch and process BB requirements from GitBook...');

        const requirements = await processBBRequirements();

        if (requirements.length > 0) {
            console.log(`Successfully processed ${requirements.length} GitBook entries.`);
        } else {
            console.log('No requirements found.');
        }

    } catch (error) {
        console.error('An error occurred while processing GitBook requirements:', error);
    }
}

export default syncGitBookBBRequirements;
