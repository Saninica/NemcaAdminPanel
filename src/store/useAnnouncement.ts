import { AnnouncementBase, AnnouncementStore } from "../types/announcement";
import axiosInstance from '../api/axiosInstance';
import { create } from 'zustand';


const useAnnouncement = create<AnnouncementStore>()(
    (set) => ({
        announcements: [],
        announcementsError: false,
        announcementsLoading: false,
        announcement: undefined,
        createAnnouncement: async (announcement: FormData) => {
            set({ announcementsLoading: true });
            try {
                const title = announcement.get('title') as string;
                const body = announcement.get('body') as string;

                const page_id = announcement.get('page_id') as string;
                const website_id = announcement.get('website_id') as string;
                const language_code = announcement.get('language_code') as string;

                const start_date = announcement.get('start_date') as string;
                const end_date = announcement.get('end_date') as string;

                if (announcement.get('cover_image')) {
                    const coverImage = announcement.get('cover_image');
                    if (coverImage && coverImage instanceof Blob) {
                        console.log();
                    } else {
                        announcement.delete('cover_image');
                    }
                }

                const url =  `announcement/?page_id=${encodeURIComponent(page_id)}&cover_image=${encodeURIComponent("t")}
                &website_id=${encodeURIComponent(website_id)}&language_code=${encodeURIComponent(language_code)}
                &title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;

                const res = await axiosInstance.post(url, announcement, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.status === 200) {
                    set({ announcementsLoading: false });
                } else {
                    set({ announcementsError: true, announcementsLoading: false });
                }
            } catch (error) {
                console.error("Error creating announcements:", error);
                set({ announcementsError: true, announcementsLoading: false });
            }

            
        },
        getAnnouncements: async (limit: number = 15, skip: number = 0) => {
            set({ announcementsLoading: true });
            try {
                const response = await axiosInstance.get(`announcement/?limit=${limit}&skip=${skip}`);
                if (response.status === 200) {
                    set({ announcementsLoading: false, announcements: response.data });
                }
            } catch (error) {
                console.error("Error  on get announcements:", error);
                set({ announcementsError: true, announcementsLoading: false });
            }
        },
        getAnnouncement: async (id: number): Promise<AnnouncementBase | undefined> => {
            set({ announcementsLoading: true });
            try {
                const response = await axiosInstance.get(`announcement/${id}/`);
                if (response.status === 200) {
                    set({ announcementsLoading: false });
                    return response.data;
                }
            } catch (error) {
                console.error("Error  on get announcement:", error);
                set({ announcementsError: true, announcementsLoading: false });
            }
        },
        updateAnnouncement: async (id: number, announcement: FormData) => {
            set({ announcementsLoading: true });

            try {
                const res = await axiosInstance.put(`announcement/${id}/`, announcement);

                if (res.status === 200) {
                    set({ announcementsLoading: false });
                    return true;
                } else {
                    set({ announcementsError: true, announcementsLoading: false });
                    return false;
                }
            } catch (error) {
                console.error("Error updating announcements:", error);
                set({ announcementsError: true, announcementsLoading: false });
                return false;
            }
        },
        deleteAnnouncement: async (id: number) => {
            set({ announcementsLoading: true });

            try {
                const res = await axiosInstance.delete(`announcement/${id}/`);

                if (res.status === 200) {
                    set({ announcementsLoading: false });
                    return true;
                } else {
                    set({ announcementsError: true, announcementsLoading: false });
                    return false;
                }
            } catch (error) {
                console.error("Error deleting announcements:", error);
                set({ announcementsError: true, announcementsLoading: false });
                return false;
            }
        }
    })
);

export default useAnnouncement;