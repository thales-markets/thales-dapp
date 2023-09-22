import SPAAnchor from 'components/SPAAnchor';
import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { buildHref } from 'utils/routes';
import { FlexWrapper, Title, FlexDiv } from './styled-components';

const Integrations: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FlexWrapper>
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

export default Integrations;
