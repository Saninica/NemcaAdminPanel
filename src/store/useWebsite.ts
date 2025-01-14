import { WebsiteStore } from "../types/website";
import axiosInstance from '../api/axiosInstance';
import { create } from 'zustand';


const useWebsite = create<WebsiteStore>()(

    (set, get) => ({
        websites: [],
        websiteError: false,
        websiteLoading: false,
        createWebsite: async (formData: FormData) => {
            set({ websiteLoading: true });
            try {
                const name = formData.get('name') as string;
                const domain_url = formData.get('domain_url') as string;
                
                const fileFormData = new FormData();
                fileFormData.append('favicon_image', formData.get('favicon_image') as File);

                const res = await axiosInstance.post(`website/?name=${encodeURIComponent(name)}&domain_url=${encodeURIComponent(domain_url)}`, 
                fileFormData,  {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (res.status === 200 || res.status === 201) {
                    set({ websiteLoading: false });
                    get().getWebsites(15, 0);
                    set({ websiteError: false, websiteLoading: false });
                } else {
                    set({ websiteError: true, websiteLoading: false });
                }
            } catch (error) {
                console.error("Error creating website:", error);
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