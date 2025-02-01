import { create } from 'zustand';
import { LanguageBase, LangStore, LanguageCreate } from '../types/lang';
import axiosInstance from '../api/axiosInstance';


const useLangStore = create<LangStore>()(
    (set, get) => ({
      langs: [],
      lang: undefined,
      langError: false,
      langLoading: false,
      total: 0,
      limit: 10,
      skip: 0,
      page: 1,

      createLang: async (lang: LanguageCreate) => {
        set({  langLoading: true });

        const res = await axiosInstance.post('language/', lang);
        if (res.status === 200) {
          set({ langLoading: false });
          get().getLangs(get().page);
        } else {
          set({ langError: true, langLoading: false });
        }
      },

      setPage: (newPage: number) => {
        set({ page: newPage });
      },

      getLangs: async (page?: number) => {
        set({ langLoading: true });
        const currentPage = page ?? get().page;
        const limit = get().limit;
        const skip = (currentPage - 1) * limit;
        try {
          const response = await axiosInstance.get(`language/?limit=${limit}&skip=${skip}`);
          
          if (response.status === 200) {
            set({ langs: response.data.items });
            set({ langLoading: false , total: response.data.total, 
              limit: response.data.limit, skip: response.data.skip});
          }

        } catch (error) {
          console.error("Error on get langs:", error);
          set({ langError: true, langLoading: false });
        }
      },
      getLang: async (langcode: string, website_id: number): Promise<LanguageBase | undefined> => {
        set({ langLoading: true });
        try {
          const response = await axiosInstance.get(`language/?lang=${langcode}&website=${website_id}`);
          
          if (response.status === 200) {
            set({ langLoading: false });
            return response.data[0];
          } else {
            set({ langError: true, langLoading: false });
          }

        } catch (error) {
          console.error("Error on get langs:", error);
          set({ langError: true, langLoading: false });
        }
      },
      updateLang: async (lang: LanguageBase, lang_code: string, website_id: number): Promise<boolean> => {
        set({ langLoading: true });
        try {
          const response = await axiosInstance.put(`language/?lang=${lang_code}&website=${website_id}`, lang);
          if (response.status === 200) {
            set({ langLoading: false });
          } else {
            set({ langError: true, langLoading: false });
          }
        } catch (error) {
          console.error("Error on update lang:", error);
          set({ langError: true, langLoading: false });
        }

        return get().langError;
      }
    }),
  
);

export default useLangStore;
