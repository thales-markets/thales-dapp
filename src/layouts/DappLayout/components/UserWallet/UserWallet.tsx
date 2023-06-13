import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { truncateAddress } from 'utils/formatters/string';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress, switchToNetworkId } from 'redux/modules/wallet';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { SUPPORTED_MAINNET_NETWORK_IDS_MAP } from 'constants/network';
import OutsideClickHandler from 'react-outside-click-handler';
import { isLedgerDappBrowserProvider } from 'utils/ledger';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { NetworkId, defaultNetwork, hasEthereumInjected } from 'utils/network';
import UserSwap from '../UserSwap';

const TRUNCATE_ADDRESS_NUMBER_OF_CHARS = 5;

const UserWallet: React.FC = () => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const dispatch = useDispatch();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [walletText, setWalletText] = useState('');

    // TODO: add support for testnets
    const selectedNetwork = useMemo(
        () =>
            SUPPORTED_MAINNET_NETWORK_IDS_MAP[networkId] || SUPPORTED_MAINNET_NETWORK_IDS_MAP[defaultNetwork.networkId],
        [networkId]
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isLedgerLive = isLedgerDappBrowserProvider();

    const { trackEvent } = useMatomo();

    return (
        <Container isWalletConnected={isWalletConnected}>
            <Wrapper>
                <UserSwap />
                <WalletContainer
                    connected={isWalletConnected}
                    onClick={() => {
                        if (isWalletConnected) {
                            trackEvent({
                                category: 'dAppHeader',
                                action: 'click-on-wallet-when-connected',
                            });
                        }
                        isWalletConnected ? openAccountModal?.() : openConnectModal?.();
                    }}
                    onMouseOver={() => setWalletText(t('common.wallet.wallet-options'))}
                    onMouseLeave={() => setWalletText('')}
                >
                    {walletAddress
                        ? walletText ||
                          truncateAddress(
                              walletAddress,
                              TRUNCATE_ADDRESS_NUMBER_OF_CHARS,
                              TRUNCATE_ADDRESS_NUMBER_OF_CHARS
                          )
                        : t('common.wallet.connect-your-wallet')}
                </WalletContainer>
                <NetworkInfoContainer>
                    <OutsideClickHandler onOutsideClick={() => isDropdownOpen && setIsDropdownOpen(false)}>
                        <SelectedNetworkContainer cursor={isLedgerLive ? 'initial' : 'pointer'}>
                            <NetworkItem
                                selectedItem={true}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen && !isLedgerLive)}
                            >
                                {React.createElement(selectedNetwork.icon, {
                                    style: { marginRight: 5 },
                                })}
                                {selectedNetwork.name}
                                <Icon className={isDropdownOpen ? `icon icon--caret-up` : `icon icon--caret-down`} />
                            </NetworkItem>
                            {isDropdownOpen && (
                                <NetworkDropDown>
                                    {Object.keys(SUPPORTED_MAINNET_NETWORK_IDS_MAP).map((id) => (
                                        <NetworkItem
                                            key={id}
                                            onClick={() => {
                                                if (hasEthereumInjected()) {
                                                    setIsDropdownOpen(!isDropdownOpen);
                                                    SUPPORTED_MAINNET_NETWORK_IDS_MAP[id].changeNetwork(+id, undefined);
                                                }
                                                // Trigger App.js init
                                                // do not use updateNetworkSettings(networkId) as it will trigger queries before provider in App.js is initialized
                                                dispatch(switchToNetworkId({ networkId: Number(id) as NetworkId }));
                                            }}
                                        >
                                            {React.createElement(SUPPORTED_MAINNET_NETWORK_IDS_MAP[id].icon, {
                                                height: '18px',
                                                width: '18px',
                                                style: { marginRight: 5 },
                                            })}
                                            {SUPPORTED_MAINNET_NETWORK_IDS_MAP[id].name}
                                        </NetworkItem>
                                    ))}
                                </NetworkDropDown>
                            )}
                        </SelectedNetworkContainer>
                    </OutsideClickHandler>
                </NetworkInfoContainer>
            </Wrapper>
        </Container>
    );
};

const Container = styled.div<{ isWalletConnected: boolean }>`
    width: 400px;
    @media (max-width: 500px) {
        width: 270px;
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${(props) => props.theme.borderColor.secondary};
    border-radius: 8px;
    @media (max-width: 500px) {
        height: 26px;
    }
`;

const WalletContainer = styled.div<{ connected: boolean }>`
    width: 100%;
    min-width: 120px;
    cursor: ${(props) => (props.connected ? 'text' : 'pointer')};
    padding: 4px 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-left: 2px solid ${(props) => props.theme.borderColor.secondary};
    border-right: 2px solid ${(props) => props.theme.borderColor.secondary};
    color: ${(props) => props.theme.textColor.primary};
    font-weight: normal;
    font-size: 13px;
    text-align: center;
    @media (max-width: 500px) {
        min-width: fit-content;
        border-right: none;
        padding: 4px 10px;
    }
`;

const NetworkInfoContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 500px) {
        display: none;
    }
`;

const NetworkDropDown = styled.div`
    z-index: 1000;
    position: absolute;
    top: 30px;
    right: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    width: 130px;
    max-width: 130px;
    padding: 5px;
    justify-content: center;
    align-items: center;
    gap: 5px;
`;

const SelectedNetworkContainer = styled.div<{ cursor: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 130px;
    width: 130px;
    color: ${(props) => props.theme.textColor.primary};
    cursor: ${(props) => props.cursor};
    flex-direction: column;
    z-index: 1;
`;

const NetworkItem = styled.div<{ selectedItem?: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: ${(props) => (props.selectedItem ? '4px 13px' : '6px')};
    font-size: 13px;
    border-radius: 8px;
    &:hover {
        background: ${(props) => props.theme.background.primary};
    }
    svg {
        width: 16px;
        height: 16px;
    }
`;

const Icon = styled.i`
    margin-left: auto;
    font-size: 10px;
    color: ${(props) => props.theme.textColor.primary};
`;

export default UserWallet;
