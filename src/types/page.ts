export interface PageBase {
    id: number;
    name: string;
}

export interface PageCreate {
    name: string;
}

export interface PageRead extends PageBase {
    id: number;
}

export interface PageStore {
    createPage: (lang: PageBase) => Promise<void>;
    getPages: (limit: number, skip: number) => Promise<void>;
    getPage: (id: number) => Promise<PageRead | undefined>;
    pages: PageBase[] | [];
    pageLoading: boolean;
    pageError: boolean;
}

export interface PageContentSchema {
    id: number;
    page_id: number;
    website_id: number;
    language_code: string;
    title: string;
    body: string;
    cover_image: string;
}

export interface PageContentFormData extends Omit<PageContentSchema, 'cover_image'> {
    cover_image: FileList;
}


export interface PageContentRead {
    id: number;
    page: string;
    website: string;
    language_code: string;
    title: string;
    body: string;
    cover_image: string;
}

export interface PageContentCreate {
    page_id: number;
    language_code: string;
    title: string;
    body: string;
}

export interface PageContentStore {
    pageContents: PageContentRead[] | [];
    pageContentError: boolean;
    pageContentLoading: boolean;
    createPageContent: (content: FormData) => Promise<void>;
    getPageContents: (limit: number, skip: number) => Promise<void>;
}