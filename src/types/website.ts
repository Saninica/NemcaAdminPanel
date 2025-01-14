export interface WebsiteBase {
    name: string
    domain_url: string
    favicon_image: string;
}


export interface WebsiteStore {
    createWebsite: (formData: FormData) => Promise<void>;
    getWebsites: (limit: number, skip: number) => Promise<void>;
    websites: WebsiteBase[] | [];
    websiteLoading: boolean;
    websiteError: boolean;
}


export interface WebsiteFormData extends Omit<WebsiteBase, 'favicon_image'> {
    favicon_image: FileList;
}