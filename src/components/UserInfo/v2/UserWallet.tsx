import React from 'react';
import styled from 'styled-components';

import { truncateAddress } from 'utils/formatters/string';
import { useTranslation } from 'react-i18next';

import { UserCardSectionHeader } from 'theme/common';

import onboardConnector from 'utils/onboardConnector';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';

const UserWallet: React.FC = () => {
    const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;

    const { t } = useTranslation();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    return (
        <>
            <UserCardSectionHeader>{t('common.user-info-card.wallet')}</UserCardSectionHeader>
            <WalletContainer onClick={() => (isWalletConnected ? '' : onboardConnector.connectWallet())}>
                <WalletIcon className="sidebar-icon icon--wallet" />
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
        </>
    );
};

const WalletContainer = styled.div`
    border: 2px solid var(--icon-color);
    border-radius: 19.5349px;
    width: 100%;
    margin: 9px auto;
    cursor: pointer;
`;

const WalletIcon = styled.i`
    color: var(--icon-color);
    font-size: 20px;
    padding: 6px 13px 6px 13px;
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
