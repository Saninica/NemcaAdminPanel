export interface PageBase {
    id: number;
    name: string;
    website_id?: number;
}

export interface PageCreate {
    name: string;
}

export interface PageUpdate {
    name: string;
    website_id?: number;
}

export interface PageRead extends PageBase {
    id: number;
}

export interface PageStore {
    createPage: (page: PageBase) => Promise<void>;
    getPages: (limit: number, skip: number) => Promise<void>;
    getPage: (id: number) => Promise<PageBase | undefined>;
    updatePage: (id: number, data: PageUpdate) => Promise<boolean>;
    deletePage: (id: number) => Promise<boolean>;
    pages: PageBase[] | [];
    page: PageBase | undefined;
    pageLoading: boolean;
    pageError: boolean;
}

export interface PageContentSchema {
    id: number;
    page_id: number;
    website_id: number;
    language_id: number;
    title: string;
    body: string;
    price?: number;
    cover_image: string;
}

export interface PageContentFormData extends Omit<PageContentSchema, 'cover_image'> {
    cover_image: FileList;
}

export interface PageContentUpdateFormData {
    cover_image: FileList;
    page_id: number;
    website_id: number;
    language_code: string;
    title: string;
    body: string;
    price?: number;
}

export interface PageContentRead {
    id: number;
    page: string;
    website: string;
    language_code: string;
    title: string;
    body: string;
    price?: number;
    cover_image: string;
}

export interface PageContentCreate {
    page_id: number;
    language_id: number;
    title: string;
    body: string;
    price?: number;
}



export interface PageContentStore {
    pageContents: PageContentRead[] | [];
    total: number;    
    limit: number; 
    page: number; 
    skip: number;
    pageContent: PageContentRead | undefined;
    setPage: (page: number) => void;
    pageContentError: boolean;
    pageContentLoading: boolean;
    getPageContent: (id: number) => Promise<PageContentRead | undefined>;
    updatePageContent: (id: number, content: FormData) => Promise<boolean>;
    createPageContent: (content: FormData) => Promise<void>;
    getPageContents: (page?: number) => Promise<void>;
    deleteContent: (id: number) => Promise<boolean>;
}