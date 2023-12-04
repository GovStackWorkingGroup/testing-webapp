import GitBookCollectionManager from './CollectionsManager';
import GitBookSpaceManager from './SpacesManager';
import GitBookPageContentManager from './PageContentManager';
import BBRequirements from '../../db/schemas/bbRequirements';

const processBBRequirements = async () => {
    const collectionManager = new GitBookCollectionManager();
    const spaceManager = new GitBookSpaceManager();
    const pageContentManager = new GitBookPageContentManager();
    let errors: string[] = [];

    const processPages = async (spaceInfo, pageType) => {
        const pageIds = await spaceManager.fetchPages(spaceInfo.spaceId, pageType);
        const results = await Promise.all(pageIds.map(async (pageId) => {
            try {
                const pageContent = await spaceManager.fetchPageContent(spaceInfo.spaceId, pageId);
                const extractResult = pageContentManager.extractRequirements(pageContent);

                if (extractResult.error) {
                    errors.push(`Error extracting requirements for page ID ${pageId}: ${extractResult.error.message}`);
                    return null;
                }

                return extractResult.requirements; // Return the extracted requirements
            } catch (error: any) {
                errors.push(`Error processing page ID ${pageId}: ${error.message}`);
                return null;
            }
        }));

        // Flatten the results and filter out null values
        return results.flat().filter(r => r !== null);
    };

    try {
        const bbCollections = await collectionManager.fetchCollections('bb');
        const allPageContents = await Promise.all(bbCollections.map(async ({ id: collectionId, bbKey, bbName }) => {
           try {
                const spaceInfo = await collectionManager.fetchLatestVersionSpaceIdAndVersion(collectionId);
                if (!spaceInfo) {
                    throw new Error('No valid space found for the collection');
                }
    
                const crossCutting = await processPages(spaceInfo, '5');
                const functional = await processPages(spaceInfo, '6');
                
                const requirements = { crossCutting, functional };
                const dateOfSave = new Date().toISOString();
                const bbRequirement = new BBRequirements({ bbKey, bbName, bbVersion: spaceInfo.version, dateOfSave, requirements });
                await bbRequirement.save();

                return { bbKey, bbName, version: spaceInfo.version, dateOfSave, requirements };
            } catch (outerError) {
                errors.push(`Error processing collection: ${(outerError as Error).message}`);
                return [];
            }
        }));

        const flattenedContents = allPageContents.flat().filter(content => content !== null);

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
