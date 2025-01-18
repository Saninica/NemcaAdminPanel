export interface AnnouncementBase {
    id: number;
    title: string;
    body: string;
    cover_image: string;
    start_date: Date;
    end_date: Date;
    page_id: number;
    website_id: number;
    language_code: string;
}

export interface AnnouncementUpdate extends Omit<AnnouncementBase, 'cover_image' | 'id'> {
    id?: number;
    cover_image: FileList;
}

export interface AnnouncementFormData extends Omit<AnnouncementBase, 'cover_image' | 'id'> {
    id?: number;
    cover_image: FileList;
}

export interface AnnouncementStore {
    createAnnouncement: (announcement: FormData) => Promise<void>;
    getAnnouncements: (limit: number, skip: number) => Promise<void>;
    announcements: AnnouncementBase[] | [];
    announcement: AnnouncementBase | undefined;
    getAnnouncement: (id: number) => Promise<AnnouncementBase | undefined>;
    updateAnnouncement: (id: number, announcement: FormData) => Promise<boolean>;
    announcementsLoading: boolean;
    announcementsError: boolean;
}