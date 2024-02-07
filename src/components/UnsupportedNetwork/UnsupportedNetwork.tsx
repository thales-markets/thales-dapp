import { ReactComponent as ArbitrumLogo } from 'assets/images/arbitrum-circle-logo.svg';
import { ReactComponent as EthereumLogo } from 'assets/images/ethereum-circle-logo.svg';
import { ReactComponent as OpLogo } from 'assets/images/optimism-circle-logo.svg';
import { ReactComponent as PolygonLogo } from 'assets/images/polygon-circle-logo.svg';
import { ReactComponent as BaseLogo } from 'assets/images/base-circle-logo.svg';
import { ReactComponent as ZkSyncLogo } from 'assets/images/zksync-circle-logo.svg';
import { ReactComponent as BlastSepoliaLogo } from 'assets/images/blast-sepolia-circle-logo.svg';
import Button from 'components/Button';
import { SUPPORTED_NETWORK_IDS_MAP } from 'utils/network';
import { Network } from 'enums/network';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TEST_NETWORKS } from 'constants/network';

type UnsupportedNetworkProps = {
    supportedNetworks: Network[];
};

const UnsupportedNetwork: React.FC<UnsupportedNetworkProps> = ({ supportedNetworks }) => {
    const { t } = useTranslation();

    const supportedMainnetNetworks = supportedNetworks?.filter(
        (supportedNetwork) => !TEST_NETWORKS.includes(supportedNetwork)
    );

    const getButton = (networkId: Network) => {
        let logo;
        let text;
        switch (networkId) {
            case Network.Mainnet:
                logo = <EthereumLogo />;
                text = t(`common.unsupported-network.button.mainnet`);
                break;
            case Network.OptimismMainnet:
                logo = <OpLogo />;
                text = t(`common.unsupported-network.button.optimism`);
                break;
            case Network.PolygonMainnet:
                logo = <PolygonLogo />;
                text = t(`common.unsupported-network.button.polygon`);
                break;
            case Network.Arbitrum:
                logo = <ArbitrumLogo />;
                text = t(`common.unsupported-network.button.arbitrum`);
                break;
            case Network.Base:
                logo = <StyledBaseLogo />;
                text = t(`common.unsupported-network.button.base`);
                break;
            case Network.ZkSync:
                logo = <ZkSyncLogo />;
                text = t(`common.unsupported-network.button.zkSync`);
                break;
            case Network.BlastSepolia:
                logo = (
                    <BlastLogoWrapper>
                        <BlastSepoliaLogo />
                    </BlastLogoWrapper>
                );
                text = t(`common.unsupported-network.button.blast-sepolia`);
                break;
        }

        return (
            <Button
                width="250px"
                padding="0 18px"
                additionalStyles={{ textTransform: 'none' }}
                onClick={() => SUPPORTED_NETWORK_IDS_MAP[networkId].changeNetwork(networkId)}
            >
                {logo}
                <ButtonText>{text}</ButtonText>
            </Button>
        );
    };

    return (
        <Container>
            <Wrapper>
                <Title>{t(`common.unsupported-network.title`)}</Title>
                <ExplanationText>{t(`common.unsupported-network.description`)}</ExplanationText>
                {supportedMainnetNetworks.map((supportedNetwork, index) => {
                    const isSecondInRow = (index + 1) % 2 === 0;
                    const prevNetwork = supportedMainnetNetworks[index - 1];
                    if (index < supportedMainnetNetworks.length - 1) {
                        // has next
                        if (isSecondInRow) {
                            return (
                                <ButtonWrapper key={index}>
                                    {getButton(prevNetwork)}
                                    {getButton(supportedNetwork)}
                                </ButtonWrapper>
                            );
                        }
                    } else {
                        // it is last
                        if (isSecondInRow) {
                            return (
                                <ButtonWrapper key={index}>
                                    {getButton(prevNetwork)}
                                    {getButton(supportedNetwork)}
                                </ButtonWrapper>
                            );
                        } else {
                            return <ButtonWrapper key={index}>{getButton(supportedNetwork)}</ButtonWrapper>;
                        }
                    }
                })}
            </Wrapper>
        </Container>
    );
};

const Container = styled.div`
    margin: 90px 0;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin: 0;
    }
`;

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

const StyledBaseLogo = styled(BaseLogo)`
    width: 18px;
    height: 18px;
`;

const BlastLogoWrapper = styled.div`
    width: 18px;
    height: 18px;
    background: radial-gradient(${(props) => props.theme.background.primary} 60%, transparent 40%);
    border-radius: 50%;
`;

export default UnsupportedNetwork;
