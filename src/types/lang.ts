export interface LanguageBase {
    code: string; // e.g., 'en', 'tr'
    name: string; // e.g., 'English', 'Turkish'
}
  
  
export interface LangStore  {
  createLang: (lang: LanguageBase) => Promise<void>;
  getLangs: (limit: number, skip: number) => Promise<void>;
  langs: LanguageBase[] | [];
  langLoading: boolean;
  langError: boolean;
}
