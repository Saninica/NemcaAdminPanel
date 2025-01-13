export interface AnnouncementBase {
    title: string;
    content: string;
    cover_image: string;
}

export interface AnnouncementStore {
    createAnnouncement: (announcement: AnnouncementBase) => Promise<void>;
    getAnnouncements: (limit: number, skip: number) => Promise<void>;
    announcements: AnnouncementBase[] | [];
    announcementsLoading: boolean;
    announcementsError: boolean;
}