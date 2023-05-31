import React, { useState } from 'react';
import { FlexDivCentered, FlexDiv, FlexDivColumn, FlexDivColumnCentered } from 'theme/common';
import { withTranslation } from 'react-i18next';
import i18n from 'i18n';
import ReactCountryFlag from 'react-country-flag';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { ReactComponent as CheckmarkIcon } from 'assets/images/checkmark-white.svg';
import { DEFAULT_LANGUAGE, LanguageNameMap, SupportedLanguages } from 'i18n/config';
import { ScreenSizeBreakpoint } from 'constants/ui';

type LanguageSelectorProps = {
    isLandingPage?: boolean;
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isLandingPage }) => {
    const [languageDropdownIsOpen, setLanguageDropdownIsOpen] = useState(false);
    const setDropdownIsOpen = (isOpen: boolean) => {
        if (!isOpen && !languageDropdownIsOpen) {
            return;
        }
        setLanguageDropdownIsOpen(isOpen);
    };

    const selectedLanguage = (Object.values(SupportedLanguages) as string[]).includes(i18n.language)
        ? i18n.language
        : DEFAULT_LANGUAGE;

    return (
        <>
            <OutsideClickHandler onOutsideClick={() => setDropdownIsOpen(false)}>
                <Container isLandingPage={isLandingPage}>
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

const Container = styled(FlexDivColumnCentered)<{ isLandingPage?: boolean }>`
    width: 74px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        position: absolute;
        right: ${(props) => (props.isLandingPage ? 60 : 40)}px;
        top: ${(props) => (props.isLandingPage ? 30 : 40)}px;
    }
`;

const LanguageButton = styled.button<{ isActive: boolean }>`
    position: relative;
    width: 66px;
    height: 40px;
    border: none;
    position: relative;
    cursor: pointer;
    background: transparent;
    margin-right: 10px;
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
    background: linear-gradient(
        281.48deg,
        ${(props) => props.theme.background.primary} -16.58%,
        var(--color-tertiary) 97.94%
    );
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
    display: block;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
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
