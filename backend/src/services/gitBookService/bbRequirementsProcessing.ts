import GitBookCollectionManager from './CollectionsManager';
import GitBookSpaceManager from './SpacesManager';
import GitBookPageContentManager from './PageContentManager';

const processBBRequirements = async () => {
    const collectionManager = new GitBookCollectionManager();
    const spaceManager = new GitBookSpaceManager();
    const pageContentManager = new GitBookPageContentManager();

    const bbCollections = await collectionManager.fetchCollections('bb');

    let allPageContents: Record<string, any>[] = [];
    for (const { id: collectionId, bbKey, bbName } of bbCollections) {
        const spaceInfo = await collectionManager.fetchHighestVersionSpaceIdAndVersion(collectionId);
        if (spaceInfo) {
            const pageIds = await spaceManager.fetchPages(spaceInfo.spaceId, '5');
            for (const pageId of pageIds) {
                const pageContent = await spaceManager.fetchPageContent(spaceInfo.spaceId, pageId);
                const crossCutting = pageContentManager.extractRequirements(pageContent);
                const dateOfSave = new Date().toISOString();

                const requirements = { crossCutting };

                allPageContents.push({ bbKey, bbName, version: spaceInfo.version, dateOfSave, requirements });
            }
        } else {
            console.log(`No valid space found for collection ID: ${collectionId}`);
        }
    }

    return allPageContents;
};

export { processBBRequirements };
