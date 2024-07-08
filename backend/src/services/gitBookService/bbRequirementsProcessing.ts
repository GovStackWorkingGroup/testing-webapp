import GitBookCollectionManager from './CollectionsManager';
import GitBookSpaceManager from './SpacesManager';
import GitBookPageContentManager from './PageContentManager';
import BBRequirements from '../../db/schemas/bbRequirements';

const processBBRequirements = async () => {
    const collectionManager = new GitBookCollectionManager();
    const spaceManager = new GitBookSpaceManager();
    const pageContentManager = new GitBookPageContentManager();

    const CROSS_CUTTING_REQUIREMENTS_REGEX = /cross[\s-]?cutting[\s-]?requirements/i;
    const FUNCTIONAL_REQUIREMENTS_REGEX = /functional[\s-]?requirements/i;
    const INTERFACE_REQUIREMENTS_REGEX = /Architecture[\s-]?and[\s-]?Nonfunctional[\s-]?Requirements/i;
    const KEY_DIGITAL_FUNCTIONALITIES_REQUIREMENTS_REGEX = /key[\s-]?digital[\s-]?functionalities/i;

    const CROSS_CUTTING_REQUIREMENTS_URL = "5-cross-cutting-requirements"
    const FUNCTIONAL_REQUIREMENTS_URL = "6-functional-requirements"
    const INTERFACE_REQUIREMENTS_URL = "specification/architecture-and-nonfunctional-requirements/5-cross-cutting-requirements";
    const KEY_DIGITAL_FUNCTIONALITIES_URL = "4-key-digital-functionalities"

    let errors: string[] = [];

    const processPages = async (spaceInfo, pageTypeRegex, bbKey) => {
        const pageIds = await spaceManager.fetchPages(spaceInfo.spaceId, pageTypeRegex);
        const results = await Promise.all(pageIds.map(async (pageId) => {
            try {
                const spaceID = spaceInfo.spaceId;
                const pageContent = await spaceManager.fetchPageContent(spaceID, pageId);
                let extractResult;
                if (pageTypeRegex === CROSS_CUTTING_REQUIREMENTS_REGEX) {
                    extractResult = pageContentManager.extractCrossCuttingRequirements(pageContent, null, CROSS_CUTTING_REQUIREMENTS_URL, bbKey);
                } else if (pageTypeRegex === FUNCTIONAL_REQUIREMENTS_REGEX) {
                    extractResult = pageContentManager.extractFunctionalRequirements(pageContent, FUNCTIONAL_REQUIREMENTS_URL, bbKey);
                } else if (pageTypeRegex === KEY_DIGITAL_FUNCTIONALITIES_REQUIREMENTS_REGEX) {
                    extractResult = pageContentManager.extractKeyDigitalFunctionalitiesRequirements(pageContent, spaceID, KEY_DIGITAL_FUNCTIONALITIES_URL, bbKey);
                }

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

    const processInterfaceCompliancePages = async (govStackSpecCollections, API_REQUIREMENTS) => {
        if (govStackSpecCollections.length === 0) {
            throw new Error("No collections provided for processing.");
        }
        const spaceInfo = await Promise.all(govStackSpecCollections.map(
            collection => collectionManager.fetchLatestVersionSpaceIdAndVersion(collection.id)
        ));
        const spaceId = spaceInfo[0].spaceId;
        const fetchedGovStackSpecPages: string[] = await spaceManager.fetchPages(spaceId, INTERFACE_REQUIREMENTS_REGEX)
        const fetchedGovStackSpecNestedPagesfetche = await spaceManager.fetchPageContent(spaceId, fetchedGovStackSpecPages[0]);
        const filteredPagesIds: string[] = await pageContentManager.filterPagesByTitle(
            fetchedGovStackSpecNestedPagesfetche, CROSS_CUTTING_REQUIREMENTS_REGEX
        );
        const pageContent = await spaceManager.fetchPageContent(spaceId, filteredPagesIds[0]);
        const extractResult = pageContentManager.extractCrossCuttingRequirements(
            pageContent, API_REQUIREMENTS, INTERFACE_REQUIREMENTS_URL, ""
            );
        return extractResult;
    };

    try {
        const bbCollections = await collectionManager.fetchCollections('bb');
        const govStackSpecCollections = await collectionManager.fetchCollections('GovStack Specification');
        // These are the Cross-cutting requirements that relate to APIs. We may eventually pull this
        // out into a configuration file
        const API_REQUIREMENTS = ["5.1", "5.2", "5.3", "5.4", "5.6", "5.13"]
        const architecturalRequirements = await processInterfaceCompliancePages(govStackSpecCollections, API_REQUIREMENTS);

        const allPageContents = await Promise.all(bbCollections.map(async ({ id: collectionId, bbKey, bbName }) => {
            try {
                const spaceInfo = await collectionManager.fetchLatestVersionSpaceIdAndVersion(collectionId);
                if (!spaceInfo || !spaceInfo.spaceId ||!spaceInfo.version) {
                    throw new Error('No valid space found for the collection');
                }
                bbName = getBuildingBlockName(bbKey, bbName);
                const crossCutting = await processPages(spaceInfo, CROSS_CUTTING_REQUIREMENTS_REGEX, bbKey);
                const functional = await processPages(spaceInfo, FUNCTIONAL_REQUIREMENTS_REGEX, bbKey);
                const keyDigitalFunctionalities = await processPages(spaceInfo, KEY_DIGITAL_FUNCTIONALITIES_REQUIREMENTS_REGEX, bbKey);
                const requirements = { crossCutting, functional, keyDigitalFunctionalities, interface: architecturalRequirements.requirements };
                const dateOfSave = new Date().toISOString();
                const bbRequirement = new BBRequirements({ bbKey, bbName, bbVersion: spaceInfo.version, dateOfSave, requirements });
                await BBRequirements.deleteMany({ bbKey, bbName, bbVersion: spaceInfo.version });
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

const getBuildingBlockName = (bbKey: string, bbName: string): string => {
    if (bbKey == 'bb-gis') {
        return 'GIS';
    }
    return bbName;
};

export { processBBRequirements };
