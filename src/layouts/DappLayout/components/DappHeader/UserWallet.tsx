import React from 'react';
import styled from 'styled-components';

import { truncateAddress } from 'utils/formatters/string';
import { useTranslation } from 'react-i18next';

import onboardConnector from 'utils/onboardConnector';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';

const UserWallet: React.FC = () => {
    const truncateAddressNumberOfCharacters = 5;

    const { t } = useTranslation();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <Wrapper>
            <WalletContainer onClick={() => (isWalletConnected ? '' : onboardConnector.connectWallet())}>
                <WalletIcon
                    className={` ${networkId === 10 ? 'v2-icon v2-icon--op' : 'sidebar-icon icon--ethereum'}`}
                />
                <WalletAddress>
                    {walletAddress
                        ? truncateAddress(
                              walletAddress,
                              truncateAddressNumberOfCharacters,
                              truncateAddressNumberOfCharacters
                          )
                        : t('common.wallet.connect-your-wallet')}
                </WalletAddress>
            </WalletContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: block;
    position: absolute;
    top: 0;
    right: 90px;
    @media (max-width: 1024px) {
        right: 70px;
        top: 20px;
    }

    @media (max-width: 400px) {
        right: 55px;
        top: 20px;
    }
`;

const WalletContainer = styled.div`
    border: 1px solid rgba(100, 217, 254, 0.5);
    border-radius: 19.5349px;
    width: 100%;
    cursor: pointer;
    padding: 5px 12px;
    padding-left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 150px;
`;

const WalletIcon = styled.i`
    color: var(--icon-color);
    font-size: 20px;
    padding-right: 5px;
    display: inline;
`;

const WalletAddress = styled.p`
    color: var(--icon-color);
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 12.5px;
    line-height: 14px;
    display: inline;
    text-align: center;
`;

export default UserWallet;
