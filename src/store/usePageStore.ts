import { create } from 'zustand';
import { PageBase, PageStore, PageUpdate } from '../types/page';
import axiosInstance from '../api/axiosInstance';


const usePageStore = create<PageStore>()(
    (set, get) => ({
      pages: [],
      page: undefined,
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
      getPage: async (id: number): Promise<PageBase |undefined> => {
        set({ pageLoading: true });
        try {
          const response = await axiosInstance.get(`page/${id}/`);
          
          if (response.status === 200) {
            return response.data;
          }

        } catch (error) {
          console.error("Error  on get page:", error);
          set({ pageError: true, pageLoading: false });
        }
      },
      updatePage: async (id: number, data: PageUpdate): Promise<boolean> => {
        set({ pageLoading: true });
        try {
          const response = await axiosInstance.put(`page/${id}/`, data);
          
          if (response.status === 200) {
            set({ pageLoading: false });
          } else {
            set({ pageError: true, pageLoading: false });
          }

        } catch (error) {
          console.error("Error  on update page:", error);
          set({ pageError: true, pageLoading: false });
        }

        return get().pageError;
      },
      deletePage: async (id: number): Promise<boolean> => {
        set({ pageLoading: true });
        try {
            const res = await axiosInstance.delete(`page/${id}/`);
            if (res.status === 200) {
                set({ pageError: false, pageLoading: false });
                return true;
            } else {
                set({ pageError: true, pageLoading: false });
                return false;
            }
        } catch (error) {
            console.error("Error deleting page:", error);
            set({ pageError: true, pageLoading: false });
            return false;
        }
    }
    }),
  
);

export default usePageStore;
