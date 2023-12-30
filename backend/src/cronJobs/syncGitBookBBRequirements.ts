import { processBBRequirements } from "../services/gitBookService/bbRequirementsProcessing";

export async function syncGitBookBBRequirements() {
    try {
        console.log('Starting to fetch and process BB requirements from GitBook...');

        const result = await processBBRequirements();

        if (result.success) {
            if (result.requirements && result.requirements.length > 0) {
                console.log(`Successfully processed ${result.requirements.length} GitBook entries.`);
            } else {
                console.log('No requirements found.');
            }
        } else {
            console.log('Failed to process GitBook entries.');
            if (result.errors && result.errors.length > 0) {
                console.error('Errors:', result.errors);
            }
        }
    } catch (error) {
        console.error('An unexpected error occurred while processing GitBook requirements:', error);
    }
}

export default syncGitBookBBRequirements;
