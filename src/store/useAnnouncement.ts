import { AnnouncementBase, AnnouncementStore } from "../types/announcement";
import axiosInstance from '../api/axiosInstance';
import { create } from 'zustand';


const useAnnouncement = create<AnnouncementStore>()(
    (set, get) => ({
        announcements: [],
        announcementsError: false,
        announcementsLoading: false,
        createAnnouncement: async (announcement: AnnouncementBase) => {
            set({ announcementsLoading: true });
            const res = await axiosInstance.post('announcement/', announcement);
            if (res.status === 200) {
                set({ announcementsLoading: false });
                get().getAnnouncements(15, 0);
            } else {
                set({ announcementsError: true, announcementsLoading: false });
            }
        },
        getAnnouncements: async (limit: number = 15, skip: number = 0) => {
            set({ announcementsLoading: true });
            try {
                const response = await axiosInstance.get(`announcement/?limit=${limit}&skip=${skip}`);
                if (response.status === 200) {
                    set({ announcements: response.data });
                }
            } catch (error) {
                console.error("Error  on get announcements:", error);
                set({ announcementsError: true, announcementsLoading: false });
            }
        }
    })
);

export default useAnnouncement;