import { create } from 'zustand';
import { PageContentRead, PageContentStore } from '../types/page';
import axiosInstance from '../api/axiosInstance';


const useContentStore = create<PageContentStore>()(
    (set, get) => ({
      pageContents: [],
      pageContentError: false,
      pageContentLoading: false,
      pageContent: undefined,

      createPageContent: async (content: FormData) => {
        set({  pageContentLoading: true });
        
        const fileFormData = new FormData();

        if (content.get('cover_image')) {
          const coverImage = content.get('cover_image');
          if (coverImage && coverImage instanceof Blob) {
            fileFormData.append('cover_image', coverImage);
          } else {
            content.delete('cover_image');
          }
        } 


        
        const res = await axiosInstance.post('content/', content, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.status === 200) {
          set({ pageContentLoading: false });
          get().getPageContents(15, 0);
        } else {
          set({ pageContentError: true, pageContentLoading: false });
        }
      },

      getPageContents: async (limit: number = 15, skip: number = 0) => {
        set({ pageContentLoading: true });
        try {
          const response = await axiosInstance.get(`content/?limit=${limit}&skip=${skip}`);
          
          if (response.status === 200) {
            set({ pageContents: response.data });
          }

        } catch (error) {
          console.error("Error  on get contents:", error);
          set({ pageContentError: true, pageContentLoading: false });
        }
      },
      getPageContent: async(id: number): Promise<PageContentRead | undefined> => {
        set({ pageContentLoading: true });
        try {
          const response = await axiosInstance.get(`content/${id}/`);
          if (response.status === 200) {
            set({ pageContentLoading: false });
            return response.data;
          }
        } catch (error) {
          console.error("Error  on get contents:", error);
          set({ pageContentError: true, pageContentLoading: false });
        }
      },
      updatePageContent: async (id: number, content: FormData): Promise<boolean> => {
        set({ pageContentLoading: true });
        try {
          const title = content.get('title') as string;
          const body = content.get('body') as string;
          const website_id = content.get('website_id') as string;
          const language_code = content.get('language_code') as string;
          
          const fileFormData = new FormData();

          if (content.get('cover_image')) {
            const coverImage = content.get('cover_image');
            if (coverImage && coverImage instanceof Blob) {
              fileFormData.append('cover_image', coverImage);
            } else {
              content.delete('cover_image');
            }
          } 

          const url =  `content/${id}/?website_id=${encodeURIComponent(website_id)}&language_code=${encodeURIComponent(language_code)}
          &title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;


          const res = await axiosInstance.put(url, content, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (res.status === 200) {
            set({ pageContentLoading: false });
            set({ pageContentError: false, pageContentLoading: false });
            return true;
          } else {
            return false;
          }
      } catch (error) {
        console.error("Error  on update contents:", error);
        set({ pageContentError: true, pageContentLoading: false });
        return false;
      }
    },
    deleteContent: async (id: number): Promise<boolean> => {
      set({ pageContentLoading: true });
      try {
        const res = await axiosInstance.delete(`content/${id}/`);
        if (res.status === 200) {
          set({ pageContentLoading: false });
          return true;
        } else {
          set({ pageContentLoading: false });
          return false;
        }
      } catch (error) {
        console.error("Error  on delete contents:", error);
        set({ pageContentError: true, pageContentLoading: false });
        return false;
      }
    }
  })
  
);

export default useContentStore;
