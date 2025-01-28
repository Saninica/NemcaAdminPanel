export interface MetaTagsBase {
    id?: number;
    page_id: number;
    website_id?: number;
    language_code: string;
    title: string;
    description: string;
    keywords: string;
}

export interface MetaTagsStore {
    createMetaTags: (metaTags: MetaTagsBase) => Promise<void>;
    getMetaTags: (limit: number, skip: number) => Promise<void>;
    getMetatag: (id: number) => Promise<MetaTagsBase | undefined>;
    updateMetatag: (id: number, metaTags: MetaTagsBase) => Promise<boolean>;
    deleteMetatag: (id: number) => Promise<boolean>;
    metaTag: MetaTagsBase | undefined;
    metaTags: MetaTagsBase[] | [];
    metaTagsLoading: boolean;
    metaTagsError: boolean;
}