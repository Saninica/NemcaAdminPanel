import { create } from 'zustand';
import { PageContentFormData, PageContentStore } from '../types/page';
import axiosInstance from '../api/axiosInstance';


const useContentStore = create<PageContentStore>()(
    (set, get) => ({
      pageContents: [],
      pageContentError: false,
      pageContentLoading: false,

      createPageContent: async (content: FormData) => {
        set({  pageContentLoading: true });
        
        const fileFormData = new FormData();
        fileFormData.append('cover_image', content.get('cover_image') as File);

        //const url = `content/?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&page_id=${page_id}&language_code=${language_code}&website_id=${website_id}`;
        
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
      }
    }),
  
);

export default useContentStore;
