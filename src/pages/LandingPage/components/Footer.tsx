import React from 'react';
import styled from 'styled-components';
import footer from 'assets/images/landing-page/footer.png';
import footerW from 'assets/images/landing-page/footer-white.png';
import footer2 from 'assets/images/landing-page/footer_black.svg';
import footerW2 from 'assets/images/landing-page/footer_white.svg';
import privacyPolicy from 'assets/docs/thales-privacy-policy.pdf';
import termsOfUse from 'assets/docs/thales-terms-of-use.pdf';
import { IconLink } from 'theme/common';
import LanguageSelector from 'components/LanguageSelector/V2';
import { Theme } from '../Home';
import Cookies from 'universal-cookie';
import ROUTES from 'constants/routes';
import { useTranslation } from 'react-i18next';
import { navigateTo } from 'utils/routes';

type HeaderInput = {
    theme: Theme;
    setTheme: (data: any) => void;
    hideGraphics?: boolean;
    className?: string;
};

const cookies = new Cookies();

const Footer: React.FC<HeaderInput> = ({ theme, setTheme, hideGraphics, className }) => {
    const { t } = useTranslation();
    return (
        <FooterHtml className={className}>
            {!hideGraphics && <Image src={theme === Theme.Dark ? footerW : footer} />}
            {!hideGraphics && <Lines src={theme === Theme.Dark ? footerW2 : footer2} />}
            <FooterContainer>
                <FooterIconLogo className="icon-home icon-home--thales" />
                <FooterButtonsWrapper>
                    <ButtonWrapper>
                        <Label>{t('landing-page.footer.theme').toUpperCase()}</Label>
                        <ToggleContainer
                            onClick={() => {
                                cookies.set('home-theme', theme === Theme.Light ? Theme.Dark : Theme.Light);
                                setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
                            }}
                        >
                            <ToggleIcon
                                className={`icon-home ${
                                    theme === Theme.Light ? 'icon-home--toggle-white' : 'icon-home--toggle-dark'
                                }`}
                            />
                        </ToggleContainer>
                    </ButtonWrapper>
                    <ButtonWrapper>
                        <ButtonContainer>
                            <DAPPLink
                                rel="noreferrer"
                                onClick={() => navigateTo(ROUTES.Options.Home, false, false, 'show')}
                            >
                                <i className="icon-home icon-home--thales" /> DAPP
                            </DAPPLink>
                        </ButtonContainer>
                    </ButtonWrapper>
                    <ButtonWrapper>
                        <Label>{t('landing-page.footer.language').toUpperCase()}</Label>
                        <LanguageSelector />
                    </ButtonWrapper>
                </FooterButtonsWrapper>
                <FooterIconsWrapper>
                    <IconLink target="_blank" rel="noreferrer" href="https://github.com/thales-markets">
                        <FooterIcon className="icon-home icon-home--github" />
                    </IconLink>
                    <IconLink target="_blank" rel="noreferrer" href="https://discord.com/invite/rB3AWKwACM">
                        <FooterIcon className="icon-home icon-home--discord" />
                    </IconLink>
                    <IconLink target="_blank" rel="noreferrer" href="https://thalesmarket.medium.com/">
                        <FooterIcon className="icon-home icon-home--medium" />
                    </IconLink>
                    <IconLink target="_blank" rel="noreferrer" href="https://twitter.com/ThalesMarket">
                        <FooterIcon className="icon-home icon-home--twitter" />
                    </IconLink>
                    <IconLink target="_blank" rel="noreferrer" href="https://t.me/thalesprotocol/">
                        <FooterIcon className="icon-home icon-home--telegram" />
                    </IconLink>
                    <IconLink target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                        <FooterIcon className="icon-home icon-home--docs" />
                    </IconLink>
                </FooterIconsWrapper>
                <FooterLegalWrapper>
                    <FooterLinkWrapper>
                        <FooterLink target="_blank" rel="noreferrer" href={privacyPolicy}>
                            {t('landing-page.footer.privacy-policy').toUpperCase()}
                        </FooterLink>
                    </FooterLinkWrapper>
                    <FooterLinkWrapper>
                        <FooterLink target="_blank" rel="noreferrer" href={termsOfUse}>
                            {t('landing-page.footer.terms-of-use').toUpperCase()}
                        </FooterLink>
                    </FooterLinkWrapper>
                    {/* <FooterLinkWrapper>
                        <FooterLink>{t('landing-page.footer.brand-assets').toUpperCase()}</FooterLink>
                    </FooterLinkWrapper>
                    <FooterLinkWrapper>
                        <FooterLink>{t('landing-page.footer.etherscan').toUpperCase()}</FooterLink>
                    </FooterLinkWrapper> */}
                </FooterLegalWrapper>

                <FooterIconsWrapper>
                    {t('landing-page.footer.all-rights-reserved', { year: new Date().getFullYear() }).toUpperCase()}
                </FooterIconsWrapper>
            </FooterContainer>
        </FooterHtml>
    );
};

