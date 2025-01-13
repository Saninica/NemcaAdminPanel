import { WebsiteBase, WebsiteStore } from "../types/website";
import axiosInstance from '../api/axiosInstance';
import { create } from 'zustand';


const useWebsite = create<WebsiteStore>()(

    (set, get) => ({
        websites: [],
        websiteError: false,
        websiteLoading: false,
        createWebsite: async (website: WebsiteBase) => {
            set({ websiteLoading: true });
            const res = await axiosInstance.post('website/', website);
            if (res.status === 200) {
                set({ websiteLoading: false });
                get().getWebsites(15, 0);
            } else {
                set({ websiteError: true, websiteLoading: false });
            }
        },
        getWebsites: async (limit: number = 15, skip: number = 0) => {
            set({ websiteLoading: true });
            try {
                const response = await axiosInstance.get(`website/?limit=${limit}&skip=${skip}`);
                if (response.status === 200) {
                    set({ websites: response.data });
                }
            } catch (error) {
                console.error("Error  on get websites:", error);
                set({ websiteError: true, websiteLoading: false });
            }
        }
    })
)

export default useWebsite;