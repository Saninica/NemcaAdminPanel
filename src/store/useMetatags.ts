import axiosInstance from "../api/axiosInstance";
import { MetaTagsStore, MetaTagsBase } from "../types/metatags";
import { create } from 'zustand';


const useMetatagsStore = create<MetaTagsStore>()(
    (set, get) => ({
        metaTags: [],
        metaTagsError: false,
        metaTag: undefined,
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
        },
        getMetatag: async (id: number): Promise<MetaTagsBase | undefined> => {
            set({ metaTagsLoading: true });
            try {
                const response = await axiosInstance.get(`metatag/${id}`);
                if (response.status === 200) {
                    return response.data;
                }
            } catch (error) {
                console.error("Error  on get metatag:", error);
                set({ metaTagsError: true, metaTagsLoading: false });
            }
        },
        updateMetatag: async (id: number, metatags: MetaTagsBase) => {
            set({ metaTagsLoading: true });
            
            try {
                const res = await axiosInstance.put(`metatag/${id}`, metatags);
                if (res.status === 200) {
                    set({ metaTagsLoading: false });
                } 
                return true;
            } catch (error) { 
                console.error("Error updating metatags:", error);
                set({ metaTagsError: true, metaTagsLoading: false });
                return false;
            }

        },
        deleteMetatag: async (id: number): Promise<boolean> => {
            set({ metaTagsLoading: true });
            try {
                const res = await axiosInstance.delete(`metatag/${id}/`);
                if (res.status === 200) {
                    set({ metaTagsLoading: false });
                    return true;
                } else {
                    set({ metaTagsLoading: false });
                    return false;
                }
            } catch (error) {
                console.error("Error deleting metatags:", error);
                set({ metaTagsError: true, metaTagsLoading: false });
                return false;
            }
        }

    })
)

export default useMetatagsStore;