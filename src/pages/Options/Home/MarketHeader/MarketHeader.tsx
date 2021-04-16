import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetwork, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumnCentered, Image, Logo } from 'theme/common';
import onboardConnector from 'utils/onboardConnector';
import useETHBalanceQuery from 'queries/walletBalances/useETHBalanceQuery';
import { getIsAppReady } from 'redux/modules/app';
import { truncateAddress } from 'utils/formatters/string';
import avatar from 'assets/images/avatar.svg';

const MarketHeaderWrapper = styled.div`
    padding: 0 75px;
    width: 100%;
    display: flex;
    height: 100px;
    align-items: center;
`;

const ConnectWallet = styled(Button)`
    align-self: center;
    color: white;
    background: #3936c7;
    &:hover {
        background: #44e1e2;
    }
    font-size: 16px;
`;

const UserInfoWrapper = styled(FlexDiv)`
    height: 40px;
    width: 260px;
    background: #44e1e2;
    border-radius: 30px;
    align-items: center;
`;

const EthBalance = styled.p`
    margin: 14px 10px 14px 20px !important;
    flex: 3;
    background: #44e1e2;
    border-radius: 30px;
    font-weight: bold;
    font-size: 13px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.4px;
    color: #f6f6fe;
    text-transform: uppercase;
`;

const NetworkWrapper = styled(FlexDiv)`
    flex: 9;
    background: #3936c7;
    border-radius: 32px;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const AddressWrapper = styled(FlexDivColumnCentered)`
    align-items: center;
    p:first-child {
        margin: 0 10px 10px 28px !important;
        font-weight: bold;
        font-size: 13px;
        line-height: 24px;
        letter-spacing: 0.4px;
        color: #f6f6fe;
    }
    p:last-child {
        margin-top: -16px;
        margin-left: 20px;
        text-transform: capitalize;
        font-weight: bold;
        font-size: 9px;
        line-height: 14px;
        text-align: center;
        letter-spacing: 0.4px;
        color: #f6f6fe;
    }
`;

const MarketHeader: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const network = useSelector((state: RootState) => getNetwork(state));
    const eth = useETHBalanceQuery(walletAddress, network.networkId, { enabled: isAppReady && isWalletConnected });
    return (
        <MarketHeaderWrapper>
            <Logo to={ROUTES.Home}>{t('header.links.home')}</Logo>
            {!isWalletConnected ? (
                <ConnectWallet onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </ConnectWallet>
            ) : (
                <UserInfoWrapper>
                    <EthBalance>{eth.data?.usdBalance.toFixed(2)} SUSD</EthBalance>
                    <NetworkWrapper>
                        <AddressWrapper>
                            <p>{truncateAddress(walletAddress)}</p>
                            <p>{network.networkName}</p>
                        </AddressWrapper>
                        <Image style={{ width: '18px', height: '18px', marginRight: '20px' }} src={avatar}></Image>
                    </NetworkWrapper>
                </UserInfoWrapper>
            )}
        </MarketHeaderWrapper>
    );
};

export default MarketHeader;
