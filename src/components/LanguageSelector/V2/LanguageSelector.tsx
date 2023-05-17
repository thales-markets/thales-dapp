import React, { useState } from 'react';
import { FlexDivCentered, FlexDiv, FlexDivColumn, FlexDivColumnCentered } from 'theme/common';
import { withTranslation } from 'react-i18next';
import i18n from 'i18n';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { DEFAULT_LANGUAGE, LanguageNameMap, SupportedLanguages } from 'i18n/config';
import { LandingPageTooltip } from 'components/OldVersion/old-components';

type LanguageSelectorProps = {
    isBurger?: boolean;
};

export const LanguageSelectorV2: React.FC<LanguageSelectorProps> = ({ isBurger }) => {
    const [languageDropdownIsOpen, setLanguageDropdownIsOpen] = useState(false);
    const setDropdownIsOpen = (isOpen: boolean) => {
        if (!isOpen && !languageDropdownIsOpen) {
            return;
        }
        setLanguageDropdownIsOpen(isOpen);
    };

    // const selectedLanguage = (Object.values(SupportedLanguages) as string[]).includes(i18n.language)
    //     ? i18n.language
    //     : DEFAULT_LANGUAGE;

    const selectedLanguage = DEFAULT_LANGUAGE;

    return (
        <>
            <OutsideClickHandler onOutsideClick={() => setDropdownIsOpen(false)}>
                <Container className={isBurger ? 'burger' : ''}>
                    <LanguageButton
                        onClick={() => {
                            setDropdownIsOpen(!languageDropdownIsOpen);
                        }}
                    >
                        {LanguageFlag(selectedLanguage as any)}
                    </LanguageButton>
                    {languageDropdownIsOpen && (
                        <DropDown className={isBurger ? 'language-dropdown' : ''}>
                            {Object.values(SupportedLanguages).map((language: string) => (
                                <DropDownItem
                                    key={language}
                                    onClick={() => {
                                        i18n.changeLanguage(DEFAULT_LANGUAGE);
                                        setDropdownIsOpen(false);
                                    }}
                                >
                                    {LanguageFlag(language as any)}
                                    {language !== SupportedLanguages.ENGLISH ? (
                                        <LandingPageTooltip title="Coming soon">
                                            <FlexDivCentered>
                                                <LanguageName style={{ color: 'grey' }} key={language}>
                                                    {(LanguageNameMap as any)[language] + '*'}
                                                </LanguageName>
                                            </FlexDivCentered>
                                        </LandingPageTooltip>
                                    ) : (
                                        <FlexDivCentered>
                                            <LanguageName key={language}>
                                                {(LanguageNameMap as any)[language]}
                                            </LanguageName>
                                        </FlexDivCentered>
                                    )}
                                </DropDownItem>
                            ))}
                        </DropDown>
                    )}
                </Container>
            </OutsideClickHandler>
        </>
    );
};

const Container = styled(FlexDivColumnCentered)`
    position: relative;
    z-index: 1000;
    align-items: flex-end;
    &.burger {
        top: -27px;
    }
`;

const LanguageButton = styled.button`
    border: none;
    position: relative;
    cursor: pointer;
    background: transparent;
`;

const FlagIcon = styled.i`
    font-size: 2.4em;
    @media (max-width: 1024px) {
        font-size: 2.1em;
    }
    color: var(--color-white);
`;

const DropDown = styled(FlexDivColumn)`
    background: var(--background);
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.4);
    border-radius: 7px;
    position: absolute;
    margin-top: 2px;
    padding: 8px;
    top: 40px;
    left: 0;
    &.language-dropdown {
        position: relative;
        box-shadow: none;
        border-radius: 0;
        top: 0;
        left: -16px;
        margin-top: 20px;
        width: 100%;
        background: transparent;
    }
`;

const DropDownItem = styled(FlexDiv)`
    padding: 8px 8px;
    font-size: 1em;
    cursor: pointer;
    &:hover {
        background: rgba(196, 196, 196, 0.1);
        border-radius: 8px;
    }
`;

const LanguageName = styled.div`
    font-weight: normal;
    font-size: 1em;
    line-height: 24px;
    letter-spacing: 0.25px;
    color: var(--color-white);
    margin-left: 10px;
    display: block;
    text-transform: uppercase;
`;

const LanguageFlag = (language: SupportedLanguages | any) => {
    switch (language) {
        case SupportedLanguages.ENGLISH:
            return <FlagIcon className="icon-home icon-home--en" />;

        case SupportedLanguages.RUSSIAN:
            return <FlagIcon style={{ color: 'grey' }} className="icon-home icon-home--ru" />;

        case SupportedLanguages.CHINESE:
            return <FlagIcon style={{ color: 'grey' }} className="icon-home icon-home--ch" />;

        default:
            return <FlagIcon className="icon-home icon-home--en" />;
    }
};

export default withTranslation()(LanguageSelectorV2);
