export interface LanguageBase {
    code: string; // e.g., 'en', 'tr'
    name: string; // e.g., 'English', 'Turkish'
    website_id: number; // e.g., 1, 2
}
  
  
export interface LangStore  {
  createLang: (lang: LanguageBase) => Promise<void>;
  getLangs: (limit: number, skip: number) => Promise<void>;
  langs: LanguageBase[] | [];
  langLoading: boolean;
  langError: boolean;
}


export interface LangSchema {
  code: string;
  name: string;
  website_id: number;
}