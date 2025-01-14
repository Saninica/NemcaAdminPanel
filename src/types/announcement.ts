export interface AnnouncementBase {
    title: string;
    body: string;
    cover_image: string;
    created_at: string;
    start_date: Date;
    end_date: Date;
    page_id: number;
    website_id: number;
    language_code: string;
}

export interface AnnouncementStore {
    createAnnouncement: (announcement: AnnouncementBase) => Promise<void>;
    getAnnouncements: (limit: number, skip: number) => Promise<void>;
    announcements: AnnouncementBase[] | [];
    announcementsLoading: boolean;
    announcementsError: boolean;
}