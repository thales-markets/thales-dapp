import React from 'react';
import styled from 'styled-components';
import { ReactComponent as OpLogo } from 'assets/images/optimism-circle-logo.svg';
import { ReactComponent as EthereumLogo } from 'assets/images/ethereum-circle-logo.svg';
import { ReactComponent as PolygonLogo } from 'assets/images/polygon-circle-logo.svg';
import { ReactComponent as ArbitrumLogo } from 'assets/images/arbitrum-circle-logo.svg';
import { ReactComponent as BSCLogo } from 'assets/images/binance_chain.svg';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_MAINNET_NETWORK_IDS_MAP } from 'constants/network';
import { Network, NetworkId, getIsMainnet } from 'utils/network';
import Button from 'components/ButtonV2';
import { ScreenSizeBreakpoint } from 'constants/ui';

const UnsupportedNetwork: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMainnet = getIsMainnet(networkId);

    const getButton = (network: NetworkId) => {
        let logo;
        let text;
        switch (network) {
            case Network.Mainnet:
                logo = <EthereumLogo />;
                text = t(`common.unsupported-network.button.mainnet`);
                break;
            case Network['Mainnet-Ovm']:
                logo = <OpLogo />;
                text = t(`common.unsupported-network.button.optimism`);
                break;
            case Network.BSC:
                logo = <BSCLogo />;
                text = t(`common.unsupported-network.button.bsc`);
                break;
            case Network['POLYGON-MAINNET']:
                logo = <PolygonLogo />;
                text = t(`common.unsupported-network.button.polygon`);
                break;
            case Network.Arbitrum:
                logo = <ArbitrumLogo />;
                text = t(`common.unsupported-network.button.arbitrum`);
                break;
        }

        return (
            <Button
                width="250px"
                additionalStyles={{ textTransform: 'none' }}
                onClick={() => SUPPORTED_MAINNET_NETWORK_IDS_MAP[network].changeNetwork(network)}
            >
                {logo}
                <ButtonText>{text}</ButtonText>
            </Button>
        );
    };

    return (
        <Wrapper>
            <Title>{t(`common.unsupported-network.title`)}</Title>
            <ExplanationText>{t(`common.unsupported-network.description`)}</ExplanationText>
            <ButtonWrapper>
                {getButton(Network['Mainnet-Ovm'])}
                {getButton(Network['POLYGON-MAINNET'])}
            </ButtonWrapper>
            <ButtonWrapper>
                {getButton(Network.Arbitrum)}
                {getButton(Network.BSC)}
            </ButtonWrapper>
            {!isMainnet && <ButtonWrapper>{getButton(Network.Mainnet)}</ButtonWrapper>}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    background: ${(props) => props.theme.background.primary};
    border: 1px solid ${(props) => props.theme.borderColor.secondary};
    border-radius: 8px;
    padding: 20px;
    max-width: 600px;
    text-align: center;

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 5px;
        max-width: calc(100% - 10px);
    }
`;

const Title = styled.p`
    font-weight: 700;
    font-size: 22px;
    line-height: 25px;
    color: ${(props) => props.theme.textColor.primary};
    text-align: center;
    margin: 20px 0;
`;

const ExplanationText = styled.p`
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    color: ${(props) => props.theme.textColor.primary};
    text-align: center;
    margin-bottom: 5px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 20px 0px;

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        margin: 10px 0px;
        gap: 20px;
    }
`;

const ButtonText = styled.span`
    padding-left: 5px;
`;

export default UnsupportedNetwork;
