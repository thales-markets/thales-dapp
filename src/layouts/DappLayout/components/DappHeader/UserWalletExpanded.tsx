import React from 'react';
import styled from 'styled-components';

import { truncateAddress } from 'utils/formatters/string';
import { useTranslation } from 'react-i18next';

import { UserCardSectionHeader } from 'theme/common';

import onboardConnector from 'utils/onboardConnector';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';

const UserWalletExpanded: React.FC = () => {
    const truncateAddressNumberOfCharacters = 5;

    const { t } = useTranslation();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    return (
        <Wrapper>
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
            {isWalletConnected && (
                <WalletOptions>
                    <Button style={{ marginRight: '3px' }} onClick={() => onboardConnector.onboard.walletSelect()}>
                        {t('common.user-info-card.switch')}
                    </Button>
                    <Button onClick={() => onboardConnector.disconnectWallet()}>
                        {t('common.user-info-card.disconnect')}
                    </Button>
                </WalletOptions>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: block;
`;

const WalletOptions = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 18px;
    align-items: center;
`;

const Button = styled.div`
    background-color: var(--input-border-color);
    flex: 1;
    font-size: 11px;
    font-family: Titillium Regular !important;
    color: var(--background);
    font-weight: 600;
    border-radius: 20px;
    padding-top: 6px;
    padding-bottom: 6px;
    text-align: center;
    line-height: 17px;
    cursor: pointer;
`;

const WalletContainer = styled.div`
    border: 2px solid var(--icon-color);
    border-radius: 19.5349px;
    width: 100%;
    margin: 9px auto;
    cursor: pointer;
    padding: 5px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 135px;
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

export default UserWalletExpanded;
