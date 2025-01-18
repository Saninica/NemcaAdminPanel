export interface WebsiteBase {
    id?: string;
    name: string
    domain_url: string
    favicon_image: string;
}


export interface WebsiteStore {
    createWebsite: (formData: FormData) => Promise<void>;
    getWebsites: (limit: number, skip: number) => Promise<void>;
    getWebsite: (id: number) => Promise<WebsiteBase | undefined>;
    updateWebsite: (id: number, website: FormData) => Promise<boolean>;
    deleteWebsite: (id: number) => Promise<boolean>;
    websites: WebsiteBase[] | [];
    website: WebsiteBase | undefined;
    websiteLoading: boolean;
    websiteError: boolean;
}


export interface WebsiteFormData extends Omit<WebsiteBase, 'favicon_image'> {
    favicon_image: FileList;
}