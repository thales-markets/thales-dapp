import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { truncateAddress } from 'utils/formatters/string';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress, switchToNetworkId } from 'redux/modules/wallet';
import { buildHref, navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { SUPPORTED_MAINNET_NETWORK_IDS_MAP } from 'constants/network';
import OutsideClickHandler from 'react-outside-click-handler';
import { isLedgerDappBrowserProvider } from 'utils/ledger';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { NetworkId, hasEthereumInjected } from 'utils/network';

const UserWallet: React.FC = () => {
    const truncateAddressNumberOfCharacters = 5;

    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const dispatch = useDispatch();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    // TODO: add support for testnets
    const selectedNetwork = useMemo(
        () => SUPPORTED_MAINNET_NETWORK_IDS_MAP[networkId] || SUPPORTED_MAINNET_NETWORK_IDS_MAP[10],
        [networkId]
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isLedgerLive = isLedgerDappBrowserProvider();

    const { trackEvent } = useMatomo();

    return (
        <Wrapper>
            <WrapperContainer>
                <WalletContainer
                    connected={isWalletConnected}
                    onClick={() => {
                        if (isWalletConnected) {
                            trackEvent({
                                category: 'dAppHeader',
                                action: 'click-on-wallet-when-connected',
                            });
                        }
                        isWalletConnected ? navigateTo(buildHref(ROUTES.Options.Profile)) : openConnectModal?.();
                    }}
                >
                    {walletAddress
                        ? truncateAddress(
                              walletAddress,
                              truncateAddressNumberOfCharacters,
                              truncateAddressNumberOfCharacters
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
                                <Arrow className={`icon icon--arrow-down`} />
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
            </WrapperContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: block;
    position: absolute;
    top: 40px;
    right: 100px;
    width: 260px;
    @media (max-width: 1024px) {
        right: 70px;
        top: 20px;
    }

    @media (max-width: 500px) {
        right: 55px;
        top: 20px;
        width: 130px;
    }
`;

const WrapperContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${(props) => props.theme.borderColor.secondary};
    border-radius: 8px;
    @media (max-width: 500px) {
        height: 32px;
    }
`;

const WalletContainer = styled.div<{ connected: boolean }>`
    width: 100%;
    cursor: ${(props) => (props.connected ? 'text' : 'pointer')};
    padding: 5px 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 130px;
    cursor: pointer;
    border-right: 2px solid ${(props) => props.theme.borderColor.secondary};
    color: ${(props) => props.theme.textColor.primary};
    font-weight: normal;
    font-size: 12.5px;
    text-align: center;
    @media (max-width: 500px) {
        border: none;
    }
`;

const NetworkInfoContainer = styled.div`
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
    top: 35px;
    left: 130px;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    background-color: var(--background);
    border: 1px solid rgba(100, 217, 254, 0.5);
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
    padding: ${(props) => (props.selectedItem ? '6px 13px' : '6px')};
    font-size: 14px;
`;

const Arrow = styled.i`
    margin-left: 7px;
    margin-top: 2px;
    font-size: 10px;
    text-transform: none;
`;

export default UserWallet;
