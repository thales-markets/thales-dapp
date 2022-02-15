import i18n from 'i18n';
import { LanguageNameMap, SupportedLanguages } from 'i18n/config';
import React from 'react';
import { withTranslation } from 'react-i18next';
import styled from 'styled-components';

export const LanguageSelectorRoyale: React.FC = () => {
    return (
        <>
            {Object.values(SupportedLanguages).map((language: string, key: number) => (
                <LanguageSelect
                    key={key}
                    onClick={() => {
                        i18n.changeLanguage(language);
                    }}
                >
                    <LanguageIcon className={`icon icon--${language}`} />
                    <LanguageName key={language}>{(LanguageNameMap as any)[language]}</LanguageName>
                </LanguageSelect>
            ))}
        </>
    );
};

const LanguageName = styled.div`
    font-weight: normal;
    font-family: Sansation !important;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.25px;
    color: var(--color);
    margin-left: 10px;
    display: inline;
`;

const LanguageIcon = styled.i`
    line-height: 40px;
    font-size: 30px;
`;

const LanguageSelect = styled.div`
    cursor: pointer;
`;

export default withTranslation()(LanguageSelectorRoyale);
