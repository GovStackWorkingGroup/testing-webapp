import { RequirementStatusEnum } from 'myTypes';
import { appConfig } from '../../config';
import gitBookClient from './gitBookClient';
import semver from 'semver';

// Validate GitBook Configuration
const validateGitBookConfig = () => {
    const { baseURL, apiKey, orgId } = appConfig.gitBook;
    if (!baseURL || !apiKey || !orgId) {
        throw new Error('GitBook configuration is incomplete. Please check baseURL, apiKey, and orgId.');
    }
};

// Fetch Collections with a Title Starting with "bb"
const fetchCollections = async () => {
    validateGitBookConfig();
    const response = await gitBookClient.get(`/v1/orgs/${appConfig.gitBook.orgId}/collections`);
    return response.data.items
        .filter(collection => collection.title.startsWith('bb'))
        .map(collection => ({ 
            id: collection.id, 
            bbKey: collection.title, // Niezmienione bbKey
            bbName: formatCollectionTitle(collection.title) // Dodanie nowego bbName
        }));
};

// make a title from key
const formatCollectionTitle = (title) => {
    return title
        .replace(/^bb/, '') // Usunięcie 'bb' z początku
        .replace(/-/g, ' ') // Zamiana '-' na spacje
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Ustawienie każdego słowa z dużej litery
        .join(' ')
        .trim(); // Usunięcie zbędnych spacji
};

// Fetch Spaces for a Given Collection
const fetchSpacesForCollection = async (collectionId) => {
    validateGitBookConfig();
    const response = await gitBookClient.get(`/v1/collections/${collectionId}/spaces`);
    return response.data.items;
};

type SpaceType = {
    id: string;
    title: string;
    // other properties...
};
const versionToArray = (versionTitle) => {
    return versionTitle.split('.').map(Number);
};

// Sprawdzenie, czy dany tytuł jest wersją
const isVersion = (title) => {
    return /^(\d+\.)?(\d+\.)?(\*|\d+)$/.test(title); // Sprawdzenie formatu wersji np. 1.0, 1.2.3
};

// Funkcja porównująca dwie wersje
const compareVersions = (version1, version2) => {
    const num1 = versionToArray(version1);
    const num2 = versionToArray(version2);

    for (let i = 0; i < Math.max(num1.length, num2.length); i++) {
        const val1 = num1[i] || 0;
        const val2 = num2[i] || 0;

        if (val1 > val2) return 1;
        if (val1 < val2) return -1;
    }

    return 0; // Wersje są równe
};
const fetchHighestVersionSpaceIdAndVersion = async (collectionId) => {
    const spaces = await fetchSpacesForCollection(collectionId);
    let highestVersionSpace: SpaceType | null = null;
    let highestVersion = '';

    spaces.forEach(space => {
        if (isVersion(space.title)) {
            if (!highestVersionSpace || compareVersions(space.title, highestVersionSpace.title) > 0) {
                highestVersionSpace = space;
            }
        }
    });

    // Jeśli nie znaleziono żadnej wersji, użyj pierwszego napotkanego tytułu
    if (!highestVersionSpace) {
        highestVersionSpace = spaces.length > 0 ? spaces[0] : null;
    }

    return highestVersionSpace ? { spaceId: highestVersionSpace.id, version: highestVersionSpace.title } : null;

};

// Fetch Pages with Titles Starting with "5"
const fetchPagesStartingWithFive = async (spaceId) => {
    validateGitBookConfig();
    const response = await gitBookClient.get(`/v1/spaces/${spaceId}/content`);
    if (!response.data.pages || !Array.isArray(response.data.pages)) {
        throw new Error(`Pages not found or not in an array format in space with ID ${spaceId}`);
    }

    return response.data.pages
        .filter(page => page.title.startsWith('5'))
        .map(page => page.id);  // Return only the IDs of the pages
};

const fetchPageContent = async (spaceId: string, pageId: string): Promise<Record<string, any>> => {
    validateGitBookConfig();
    try {
        const response = await gitBookClient.get(`/v1/spaces/${spaceId}/content/page/${pageId}`);
        return response.data;  // Return the content of the page
    } catch (error) {
        console.error(`Error fetching content for page ID ${pageId} in space ID ${spaceId}:`, error);
        throw error;
    }
};

type Requirement = {
    status: RequirementStatusEnum;
    requirement: string;
};

const extractRequirements = (pageContent): Requirement[] => {
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


// Main function to process BB requirements
const processBBRequirements = async () => {
    const bbCollections = await fetchCollections();
    let allPageContents: Record<string, any>[] = [];
    for (const { id: collectionId, bbKey, bbName } of bbCollections) {
        const spaceInfo = await fetchHighestVersionSpaceIdAndVersion(collectionId);
        if (spaceInfo) {
            const pageIds = await fetchPagesStartingWithFive(spaceInfo.spaceId);
            for (const pageId of pageIds) {
                const pageContent = await fetchPageContent(spaceInfo.spaceId, pageId);
                const crossCutting = extractRequirements(pageContent);
                const dateOfSave = new Date().toISOString();

                // Zagnieżdżenie danych requirements wewnątrz crossCutting
                const requirements = { crossCutting };

                allPageContents.push({ bbKey, bbName, version: spaceInfo.version, dateOfSave, requirements });
            }
        } else {
            console.log(`No valid space found for collection ID: ${collectionId}`);
        }
    }

    return processData(allPageContents);
};

// Helper function to process the data
const processData = (data) => {
    // Data processing logic
    return data; // Return processed data
};

export { fetchCollections, processBBRequirements };
