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
        let allCollections: SpaceType[] = [];

        const lowerCaseTitleStartsWith = titleStartsWith.toLowerCase();

        const { baseURL, apiKey } = appConfig.gitBook;
        const collectionUrl = `${baseURL}/v1/orgs/${this.orgId}/collections`
        const response = await fetch(collectionUrl, 
          {headers: { 'Authorization': `Bearer ${apiKey}` }})
        let data = await response.json();

        if (!response || response.status !== 200 || !data || !data.items) {
          throw new GitBookCollectionManagerError('Failed to fetch collections.');
        }

        allCollections = allCollections.concat(data.items);
        // If it contains a 'next' object, call again to get remaining items - ?page=next-page-id
        while (data.next) {
          const response = await fetch(`${collectionUrl}?page=${data.next.page}`, 
            {headers: { 'Authorization': `Bearer ${apiKey}` }})
          data = await response.json();
          allCollections = allCollections.concat(data.items);
        }
        
        allCollections.map((item) => {
          console.log(JSON.stringify(item.title));
        })
        return allCollections
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
        // Note that GovStack is no longer using semantic versioning. 
 
        // TO DO: Allow user to select version of spec that they want to measure compliance against,
        //    which means storing functional requirements for each version of each spec
        const spaces = await this.fetchSpacesForCollection(collectionId);
        let highestVersionSpace: SpaceType | null = null;

        spaces.forEach(space => {
          /*if (space.title === 'development') {
            highestVersionSpace = space;
          }*/

          if (this.isVersion(space.title)) {
            if (!highestVersionSpace || this.compareVersions(space.title, highestVersionSpace.title) > 0) {
                highestVersionSpace = space;
            }
          }
        });

        if (!highestVersionSpace) {
            highestVersionSpace = { id: '', title: '' };
        }

        return highestVersionSpace ? { spaceId: highestVersionSpace.id, version: highestVersionSpace.title } : null;

    };

    // Checks if the title is in GovStack version format ({YY}Q{q} - 23Q4, 24Q2, etc)
    isVersion(title: string) {
        return /^\d{2}Q[1-4](.\d)?$/.test(title);
    };

    versionToArray(versionTitle: string) {
        const matches = versionTitle.match(/^(\d{2})Q([1-4]).?(\d)?$/);
        return matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3], 10)] : [0, 0, 0];
    };

    compareVersions(version1: string, version2: string) {
        const [year1, quarter1, patch1] = this.versionToArray(version1);
        const [year2, quarter2, patch2] = this.versionToArray(version2);
    
        if (year1 > year2) return 1;
        if (year1 < year2) return -1;
        if (quarter1 > quarter2) return 1;
        if (quarter1 < quarter2) return -1;
        if (patch1 !== undefined) {
          if (patch1 > patch2 || isNaN(patch2)) return 1;
          if (patch1 < patch2) return -1;
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
