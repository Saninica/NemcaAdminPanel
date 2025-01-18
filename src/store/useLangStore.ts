import { create } from 'zustand';
import { LanguageBase, LangStore } from '../types/lang';
import axiosInstance from '../api/axiosInstance';


const useLangStore = create<LangStore>()(
    (set, get) => ({
      langs: [],
      lang: undefined,
      langError: false,
      langLoading: false,

      createLang: async (lang: LanguageBase) => {
        set({  langLoading: true });

        const res = await axiosInstance.post('language/', lang);
        if (res.status === 200) {
          set({ langLoading: false });
          get().getLangs(15, 0);
        } else {
          set({ langError: true, langLoading: false });
        }
      },

      getLangs: async (limit: number = 15, skip: number = 0) => {
        set({ langLoading: true });
        try {
          const response = await axiosInstance.get(`language/?limit=${limit}&skip=${skip}`);
          
          if (response.status === 200) {
            set({ langs: response.data });
            set({ langLoading: false });
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
