export interface MetaTagsBase {
    page_id: number;
    website_id: number;
    language_code: string;
    title: string;
    description: string;
    keywords: string;
}

export interface MetaTagsStore {
    createMetaTags: (metaTags: MetaTagsBase) => Promise<void>;
    getMetaTags: (limit: number, skip: number) => Promise<void>;
    metaTags: MetaTagsBase[] | [];
    metaTagsLoading: boolean;
    metaTagsError: boolean;
}