import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as OpLogo } from 'assets/images/optimism-circle-logo.svg';
import { ReactComponent as EthereumLogo } from 'assets/images/ethereum-circle-logo.svg';
import { ReactComponent as PolygonLogo } from 'assets/images/polygon-circle-logo.svg';
import { ReactComponent as ArbitrumLogo } from 'assets/images/arbitrum-circle-logo.svg';
import { ReactComponent as BSCLogo } from 'assets/images/binance_chain.svg';
import { CircularProgress } from '@material-ui/core';
import { history } from 'utils/routes';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { isNetworkSupported } from 'utils/network';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_MAINNET_NETWORK_IDS_MAP } from 'constants/network';

type LoaderProps = {
    hideMainnet?: boolean;
};

const Loader: React.FC<LoaderProps> = ({ hideMainnet = false }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    useEffect(() => {
        return () => {
            history.location.state = '';
        };
    });
    return (
        <Wrapper>
            {(networkId && !isNetworkSupported(networkId)) || hideMainnet ? (
                <WrongNetworkWrapper>
                    <WrongNetworkText className="pale-grey">{t(`common.unsupported-network.title`)}</WrongNetworkText>

                    <ExplanationText style={{ marginTop: 5 }} className="pale-grey text-s lh32 ls25">
                        {hideMainnet
                            ? t(`common.unsupported-network.description2`)
                            : t(`common.unsupported-network.description`)}
                    </ExplanationText>
                    <ButtonWrapper>
                        <NetworkButton
                            margin={''}
                            onClick={SUPPORTED_MAINNET_NETWORK_IDS_MAP[10].changeNetwork.bind(
                                this,
                                10,
                                undefined,
                                undefined
                            )}
                        >
                            <OpLogo />
                            <span>{t(`common.unsupported-network.button.optimism`)}</span>
                        </NetworkButton>
                        <NetworkButton
                            margin={''}
                            onClick={SUPPORTED_MAINNET_NETWORK_IDS_MAP[137].changeNetwork.bind(
                                this,
                                137,
                                undefined,
                                undefined
                            )}
                        >
                            <PolygonLogo />
                            <span>{t(`common.unsupported-network.button.polygon`)}</span>
                        </NetworkButton>
                    </ButtonWrapper>
                    <ButtonWrapper>
                        <NetworkButton
                            margin={''}
                            onClick={SUPPORTED_MAINNET_NETWORK_IDS_MAP[42161].changeNetwork.bind(
                                this,
                                42161,
                                undefined,
                                undefined
                            )}
                        >
                            <ArbitrumLogo />
                            <span>{t(`common.unsupported-network.button.arbitrum`)}</span>
                        </NetworkButton>
                        <NetworkButton
                            margin={''}
                            onClick={SUPPORTED_MAINNET_NETWORK_IDS_MAP[56].changeNetwork.bind(
                                this,
                                56,
                                undefined,
                                undefined
                            )}
                        >
                            <BSCLogo />
                            <span>{t(`common.unsupported-network.button.bsc`)}</span>
                        </NetworkButton>
                    </ButtonWrapper>
                    <ButtonWrapper>
                        {!hideMainnet && (
                            <NetworkButton
                                margin=""
                                onClick={SUPPORTED_MAINNET_NETWORK_IDS_MAP[1].changeNetwork.bind(
                                    this,
                                    1,
                                    undefined,
                                    undefined
                                )}
                            >
                                <EthereumLogo />
                                <span>{t(`common.unsupported-network.button.mainnet`)}</span>
                            </NetworkButton>
                        )}
                    </ButtonWrapper>
                </WrongNetworkWrapper>
            ) : (
                <CustomCircularProgress />
            )}
        </Wrapper>
    );
};

const CustomCircularProgress = styled(CircularProgress)`
    color: ${(props) => props.theme.background.tertiary};
`;

const Wrapper = styled.div`
    position: absolute;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
    backdrop-filter: blur(4px);
    background: ${(props) => props.theme.background.primary};
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 20px 0px;
`;

const WrongNetworkWrapper = styled.div`
    background: ${(props) => props.theme.background.primary};
    display: flex;
    flex-direction: column;
    max-width: 600px;
    padding: 50px 100px 0 100px;
    text-align: center;
    border: 2px solid var(--color-highlight);
    box-sizing: border-box;
    box-shadow: 0px 0px 90px 10px var(--color-highlight);
    border-radius: 15px;
    @media (max-width: 767px) {
        padding: 5px;
        max-width: calc(100% - 10px);
    }
`;

const WrongNetworkText = styled.p`
    font-weight: 700;
    font-size: 20px;
    line-height: 22px;
    text-align: center;
`;

const ExplanationText = styled.p`
    font-weight: 400;
    font-size: 12px;
    line-height: 13px;
    text-align: center;
`;

const NetworkButton = styled.button<{ margin: string }>`
    display: flex;
    background: ${(props) => props.theme.background.primary};
    border: 1px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 30px;
    cursor: pointer;
    color: #f6f6fe !important;
    align-items: center;
    padding: 6px;
    margin: ${(props) => props.margin};
    & > span {
        margin-left: 6px;
    }
    &:hover {
        box-shadow: var(--button-shadow);
    }
`;

export default Loader;
