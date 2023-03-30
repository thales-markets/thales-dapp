import React from 'react';
import styled from 'styled-components';
import { truncateAddress } from 'utils/formatters/string';
import { useTranslation } from 'react-i18next';
import { UserCardSectionHeader } from 'theme/common';
import onboardConnector from 'utils/onboardConnector';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { isLedgerDappBrowserProvider } from 'utils/ledger';

const truncateAddressNumberOfCharacters = 5;

const UserWalletExpanded: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isLedgerLive = isLedgerDappBrowserProvider();

    return (
        <Wrapper>
            <UserCardSectionHeader>{t('common.user-info-card.wallet')}</UserCardSectionHeader>
            <Container>
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
                {isWalletConnected && !isLedgerLive && (
                    <WalletOptions>
                        <Button style={{ marginRight: '3px' }} onClick={() => onboardConnector.onboard.walletSelect()}>
                            {t('common.user-info-card.switch')}
                        </Button>
                        <Button onClick={() => onboardConnector.disconnectWallet()}>
                            {t('common.user-info-card.disconnect')}
                        </Button>
                    </WalletOptions>
                )}
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: block;
`;

const Container = styled.div`
    display: contents;
    @media (max-width: 1024px) {
        display: flex;
        align-items: center;
        justiyf-content: flex-start;
    }
`;

const WalletOptions = styled.div`
    display: flex;
    margin-bottom: 18px;
    align-items: center;
    @media (max-width: 1024px) {
        flex: 1;
        width: auto;
        margin: 0 auto;
    }
`;

const Button = styled.div`
    background-color: var(--input-border-color);
    flex: 1;
    font-size: 13px;
    font-family: Roboto !important;
    color: var(--background);
    font-weight: 600;
    border-radius: 20px;
    padding-top: 6px;
    padding-bottom: 6px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
`;

const WalletContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 135px;
    width: 100%;
    margin: 9px auto;
    padding: 4px 12px;
    border: 2px solid var(--color-white);
    border-radius: 20px;
    @media (max-width: 1024px) {
        flex: 1;
        width: auto;
        max-width: 400px;
        margin: 0;
        margin-right: 10px;
    }
`;

const WalletIcon = styled.i`
    color: var(--color-white);
    font-size: 20px;
    padding-right: 5px;
    display: inline;
`;

const WalletAddress = styled.p`
    color: var(--color-white);
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 12.5px;
    line-height: 14px;
    display: inline;
    text-align: center;
`;

export default UserWalletExpanded;
