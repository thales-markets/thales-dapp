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
            <Title> {t('landing-page.supported-networks')}</Title>
            <SupportedNetworkWrapper>
                <a target="_blank" rel="noreferrer" href="https://www.optimism.io/">
                    <OPTIMISM className="icon-home icon-home--optimism" />
                </a>
                <a target="_blank" rel="noreferrer" href="https://arbitrum.io/">
                    <ARBITRUM className="icon-home icon-home--arbitrum" />
                </a>
                <a target="_blank" rel="noreferrer" href="https://base.org/">
                    <BASE className="icon-home icon-home--base" />
                </a>
                <a target="_blank" rel="noreferrer" href="https://base.org/">
                    <POLYGON className="icon-home icon-home--polygon" />
                </a>
            </SupportedNetworkWrapper>
            <Title>{t('landing-page.infrastructure')}</Title>
            <InfrastuctureWrapper>
                <a target="_blank" rel="noreferrer" href="https://synthetix.io/">
                    <Thales className="icon-home icon-home--thales" />
                </a>
                <a target="_blank" rel="noreferrer" href="https://synthetix.io/">
                    <SNX className="icon-home icon-home--snx" />
                </a>
                <a target="_blank" rel="noreferrer" href="https://chain.link/">
                    <LINK className="icon-home icon-home--link" />
                </a>
                <a target="_blank" rel="noreferrer" href="https://pyth.network/">
                    <PYTH className="icon-home icon-home--pyth" />
                </a>
            </InfrastuctureWrapper>
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

const SupportedNetworkWrapper = styled(FlexDiv)`
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
`;

const InfrastuctureWrapper = styled(SupportedNetworkWrapper)``;

const Thales = styled(IconAbs)`
    font-size: 10em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
    @media (max-width: 450px) {
        padding: 0 10px;
    }
`;

const SNX = styled(IconAbs)`
    font-size: 14em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;

const OPTIMISM = styled(IconAbs)`
    font-size: 12em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;

const ARBITRUM = styled(IconAbs)`
    font-size: 12em;
    line-height: 0.5em;
    margin-bottom: -35px;
    @media (max-width: 600px) {
        font-size: 10em;
        margin-bottom: -20px;
    }
`;

const BASE = styled(IconAbs)`
    font-size: 10em;
    line-height: 0.5em;
    margin-bottom: -40px;
    @media (max-width: 600px) {
        font-size: 8em;
        margin-bottom: -15px;
    }
`;

const POLYGON = styled(IconAbs)`
    font-size: 15em;
    line-height: 0.5em;
    margin-bottom: -20px;
    @media (max-width: 600px) {
        font-size: 8em;
        margin-bottom: -15px;
    }
`;

const LINK = styled(IconAbs)`
    font-size: 14em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;

const PYTH = styled(IconAbs)`
    font-size: 12em;
    line-height: 0.5em;
    margin-bottom: -30px;
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
