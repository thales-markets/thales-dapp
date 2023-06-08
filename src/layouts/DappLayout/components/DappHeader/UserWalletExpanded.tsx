import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import Button from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivSpaceBetween } from 'styles/common';
import { truncateAddress } from 'utils/formatters/string';
import { isLedgerDappBrowserProvider } from 'utils/ledger';
import { useDisconnect } from 'wagmi';

const truncateAddressNumberOfCharacters = 5;

const UserWalletExpanded: React.FC = () => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { disconnect } = useDisconnect();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isLedgerLive = isLedgerDappBrowserProvider();

    return (
        <Wrapper>
            <UserCardSectionHeader>{t('common.user-info-card.wallet')}:</UserCardSectionHeader>
            <Container>
                <WalletContainer
                    isClickable={!isWalletConnected}
                    onClick={() => (isWalletConnected ? '' : openConnectModal?.())}
                >
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
                        <Button onClick={openAccountModal}>{t('common.user-info-card.options')}</Button>
                        <Button onClick={() => disconnect()}>{t('common.user-info-card.disconnect')}</Button>
                    </WalletOptions>
                )}
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: block;
`;

const UserCardSectionHeader = styled.span`
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: uppercase;
`;

const Container = styled.div`
    display: contents;
    @media (max-width: 1024px) {
        display: flex;
        align-items: center;
        justiyf-content: flex-start;
    }
`;

const WalletOptions = styled(FlexDivSpaceBetween)`
    margin-bottom: 18px;
    align-items: center;
    @media (max-width: 1024px) {
        flex: 1;
        width: auto;
        margin: 0 auto;
    }
`;

const WalletContainer = styled.div<{ isClickable: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 135px;
    width: 100%;
    margin: 9px auto;
    padding: 4px 12px;
    border: 2px solid ${(props) => props.theme.textColor.primary};
    border-radius: 20px;
    cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};
    @media (max-width: 1024px) {
        flex: 1;
        width: auto;
        max-width: 400px;
        margin: 0;
        margin-right: 10px;
    }
`;

const WalletIcon = styled.i`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 20px;
    padding-right: 5px;
    display: inline;
`;

const WalletAddress = styled.p`
    color: ${(props) => props.theme.textColor.primary};
    font-weight: normal;
    font-size: 12.5px;
    line-height: 14px;
    display: inline;
    text-align: center;
`;

export default UserWalletExpanded;
