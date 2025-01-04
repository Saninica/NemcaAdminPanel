import { create } from 'zustand';
import { LanguageBase, LangStore } from '../types/lang';
import axiosInstance from '../api/axiosInstance';


const useLangStore = create<LangStore>()(
    (set, get) => ({
      langs: [],
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
          }

        } catch (error) {
          console.error("Error on get langs:", error);
          set({ langError: true, langLoading: false });
        }
      }
    }),
  
);

export default useLangStore;
