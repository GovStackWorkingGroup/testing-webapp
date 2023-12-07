import gitBookClient from "./gitBookClient";

class GitBookSpaceManager {

    constructor() {
    }

    async fetchPages(spaceId: string, titlePattern: RegExp = new RegExp('')) {
        const response = await gitBookClient.get(`/v1/spaces/${spaceId}/content`);
        if (!response.data.pages || !Array.isArray(response.data.pages)) {
            throw new Error(`Pages not found or not in an array format in space with ID ${spaceId}`);
        }

        return response.data.pages
            .filter(page => titlePattern.test(page.title))
            .map(page => page.id);  // Return only the IDs of the pages
    };

    async fetchPageContent(spaceId: string, pageId: string): Promise<Record<string, any>> {
        try {
            const response = await gitBookClient.get(`/v1/spaces/${spaceId}/content/page/${pageId}`);
            return response.data;  // Return the content of the page
        } catch (error) {
            console.error(`Error fetching content for page ID ${pageId} in space ID ${spaceId}:`, error);
            throw error;
        }
    };

}

export default GitBookSpaceManager;
