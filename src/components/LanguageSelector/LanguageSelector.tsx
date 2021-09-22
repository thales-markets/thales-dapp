import React from 'react';
import { Button } from 'theme/common';
import { withTranslation } from 'react-i18next';
import i18n from 'i18n';
import ReactCountryFlag from 'react-country-flag';

enum SupportedLanguages {
    ENGLISH = 'en',
    RUSSIAN = 'ru',
    CHINESSE = 'cn',
}

export const LanguageSelector: React.FC = () => {
    return (
        <>
            {Object.values(SupportedLanguages).map((language: string) => (
                <Button className="primary" key={language} onClick={() => i18n.changeLanguage(language)}>
                    <ReactCountryFlag
                        key={language}
                        countryCode={language === SupportedLanguages.ENGLISH ? 'gb' : language}
                        svg
                    />{' '}
                    {language}
                </Button>
            ))}
        </>
    );
};

export default withTranslation()(LanguageSelector);
