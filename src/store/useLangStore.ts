import { create } from 'zustand';
import { LanguageBase, LanguageCreate } from '../types/lang';
import { createExtendedStore, BaseStoreType } from './createBaseStore';
import axiosInstance from '../api/axiosInstance';
import { ApiError } from '../types/api';

// Extended store interface for language-specific actions
interface LangStoreExtended {
  // Language-specific state
  currentLang: LanguageBase | undefined;
  
  // Language-specific actions
  getLang: (langcode: string, website_id: number) => Promise<LanguageBase | undefined>;
  updateLang: (lang: LanguageBase, lang_code: string, website_id: number) => Promise<boolean>;
  
  // Legacy method names for compatibility
  getLangs: (page?: number) => Promise<void>;
  createLang: (lang: LanguageCreate) => Promise<LanguageBase | null>;
}

// Complete store type
export type LangStore = BaseStoreType<LanguageBase, LanguageCreate, Partial<LanguageBase>> & LangStoreExtended;

// Extended actions implementation
const extendedActions = (set: any, get: any) => ({
  // Language-specific state
  currentLang: undefined,

  // Legacy compatibility methods
  getLangs: async (page?: number) => {
    await get().getAll(page);
  },

  createLang: async (lang: LanguageCreate): Promise<LanguageBase | null> => {
    return await get().create(lang);
  },

  // Language-specific methods
  getLang: async (langcode: string, website_id: number): Promise<LanguageBase | undefined> => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `language/?lang=${langcode}&website=${website_id}`
      );
      
      if (response.status === 200 && response.data?.length > 0) {
        const langData = response.data[0];
        set({ currentLang: langData });
        setLoading(false);
        return langData;
      } else {
        throw new Error('Language not found');
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to fetch language');
      return undefined;
    }
  },

  updateLang: async (
    lang: LanguageBase, 
    lang_code: string, 
    website_id: number
  ): Promise<boolean> => {
    const { setLoading, setError, refresh } = get();
    
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.put(
        `language/?lang=${lang_code}&website=${website_id}`, 
        lang
      );
      
      if (response.status === 200) {
        setLoading(false);
        // Update current language if it matches
        const currentLang = get().currentLang;
        if (currentLang && currentLang.code === lang_code) {
          set({ currentLang: { ...currentLang, ...lang } });
        }
        // Refresh the list
        await refresh();
        return true;
      } else {
        throw new Error('Failed to update language');
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to update language');
      return false;
    }
  },
});

// Create the store using the base store factory
const useLangStore = create<LangStore>()(
  createExtendedStore<LanguageBase, LanguageCreate, Partial<LanguageBase>, LangStoreExtended>(
    { endpoint: 'language/', initialLimit: 10 },
    extendedActions
  )
);

export default useLangStore;
