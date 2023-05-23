import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import i18n from 'i18n';
import styled from 'styled-components';

import { DEFAULT_LANGUAGE, SupportedLanguages, LanguageNameMap } from 'i18n/config';
import { useTranslation } from 'react-i18next';

import { FlexDivRow, UserCardSectionHeader } from 'theme/common';

export const LanguageCardSelector: React.FC = () => {
    const [selectedLanguage, setLanguage] = useState(
        (Object.values(SupportedLanguages) as string[]).includes(i18n.language) ? i18n.language : DEFAULT_LANGUAGE
    );

    const { t } = useTranslation();

    return (
        <>
            <UserCardSectionHeader>{t('common.user-info-card.language')}</UserCardSectionHeader>
            <FlexDivRow>
                {Object.values(SupportedLanguages).map((language: string) => (
                    <LanguageContainer
                        key={language}
                        onClick={() => {
                            i18n.changeLanguage(language);
                            setLanguage(language);
                        }}
                        selected={selectedLanguage == language}
                    >
                        {LanguageFlag(language as any)}
                        <LanguageName>{(LanguageNameMap as any)[language]}</LanguageName>
                    </LanguageContainer>
                ))}
            </FlexDivRow>
        </>
    );
};

const LanguageContainer = styled.div<{ selected?: boolean }>`
    border: none;
    cursor: pointer;
    text-align: center;
    margin-top: 10px;
    color: ${(props: any) => (props.selected ? 'var(--color-white)' : '#8181ac')};
`;

const FlagIcon = styled.i`
    font-size: 35px;
`;

const LanguageName = styled.p`
    font-weight: bold;
    font-size: 12px;
    line-height: 20px;
    text-transform: capitalize;
`;

const LanguageFlag = (language: SupportedLanguages | any) => {
    switch (language) {
        case SupportedLanguages.ENGLISH:
            return <FlagIcon className="sidebar-icon icon--gb-flag" />;
        case SupportedLanguages.RUSSIAN:
            return <FlagIcon className="sidebar-icon icon--ru-flag" />;
        case SupportedLanguages.CHINESE:
            return <FlagIcon className="sidebar-icon icon--cn-flag" />;
        default:
            return <FlagIcon className="sidebar-icon icon--gb-flag" />;
    }
};

export default withTranslation()(LanguageCardSelector);
