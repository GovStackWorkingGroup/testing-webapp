import { appConfig } from "../../config";
import gitBookClient from "./gitBookClient";

type SpaceType = {
    id: string;
    title: string;
};

class GitBookCollectionManagerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GitBookCollectionManagerError';
    }
}

class GitBookCollectionManager {

    private orgId: string;

    constructor(orgId = appConfig.gitBook.orgId) {
        this.orgId = orgId;
        this.validateGitBookConfig();
    }

    validateGitBookConfig() {
        const { baseURL, apiKey } = appConfig.gitBook;
        if (!baseURL || !apiKey || !this.orgId) {
            throw new GitBookCollectionManagerError('GitBook configuration is incomplete. Please check baseURL, apiKey, and orgId.');
        }
    }

    async fetchCollections(titleStartsWith: string = '') {
        const response = await gitBookClient.get(`/v1/orgs/${this.orgId}/collections`);
        const lowerCaseTitleStartsWith = titleStartsWith.toLowerCase();

        if (!response || response.status !== 200 || !response.data || !response.data.items) {
            throw new GitBookCollectionManagerError('Failed to fetch collections.');
        }
        return response.data.items
            .filter(collection => collection.title.toLowerCase().startsWith(lowerCaseTitleStartsWith))
            .map(collection => ({
                id: collection.id,
                bbKey: collection.title,
                bbName: this.formatCollectionTitle(collection.title)
            }));
    }

    async fetchSpacesForCollection(collectionId) {
        const response = await gitBookClient.get(`/v1/collections/${collectionId}/spaces`);
        return response.data.items
    }

    async fetchLatestVersionSpaceIdAndVersion(collectionId) {
        const spaces = await this.fetchSpacesForCollection(collectionId);
        let highestVersionSpace: SpaceType | null = null;

        spaces.forEach(space => {
            if (this.isVersion(space.title)) {
                if (!highestVersionSpace || this.compareVersions(space.title, highestVersionSpace.title) > 0) {
                    highestVersionSpace = space;
                }
            }
        });

        if (!highestVersionSpace) {
            highestVersionSpace = spaces.length > 0 ? spaces[0] : null;
        }

        return highestVersionSpace ? { spaceId: highestVersionSpace.id, version: highestVersionSpace.title } : null;

    };

    // Checks if the title is in semantic versioning format (Major.Minor.Patch).
    isVersion(title: string) {
        return /^(\d+\.)?(\d+\.)?(\*|\d+)$/.test(title);
    };

    versionToArray(versionTitle: string) {
        return versionTitle.split('.').map(Number);
    };

    compareVersions(version1: string, version2: string) {
        const version_parts1 = this.versionToArray(version1);
        const version_parts2 = this.versionToArray(version2);

        for (let versionIndex = 0; versionIndex < Math.max(version_parts1.length, version_parts2.length); versionIndex++) {
            const versionComponent1 = version_parts1[versionIndex] || 0;
            const versionComponent2 = version_parts2[versionIndex] || 0;

            if (versionComponent1 > versionComponent2) return 1;
            if (versionComponent1 < versionComponent2) return -1;
        }

        return 0;
    };

    formatCollectionTitle(title: string) {
        return title
            .replace(/^bb/, '') // Remove 'bb' prefix
            .replace(/-/g, ' ') // Replace hyphens with spaces
            .split(' ') // Split into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
            .join(' ') // Combine words with spaces
            .trim(); // Trim whitespace
    }
    // Example: "bb-payments" becomes "Payments"
}

export default GitBookCollectionManager;
