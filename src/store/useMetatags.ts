import axiosInstance from "../api/axiosInstance";
import { MetaTagsStore, MetaTagsBase } from "../types/metatags";
import { create } from 'zustand';


const useMetatagsStore = create<MetaTagsStore>()(
    (set, get) => ({
        metaTags: [],
        metaTagsError: false,
        metaTagsLoading: false,
        createMetaTags: async (metatags: MetaTagsBase) => {
            set({ metaTagsLoading: true });
            const res = await axiosInstance.post('metatag/', metatags);
            if (res.status === 200) {
                set({ metaTagsLoading: false });
                get().getMetaTags(15, 0);
            } else {
                set({ metaTagsError: true, metaTagsLoading: false });
            }
        },
        getMetaTags: async (limit: number = 15, skip: number = 0) => {
            set({ metaTagsLoading: true });
            try {
                const response = await axiosInstance.get(`metatag/?limit=${limit}&skip=${skip}`);
                if (response.status === 200) {
                    set({ metaTags: response.data });
                }
            } catch (error) {
                console.error("Error  on get metatags:", error);
                set({ metaTagsError: true, metaTagsLoading: false });
            }
        }
    })
)

export default useMetatagsStore;