import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './en.json';
import ruTranslation from './ru.json';
import cnTranslation from './cn.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            ru: { translation: ruTranslation },
            cn: { translation: cnTranslation },
        },
        fallbackLng: 'ru',
        react: {
            useSuspense: true,
        },
    });

export default i18n;
