import { WebsiteBase, WebsiteStore } from "../types/website";
import axiosInstance from '../api/axiosInstance';
import { create } from 'zustand';


const useWebsite = create<WebsiteStore>()(

    (set, get) => ({
        websites: [],
        website: undefined,
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
        },
        getWebsite: async (id: number): Promise<WebsiteBase | undefined> => {
            set({ websiteLoading: true });
            try {
                const response = await axiosInstance.get(`website/${id}`);
                if (response.status === 200) {
                    return response.data;
                }
            } catch (error) {
                console.error("Error  on get websites:", error);
                set({ websiteError: true, websiteLoading: false });
            }

        },
        updateWebsite: async (id: number, website: FormData): Promise<boolean> => {
            set({ websiteLoading: true });
            try {
                const name = website.get('name') as string;
                const domain_url = website.get('domain_url') as string;
                
                const fileFormData = new FormData();

                if (website.get('favicon_image')) {
                    const favicon_image = website.get('favicon_image');
                    if (favicon_image && favicon_image instanceof Blob) {
                      fileFormData.append('favicon_image', favicon_image);
                    } else {
                        website.delete('favicon_image');
                    }
                } 

                const res = await axiosInstance.put(`website/${id}/?name=${encodeURIComponent(name)}&domain_url=${encodeURIComponent(domain_url)}`, 
                fileFormData,  {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (res.status === 200) {
                    set({ websiteLoading: false });
                    set({ websiteError: false, websiteLoading: false });
                    return true;
                } else {
                    set({ websiteError: true, websiteLoading: false });
                    return false;
                }
            } catch (error) {
                console.error("Error updating website:", error);
                set({ websiteError: true, websiteLoading: false });
                return false;
            }

        },
        deleteWebsite: async (id: number): Promise<boolean> => {
            set({ websiteLoading: true });
            try {
                const res = await axiosInstance.delete(`website/${id}/`);
                if (res.status === 200) {
                    set({ websiteError: false, websiteLoading: false });
                    return true;
                } else {
                    set({ websiteError: true, websiteLoading: false });
                    return false;
                }
            } catch (error) {
                console.error("Error deleting website:", error);
                set({ websiteError: true, websiteLoading: false });
                return false;
            }
        }
    })
)

export default useWebsite;