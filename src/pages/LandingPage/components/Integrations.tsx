import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv, FlexWrapper, Title } from './styled-components';

const Integrations: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FlexWrapper>
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
    @media (max-width: 400px) {
        justify-content: space-around;
    }
`;

const InfrastuctureWrapper = styled(SupportedNetworkWrapper)`
    margin-top: 20px;
`;

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

const LINK = styled(IconAbs)`
    font-size: 14em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;

export default Integrations;
