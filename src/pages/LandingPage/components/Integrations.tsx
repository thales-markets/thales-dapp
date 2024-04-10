import SPAAnchor from 'components/SPAAnchor';
import { LINKS } from 'constants/links';
import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { buildHref } from 'utils/routes';
import { FlexDiv, FlexWrapper, Title } from './styled-components';

const Integrations: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FlexWrapper>
            <Title> {t('landing-page.products')}</Title>
            <ButtonWrapper>
                <SPAAnchor href={buildHref(ROUTES.Options.Home)}>
                    <Button>
                        {t('landing-page.product-links.digital-options')}
                        <Arrow className="icon icon--right" />
                    </Button>
                </SPAAnchor>
                <SPAAnchor href={buildHref(ROUTES.Options.RangeMarkets)}>
                    <Button>
                        {t('landing-page.product-links.ranged-markets')}
                        <Arrow className="icon icon--right" />
                    </Button>
                </SPAAnchor>
                <SPAAnchor href={buildHref(LINKS.SpeedMarkets)}>
                    <Button>
                        {t('landing-page.product-links.speed-markets')}
                        <Arrow className="icon icon--right" />
                    </Button>
                </SPAAnchor>
            </ButtonWrapper>
            <Title> {t('landing-page.initiatives')}</Title>
            <FlexDiv className="initiatives">
                <SPAAnchor href={buildHref(ROUTES.Options.Home)}>
                    <Thales className="icon-home icon-home--thales" />
                </SPAAnchor>
                <SPAAnchor href={buildHref(ROUTES.Options.SpeedMarkets)}>
                    <SpeedMarkets className="icon-home icon-home--speed" />
                </SPAAnchor>
                <SPAAnchor href={buildHref(ROUTES.Options.Game)}>
                    <ThalesGame className="icon-home icon-home--game" />
                </SPAAnchor>
            </FlexDiv>
            <Title style={{ marginBottom: '1em' }}> {t('landing-page.integrations')}</Title>
            <FlexDiv>
                <a target="_blank" rel="noreferrer" href="https://synthetix.io/">
                    <SNX className="icon-home icon-home--snx" />
                </a>
                <a target="_blank" rel="noreferrer" href="https://chain.link/">
                    <LINK className="icon-home icon-home--link" />
                </a>
            </FlexDiv>
            <FlexDiv>
                <a target="_blank" rel="noreferrer" href="https://www.optimism.io/">
                    <OPTIMISM className="icon-home icon-home--optimism" />
                </a>
                <a target="_blank" rel="noreferrer" href="https://arbitrum.io/">
                    <ARBITRUM className="icon-home icon-home--arbitrum" />
                </a>
            </FlexDiv>
            <FlexDiv>
                <a target="_blank" rel="noreferrer" href="https://base.org/">
                    <BASE className="icon-home icon-home--base" />
                </a>
                <a target="_blank" rel="noreferrer" href="https://polygon.technology/">
                    <OPTIMISM className="icon-home icon-home--polygon" />
                </a>
            </FlexDiv>
            <FlexDiv>
                <a target="_blank" rel="noreferrer" href="https://pyth.network/">
                    <PYTH className="icon-home icon-home--pyth" />
                </a>
            </FlexDiv>
            <Title style={{ marginBottom: '1em' }}> {t('landing-page.featured-in')}</Title>
            <FlexDiv>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://finance.yahoo.com/news/thales-announces-launch-referral-program-121249063.html"
                >
                    <FeatureLogo className="icon-home logo--yahoo" />
                </a>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.bloomberg.com/press-releases/2022-06-07/thales-announces-the-launch-of-its-new-referral-program"
                >
                    <FeatureLogo className="icon-home logo--bloomberg" />
                </a>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.nasdaq.com/press-release/thales-announces-the-launch-of-its-new-referral-program-2022-06-07"
                >
                    <FeatureLogo className="icon-home logo--nasdaq" />
                </a>
            </FlexDiv>
            <FlexDiv>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.benzinga.com/content/27585212/thales-announces-the-launch-of-its-new-referral-program"
                >
                    <FeatureLogo className="icon-home logo--benzinga" />
                </a>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://newsletter.banklesshq.com/p/your-guide-to-the-synthetix-ecosystem?s=r"
                >
                    <FeatureLogo className="icon-home logo--bankless" />
                </a>
            </FlexDiv>
        </FlexWrapper>
    );
};

const IconAbs = styled.i`
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        transform: scale(1.2);
    }
    &:before {
        pointer-events: none;
    }
`;

const Thales = styled(IconAbs)`
    font-size: 16em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
    @media (max-width: 450px) {
        padding: 0 10px;
    }
`;
const SpeedMarkets = styled(IconAbs)`
    font-size: 20em;
    margin-bottom: -50px;
    @media (max-width: 600px) {
        font-size: 12em;
    }
    @media (max-width: 450px) {
        padding: 0 10px;
        margin-bottom: -25px;
    }
`;
const ThalesGame = styled(IconAbs)`
    font-size: 16em;
    @media (max-width: 650px) {
        line-height: 0.6em;
        margin-bottom: 90px;
    }
    @media (max-width: 600px) {
        font-size: 10em;
        line-height: 0.2em;
        margin-bottom: 0px;
    }
    @media (max-width: 450px) {
        margin-bottom: 90px;
        padding: 0 10px;
    }
`;

const FeatureLogo = styled(IconAbs)`
    font-size: 16em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;

const SNX = styled(IconAbs)`
    font-size: 16em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;

const OPTIMISM = styled(IconAbs)`
    font-size: 20em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;

const ARBITRUM = styled(IconAbs)`
    font-size: 20em;
    line-height: 0.5em;
    margin-bottom: -35px;
    @media (max-width: 600px) {
        font-size: 10em;
        margin-bottom: -20px;
    }
`;

const BASE = styled(IconAbs)`
    font-size: 16em;
    line-height: 0.5em;
    margin-bottom: -40px;
    @media (max-width: 600px) {
        font-size: 8em;
        margin-bottom: -15px;
    }
`;

const LINK = styled(IconAbs)`
    font-size: 20em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;

const PYTH = styled(IconAbs)`
    font-size: 16em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 8em;
    }
`;

const ButtonWrapper = styled(FlexDiv)`
    margin: 50px 0 90px 0;
    align-items: center;
    justify-content: center;
`;

const Button = styled.div`
    background-color: ${(props) => props.theme.landingPage.button.background.primary};
    color: ${(props) => props.theme.landingPage.button.textColor.primary} !important;
    border-radius: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 42px;
    z-index: 2;
    margin: 0 20px;
    padding: 25px 30px;
    font-weight: 800;
    cursor: pointer;
    font-size: 22px;
    a {
        color: ${(props) => props.theme.landingPage.button.textColor.primary} !important;
    }
    i {
        color: ${(props) => props.theme.landingPage.button.textColor.primary} !important;
    }
`;

const Arrow = styled.i`
    font-family: Icons !important;
    font-weight: bold;
    margin-left: 10px;
`;

export default Integrations;
