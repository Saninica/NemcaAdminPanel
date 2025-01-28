import { BlogStore, BlogBase } from "../types/blog";
import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';


const useBlogStore = create<BlogStore>()(
    (set, get) => ({
        blogs: [],
        blogsError: false,
        blogsLoading: false,

        createBlog: async (blog: BlogBase) => {
            set({ blogsLoading: true });
            console.log(blog);
            const res = await axiosInstance.post('blog/', blog);

            if (res.status === 200) {
                set({ blogsLoading: false });
                get().getBlogs(15, 0);
            } else {
                set({ blogsError: true, blogsLoading: false });
            }
        },

        getBlogs: async (limit: number = 15, skip: number = 0) => {
            set({ blogsLoading: true });
            try {
                const response = await axiosInstance.get(`blog/?limit=${limit}&skip=${skip}`);
                
                if (response.status === 200) {
                    set({ blogs: response.data });
                }

            } catch (error) {
                console.error("Error  on get blogs:", error);
                set({ blogsError: true, blogsLoading: false });
            }
        },
        deleteBlog: async (id: number) => {
            set({ blogsLoading: true });

            try {
                const res = await axiosInstance.delete(`blog/${id}/`);

                if (res.status === 200) {
                    set({ blogsLoading: false });
                    return true;
                } else {
                    set({ blogsError: true, blogsLoading: false });
                    return false;
                }
            } catch (error) {
                console.error("Error deleting blog:", error);
                set({ blogsError: true, blogsLoading: false });
                return false;
            }
        }
    }),
  
);

export default useBlogStore;