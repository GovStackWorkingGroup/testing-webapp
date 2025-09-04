import { appConfig } from "../../config";
import gitBookClient from "./gitBookClient";

type SpaceType = {
    id: string;
    title: string;
};

export type Site = {
    id: string,
    title: string,
};

type SpaceInfo = {
  spaceId: string,
  version: string,
};

class GitBookCollectionManagerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GitBookCollectionManagerError';
    }
}

export default class GitBookCollectionManager {
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

    async fetchSites(titleStartsWith: string = ''): Promise<Array<Site>> {
        const sites: Array<any> = [];
        const lowerCaseTitleStartsWith = titleStartsWith.toLowerCase();

        let { data } = await gitBookClient.get(`/v1/orgs/${this.orgId}/sites`);

        sites.push(...data.items);

        // Consume all paginated items
        while (data.next) {
            data = (await gitBookClient.get(`/v1/orgs/${this.orgId}/sites?page=${data.next.page}`)).data;

            sites.push(...data.items);
        }

        return sites
          .filter((site) => site.title.toLowerCase().startsWith(lowerCaseTitleStartsWith));
    }

    async fetchSpacesForSite(siteId: string) {
        const response = await gitBookClient.get(`/v1/orgs/${this.orgId}/sites/${siteId}/site-spaces?default=true`);

        return response.data.items;
    }

    async fetchLatestVersionSpaceIdAndVersion(siteId: string): Promise<SpaceInfo | null> {
        const spaces = (await this.fetchSpacesForSite(siteId)).filter((s) => s.default);
        const lastSpace = spaces[spaces.length - 1];

        if (!isVersion(lastSpace.space.title)) {
            return null;
        }

        return {
          spaceId: lastSpace.space.id,
          version: lastSpace.space.title,
        };
    };
};

// Checks if the title is in GovStack version format ({YY}Q{q} - 23Q4, 24Q2, etc)
function isVersion(title: string): boolean {
    return /^(\d+\.)?(\d+\.)?(\*|\d+)$/.test(title) || /^\d{2}Q[1-4](.\d)?$/.test(title);
};

/**
 * Example: "bb-payments" becomes "Payments"
 */
export function formatCollectionTitle(title: string) {
    return title
        .replace(/^bb/, '') // Remove 'bb' prefix
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .split(' ') // Split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
        .join(' ') // Combine words with spaces
        .trim(); // Trim whitespace
}