const FlexDiv = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    color: var(--color);
    flex-wrap: wrap;
`;

const Lines = styled.img`
    position: absolute;
    z-index: 1;
    top: -180px;
    left: 0%;
    right: 0%;
    margin: auto;
    @media (max-width: 1500px) {
        width: 150%;
        left: -25%;
    }
`;

const FooterHtml = styled.div`
    position: relative;
    margin-top: 200px;
    & > div {
        & > div:nth-child(2) {
            margin-top: 2em;
        }
        & > i {
            display: none;
        }
    }
    &.article {
        margin-top: 10px;
        display: flex;
        & > img {
            display: none !important;
        }
        & > div {
            position: relative;
            display: grid;
            width: 100vw;
            margin-top: 17px;
            z-index: 3;
            background: var(--main-background);
            & > a > i {
                color: var(--color) !important;
            }
            & > i {
                display: inline-block;
            }
            & > div:nth-child(2) {
                margin-top: 0;
            }
        }
    }
`;

const Image = styled.img`
    height: 100%;
    object-fit: contain;
    position: relative;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    @supports (-moz-appearance: none) {
        height: auto;
    }
    @media (max-width: 600px) {
        width: 100%;
        transform: scale(1.52);
        left: 0;
    }
`;

const FooterIconsWrapper = styled(FlexDiv)`
    position: relative;
    display: flex;
    justify-content: center;
    gap: 6em;
    &:last-child {
        margin: 25px 0 50px;
        font-family: Nunito !important;
        font-style: normal;
        font-weight: 300;
        font-size: 15px;
        line-height: 36px;
    }
    @media (max-width: 900px) {
        gap: 4em;
    }
    @media (max-width: 600px) {
        gap: 4em;
    }
    @media (max-width: 450px) {
        gap: 3em;
    }
`;

const FooterLegalWrapper = styled(FlexDiv)`
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const FooterButtonsWrapper = styled(FlexDiv)`
    position: relative;
    display: flex;
    justify-content: center;
    gap: 6em;
    margin-bottom: 10px;
    @media (max-width: 900px) {
        gap: 4em;
    }
    @media (max-width: 600px) {
        gap: 2em;
    }
`;

const FooterContainer = styled(FlexDiv)`
    position: relative;
    display: grid;
    width: 100vw;
    left: 0;
    right: 0;
    margin: 17px auto 0;
    z-index: 3;
    background: var(--main-background);
`;

const FooterIcon = styled.i`
    transition: 0.2s;
    &:hover {
        transform: scale(1.2);
    }
    &:before {
        pointer-events: none;
    }
    font-size: 3em;
    color: var(--color);
`;

const FooterLink = styled.a`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 36px;
    color: var(--color);
    &:visited {
        color: var(--color);
    }
`;

const FooterLinkWrapper = styled.div`
    &:first-child {
        &:before {
            content: ' ';
            padding: 0 0;
        }
    }
    &:before {
        content: ' | ';
        padding: 0 1.5em;
    }
    @media (max-width: 600px) {
        &:before {
            content: ' | ';
            padding: 0 0.5em;
        }
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 10px;
`;

const FooterIconLogo = styled.i`
    font-size: 12em;
    margin-top: -50px;
    margin-bottom: -40px;
    color: var(--color);
    text-align: center;
`;

const ToggleContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const ToggleIcon = styled.i`
    font-size: 3.4em;
    line-height: 26px;
    z-index: 2;
    color: var(--color);
`;

const ButtonContainer = styled.div`
    border: 3px solid var(--color);
    box-sizing: border-box;
    border-radius: 21px;
    width: 9em;
    display: flex;
    justify-content: center;
`;

const DAPPLink = styled.a`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 36px;
    width: 100%;
    text-align: center;
    color: var(--color);
    cursor: pointer;
    &:visited {
        color: var(--color);
    }
    & > i {
        font-size: 4em;
        line-height: 26px;
        color: var(--color);
    }
`;

const Label = styled.span`
    align-self: center;
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 26px;
`;

export default Footer;
