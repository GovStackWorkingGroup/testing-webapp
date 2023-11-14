import { appConfig } from "../../config";
import gitBookClient from "./gitBookClient";

type SpaceType = {
    id: string;
    title: string;
};

class GitBookCollectionManager {

    private orgId: string;

    constructor(orgId = appConfig.gitBook.orgId) {
        this.orgId = orgId;
        this.validateGitBookConfig();
    }

    validateGitBookConfig() {
        const { baseURL, apiKey } = appConfig.gitBook;
        if (!baseURL || !apiKey || !this.orgId) {
            throw new Error('GitBook configuration is incomplete. Please check baseURL, apiKey, and orgId.');
        }
    }

    async fetchCollections(titleStartsWith: string = '') {
        const response = await gitBookClient.get(`/v1/orgs/${this.orgId}/collections`);
        return response.data.items
            .filter(collection => collection.title.startsWith(titleStartsWith))
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

    async fetchHighestVersionSpaceIdAndVersion(collectionId) {
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

    isVersion(title: string) {
        return /^(\d+\.)?(\d+\.)?(\*|\d+)$/.test(title);
    };

    versionToArray(versionTitle: string) {
        return versionTitle.split('.').map(Number);
    };

    compareVersions(version1: string, version2: string) {
        const num1 = this.versionToArray(version1);
        const num2 = this.versionToArray(version2);

        for (let i = 0; i < Math.max(num1.length, num2.length); i++) {
            const val1 = num1[i] || 0;
            const val2 = num2[i] || 0;

            if (val1 > val2) return 1;
            if (val1 < val2) return -1;
        }

        return 0;
    };

    formatCollectionTitle(title: string) {
        return title
            .replace(/^bb/, '')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .trim();
    }
}

export default GitBookCollectionManager;