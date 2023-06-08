import privacyPolicy from 'assets/docs/thales-privacy-policy.pdf';
import termsOfUse from 'assets/docs/thales-terms-of-use.pdf';
import footerW from 'assets/images/landing-page/footer-white.png';
import footerW2 from 'assets/images/landing-page/footer_white.svg';
import LanguageSelector from 'components/LanguageSelector';
import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { navigateTo } from 'utils/routes';

type HeaderInput = {
    className?: string;
};

const Footer: React.FC<HeaderInput> = ({ className }) => {
    const { t } = useTranslation();

    return (
        <FooterHtml className={className}>
            <Image src={footerW} />
            <Lines src={footerW2} />
            <FooterContainer>
                <FooterIconLogo className="icon-home icon-home--thales" />
                <FooterButtonsWrapper>
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
    color: ${(props) => props.theme.landingPage.textColor.primary};
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
            background: ${(props) => props.theme.landingPage.background.primary};
            & > a > i {
                color: ${(props) => props.theme.landingPage.textColor.primary} !important;
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
    background: ${(props) => props.theme.landingPage.background.primary};
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
    color: ${(props) => props.theme.landingPage.textColor.primary};
`;

const FooterLink = styled.a`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 36px;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    &:visited {
        color: ${(props) => props.theme.landingPage.textColor.primary};
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
    color: ${(props) => props.theme.landingPage.textColor.primary};
    text-align: center;
`;

const ButtonContainer = styled.div`
    border: 3px solid ${(props) => props.theme.landingPage.textColor.primary};
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
    color: ${(props) => props.theme.landingPage.textColor.primary};
    cursor: pointer;
    &:visited {
        color: ${(props) => props.theme.landingPage.textColor.primary};
    }
    & > i {
        font-size: 4em;
        line-height: 26px;
        color: ${(props) => props.theme.landingPage.textColor.primary};
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

const IconLink = styled.a``;

export default Footer;
