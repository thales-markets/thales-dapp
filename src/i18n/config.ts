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

export const DEFAULT_LANGUAGE = SupportedLanguages.ENGLISH;
