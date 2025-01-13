export interface WebsiteBase {
    name: string
    domain_url: string
    favicon_image: string;
}


export interface WebsiteStore {
    createWebsite: (website: WebsiteBase) => Promise<void>;
    getWebsites: (limit: number, skip: number) => Promise<void>;
    websites: WebsiteBase[] | [];
    websiteLoading: boolean;
    websiteError: boolean;
}