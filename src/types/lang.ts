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
  getLangs: (page?: number) => Promise<void>;
  getLang: (langcode: string, website_id: number) => Promise<LanguageBase | undefined>;
  updateLang: (lang: LanguageBase, lang_code: string, website_id: number) => Promise<boolean>;
  langs: LanguageBase[] | [];
  lang: LanguageBase | undefined;
  langLoading: boolean;
  langError: boolean;
  total: number;    
  limit: number; 
  page: number; 
  skip: number;
  setPage: (page: number) => void;
}


export interface LangSchema {
  code: string;
  name: string;
  website_id?: number;
}