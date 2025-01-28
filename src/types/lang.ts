export interface LanguageBase {
    id: number; // e.g., 1, 2
    code: string; // e.g., 'en', 'tr'
    name: string; // e.g., 'English', 'Turkish'
    website_id?: number; // e.g., 1, 2
}

export interface LanguageCreate {
    code: string; // e.g., 'en', 'tr'
    name: string; // e.g., 'English', 'Turkish'
    website_id?: number; // e.g., 1, 2
}
  
  
export interface LangStore  {
  createLang: (lang: LanguageCreate) => Promise<void>;
  getLangs: (limit: number, skip: number) => Promise<void>;
  getLang: (langcode: string, website_id: number) => Promise<LanguageBase | undefined>;
  updateLang: (lang: LanguageBase, lang_code: string, website_id: number) => Promise<boolean>;
  langs: LanguageBase[] | [];
  lang: LanguageBase | undefined;
  langLoading: boolean;
  langError: boolean;
}


export interface LangSchema {
  code: string;
  name: string;
  website_id?: number;
}