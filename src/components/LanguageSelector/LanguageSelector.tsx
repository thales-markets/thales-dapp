import React, { useState } from 'react';
import { FlexDivCentered, FlexDiv, FlexDivColumn, FlexDivColumnCentered } from 'theme/common';
import { withTranslation } from 'react-i18next';
import i18n from 'i18n';
import ReactCountryFlag from 'react-country-flag';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { ReactComponent as CheckmarkIcon } from 'assets/images/checkmark-white.svg';

enum SupportedLanguages {
    ENGLISH = 'en',
    RUSSIAN = 'ru',
    CHINESE = 'cn',
}

const LanguageNameMap = {
    [SupportedLanguages.ENGLISH]: 'English',
    [SupportedLanguages.RUSSIAN]: 'Pусский',
    [SupportedLanguages.CHINESE]: '中文',
};

export const LanguageSelector: React.FC = () => {
    const [languageDropdownIsOpen, setLanguageDropdownIsOpen] = useState(false);
    const setDropdownIsOpen = (isOpen: boolean) => {
        if (!isOpen && !languageDropdownIsOpen) {
            return;
        }
        setLanguageDropdownIsOpen(isOpen);
    };

    const selectedLanguage = i18n.language;

    return (
        <>
            <OutsideClickHandler onOutsideClick={() => setDropdownIsOpen(false)}>
                <Container>
                    <LanguageButton
                        onClick={() => {
                            setDropdownIsOpen(!languageDropdownIsOpen);
                        }}
                        isActive={languageDropdownIsOpen}
                    >
                        <LanguageFlag language={selectedLanguage} />
                    </LanguageButton>
                    {languageDropdownIsOpen && (
                        <DropdownContainer>
                            <DropDown>
                                {Object.values(SupportedLanguages).map((language: string) => (
                                    <DropDownItem
                                        key={language}
                                        onClick={() => {
                                            i18n.changeLanguage(language);
                                            setDropdownIsOpen(false);
                                        }}
                                    >
                                        <CheckmarkContainer>
                                            {selectedLanguage === language && <CheckmarkIcon />}
                                        </CheckmarkContainer>
                                        <LanguageFlag language={language} />
                                        <FlexDivCentered>
                                            <LanguageName key={language}>
                                                {(LanguageNameMap as any)[language]}
                                            </LanguageName>
                                        </FlexDivCentered>
                                    </DropDownItem>
                                ))}
                            </DropDown>
                        </DropdownContainer>
                    )}
                </Container>
            </OutsideClickHandler>
        </>
    );
};

const Container = styled(FlexDivColumnCentered)`
    width: 78px;
`;

const LanguageButton = styled.button<{ isActive: boolean }>`
    position: relative;
    width: 66px;
    height: 40px;
    border: none;
    position: relative;
    z-index: 1000;
    cursor: pointer;
    background: transparent;
    margin-right: 20px;
    &:hover {
        background: rgba(196, 196, 196, 0.1);
        border-radius: 5px;
    }
`;

const DropdownContainer = styled.div`
    position: relative;
    z-index: 1000;
`;

const DropDown = styled(FlexDivColumn)`
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border: 1px solid #4f759b;
    border-radius: 12px;
    position: absolute;
    margin-top: 2px;
    padding: 8px;
    left: -26px;
`;

const DropDownItem = styled(FlexDiv)`
    padding: 8px 8px;
    cursor: pointer;
    &:hover {
        background: rgba(196, 196, 196, 0.1);
        border-radius: 8px;
    }
`;

const CheckmarkContainer = styled(FlexDivCentered)`
    width: 12px;
    margin-right: 10px;
`;

const LanguageName = styled.div`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    margin-left: 10px;
`;

type LanguageFlagProps = {
    language: string;
};

const LanguageFlag: React.FC<LanguageFlagProps> = ({ language }) => {
    return (
        <ReactCountryFlag
            key={language}
            countryCode={language === SupportedLanguages.ENGLISH ? 'gb' : language}
            style={{ width: 41, height: 24 }}
            svg
        />
    );
};

export default withTranslation()(LanguageSelector);
