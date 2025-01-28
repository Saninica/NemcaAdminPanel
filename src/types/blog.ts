export interface BlogBase {
    body: string;
    website_id?: number;
    page_id?: number;
    language_code?: string;
}

export interface Blog extends BlogBase {
    id: number;
}


export interface BlogStore {
    createBlog: (blog: BlogBase) => Promise<void>;
    getBlogs: (limit: number, skip: number) => Promise<void>;
    deleteBlog: (id: number) => Promise<boolean>;
    blogs: Blog[] | [];
    blogsLoading: boolean;
    blogsError: boolean;
}