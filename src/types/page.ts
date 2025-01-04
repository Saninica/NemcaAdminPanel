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
    pages: PageBase[] | [];
    pageLoading: boolean;
    pageError: boolean;
}

export interface PageContentSchema {
    id: number;
    page_id: number;
    language_code: string;
    title: string;
    body: string;
}


export interface PageContentCreate {
    page_id: number;
    language_code: string;
    title: string;
    body: string;
}

export interface PageContentStore {
    pageContents: PageContentSchema[] | [];
    pageContentError: boolean;
    pageContentLoading: boolean;
    createPageContent: (content: PageContentSchema) => Promise<void>;
    getPageContents: (limit: number, skip: number) => Promise<void>;
}