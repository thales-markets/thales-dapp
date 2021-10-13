import enTranslation from './en.json';
import ruTranslation from './ru.json';
import cnTranslation from './cn.json';

export const resources = {
    en: { translation: enTranslation },
    ru: { translation: ruTranslation },
    cn: { translation: cnTranslation },
};

export enum SupportedLanguages {
    ENGLISH = 'en',
    RUSSIAN = 'ru',
    CHINESE = 'cn',
}

export const LanguageNameMap = {
    [SupportedLanguages.ENGLISH]: 'English',
    [SupportedLanguages.RUSSIAN]: 'Pусский',
    [SupportedLanguages.CHINESE]: '中文',
};

export const DEFAULT_LANGUAGE = SupportedLanguages.ENGLISH;
