import GitBookCollectionManager from './CollectionsManager';
import GitBookSpaceManager from './SpacesManager';
import GitBookPageContentManager from './PageContentManager';
import BBRequirements from '../../db/schemas/bbRequirements';

const processBBRequirements = async () => {
    const collectionManager = new GitBookCollectionManager();
    const spaceManager = new GitBookSpaceManager();
    const pageContentManager = new GitBookPageContentManager();
    let errors: string[] = [];

    try {
        const bbCollections = await collectionManager.fetchCollections('bb');
        const allPageContentsPromises = bbCollections.map(async ({ id: collectionId, bbKey, bbName }) => {
            try {
                const spaceInfo = await collectionManager.fetchLatestVersionSpaceIdAndVersion(collectionId);
                if (!spaceInfo) {
                    throw new Error('No valid space found for the collection');
                }
    
                const pageIds = await spaceManager.fetchPages(spaceInfo.spaceId, '5');
                const pageContentsPromises = pageIds.map(async (pageId) => {
                    try {
                        const pageContent = await spaceManager.fetchPageContent(spaceInfo.spaceId, pageId);
                        const extractResult = pageContentManager.extractRequirements(pageContent);
    
                        // Check if the result contains an error
                        if (extractResult.error) {
                            errors.push(`Error extracting requirements for page ID ${pageId}: ${extractResult.error.message}`);
                            return null; // Skip processing this page
                        }
    
                        // Assuming successful extraction
                        const crossCutting = extractResult.requirements; 
                        const dateOfSave = new Date().toISOString();
    
                        const requirements = { crossCutting };
                        const bbRequirement = new BBRequirements({ bbKey, bbName, bbVersion: spaceInfo.version, dateOfSave, requirements });
                        await bbRequirement.save();
    
                        return { bbKey, bbName, version: spaceInfo.version, dateOfSave, requirements };
                    } catch (innerError) {
                        errors.push(`Error processing page ID ${pageId}: ${(innerError as Error).message}`);
                        return null;
                    }
                });
    
                return Promise.all(pageContentsPromises);
            } catch (outerError) {
                errors.push(`Error processing collection: ${(outerError as Error).message}`);
                return [];
            }
        });

        const allPageContentsNested = await Promise.all(allPageContentsPromises);
        const flattenedContents = allPageContentsNested.flat().filter(content => content !== null);

        return {
            success: errors.length === 0,
            requirements: flattenedContents,
            errors: errors
        };
    } catch (error) {
        return {
            success: false,
            requirements: [],
            errors: [...errors, `General error: ${(error as Error).message}`]
        };
    }
};

export { processBBRequirements };
