import GitBookCollectionManager from './CollectionsManager';
import GitBookSpaceManager from './SpacesManager';
import GitBookPageContentManager from './PageContentManager';
import BBRequirements from '../../db/schemas/bbRequirements';

const processBBRequirements = async () => {
    const collectionManager = new GitBookCollectionManager();
    const spaceManager = new GitBookSpaceManager();
    const pageContentManager = new GitBookPageContentManager();

    const bbCollections = await collectionManager.fetchCollections('bb');

    const allPageContentsPromises = bbCollections.map(async ({ id: collectionId, bbKey, bbName }) => {
        const spaceInfo = await collectionManager.fetchHighestVersionSpaceIdAndVersion(collectionId);
        if (!spaceInfo) {
            console.log(`No valid space found for collection ID: ${collectionId}`);
            return [];
        }

        const pageIds = await spaceManager.fetchPages(spaceInfo.spaceId, '5');
        const pageContentsPromises = pageIds.map(async (pageId) => {
            const pageContent = await spaceManager.fetchPageContent(spaceInfo.spaceId, pageId);
            const crossCutting = pageContentManager.extractRequirements(pageContent);
            const dateOfSave = new Date().toISOString();

            const requirements = { crossCutting };
            const bbRequirement = new BBRequirements({ bbKey, bbName, bbVersion: spaceInfo.version, dateOfSave, requirements });
            await bbRequirement.save();

            return { bbKey, bbName, version: spaceInfo.version, dateOfSave, requirements };
        });

        return Promise.all(pageContentsPromises);
    });

    const allPageContentsNested = await Promise.all(allPageContentsPromises);
    return allPageContentsNested.flat();
};

export { processBBRequirements };
