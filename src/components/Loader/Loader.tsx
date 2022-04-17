import React, { useEffect } from 'react';
import styled from 'styled-components';
import coin from 'assets/images/only_coin.gif';
import angry from 'assets/images/angry_thales.gif';
import { ReactComponent as OpLogo } from 'assets/images/optimism-circle-logo.svg';
import { ReactComponent as EthereumLogo } from 'assets/images/ethereum-circle-logo.svg';
import { ReactComponent as PolygonLogo } from 'assets/images/polygon-circle-logo.svg';
import { CircularProgress } from '@material-ui/core';
import { FlexDivRowCentered, Image } from 'theme/common';
import { history } from 'utils/routes';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { isNetworkSupported } from 'utils/network';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_MAINNET_NETWORK_IDS_MAP } from '../../constants/network';

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
                    <Image style={{ width: 150, height: 150, margin: 'auto' }} src={angry} />
                    <WrongNetworkText className="pale-grey">{t(`common.unsupported-network.title`)}</WrongNetworkText>

                    <ExplanationText style={{ marginTop: 5 }} className="pale-grey text-s lh32 ls25">
                        {hideMainnet
                            ? t(`common.unsupported-network.description2`)
                            : t(`common.unsupported-network.description`)}
                    </ExplanationText>
                    <FlexDivRowCentered style={{ justifyContent: 'space-around' }}>
                        <NetworkButton
                            margin={hideMainnet ? '40px 0px' : '40px 0 0 0'}
                            onClick={SUPPORTED_MAINNET_NETWORK_IDS_MAP[10].changeNetwork.bind(this, 10, undefined)}
                        >
                            <OpLogo />
                            <span>{t(`common.unsupported-network.button.optimism`)}</span>
                        </NetworkButton>
                        <NetworkButton
                            margin={hideMainnet ? '40px 0px' : '40px 0 0 0'}
                            onClick={SUPPORTED_MAINNET_NETWORK_IDS_MAP[137].changeNetwork.bind(this, 137, undefined)}
                        >
                            <PolygonLogo />
                            <span>{t(`common.unsupported-network.button.polygon`)}</span>
                        </NetworkButton>
                    </FlexDivRowCentered>
                    <FlexDivRowCentered
                        style={hideMainnet ? { justifyContent: 'center' } : { justifyContent: 'space-around' }}
                    >
                        {!hideMainnet && (
                            <NetworkButton
                                margin="20px 0 40px 0"
                                onClick={SUPPORTED_MAINNET_NETWORK_IDS_MAP[1].changeNetwork.bind(this, 1, undefined)}
                            >
                                <EthereumLogo />
                                <span>{t(`common.unsupported-network.button.mainnet`)}</span>
                            </NetworkButton>
                        )}
                    </FlexDivRowCentered>
                </WrongNetworkWrapper>
            ) : history.location.pathname === '/' ? (
                <CircularProgress />
            ) : history.location.state === 'show' ? (
                <Image style={{ width: 100, height: 100 }} src={coin}></Image>
            ) : (
                <CircularProgress />
            )}
        </Wrapper>
    );
};

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
`;

const WrongNetworkWrapper = styled.div`
    background: #04045a;
    display: flex;
    flex-direction: column;
    max-width: 600px;
    padding: 0 100px;
    text-align: center;
    border: 2px solid #64d9fe;
    box-sizing: border-box;
    box-shadow: 0px 0px 90px 10px #64d9fe;
    border-radius: 15px;
    @media (max-width: 767px) {
        padding: 5px;
        max-width: calc(100% - 10px);
    }
`;

const WrongNetworkText = styled.p`
    font-family: 'Sansation' !important;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 22px;
    text-align: center;
`;

const ExplanationText = styled.p`
    font-family: 'Sansation' !important;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 13px;
    text-align: center;
`;

const NetworkButton = styled.button<{ margin: string }>`
    display: flex;
    font-family: 'Sansation' !important;
    background: #04045a;
    border: 1px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 30px;
    cursor: pointer;
    color: #f6f6fe !important;
    align-items: center;
    padding: 6px;
    margin: ${(props) => props.margin};
    & > span {
        font-family: 'Sansation' !important;
        margin-left: 6px;
    }
    &:hover {
        box-shadow: var(--button-shadow);
    }
`;

export default Loader;
