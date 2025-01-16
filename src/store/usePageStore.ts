import { create } from 'zustand';
import { PageBase, PageStore } from '../types/page';
import axiosInstance from '../api/axiosInstance';


const usePageStore = create<PageStore>()(
    (set, get) => ({
      pages: [],
      pageError: false,
      pageLoading: false,

      createPage: async (lang: PageBase) => {
        set({  pageLoading: true });

        const res = await axiosInstance.post('page/', lang);
        if (res.status === 200) {
          set({ pageLoading: false });
          get().getPages(15, 0);
        } else {
          set({ pageError: true, pageLoading: false });
        }
      },

      getPages: async (limit: number = 15, skip: number = 0) => {
        set({ pageLoading: true });
        try {
          const response = await axiosInstance.get(`page/?limit=${limit}&skip=${skip}`);
          
          if (response.status === 200) {
            set({ pages: response.data });
          }

        } catch (error) {
          console.error("Error  on get pages:", error);
          set({ pageError: true, pageLoading: false });
        }
      },
      getPage: async (id: number): Promise<PageBase | undefined> => {
        await get().getPages(15, 0);
        return get().pages.find((page) => page.id === id);
      }
    }),
  
);

export default usePageStore;
