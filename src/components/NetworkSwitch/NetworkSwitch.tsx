import { DEFAULT_NETWORK } from 'constants/network';
import { Network } from 'enums/network';
import React, { useMemo, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useDispatch, useSelector } from 'react-redux';
import { getNetworkId, switchToNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled from 'styled-components';
import { isLedgerDappBrowserProvider } from 'utils/ledger';
import { SUPPORTED_NETWORK_IDS_MAP } from 'utils/network';
import { useSwitchNetwork } from 'wagmi';

type NetworkSwitchProps = {
    selectedNetworkId?: number;
    setSelectedNetworkId?: any;
    supportedNetworks?: number[];
};

const NetworkSwitch: React.FC<NetworkSwitchProps> = ({
    selectedNetworkId,
    setSelectedNetworkId,
    supportedNetworks,
}) => {
    const { switchNetwork } = useSwitchNetwork();
    const dispatch = useDispatch();

    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const filteredSupportedNetworks: Record<number, any> = useMemo(
        () =>
            supportedNetworks
                ? Object.keys(SUPPORTED_NETWORK_IDS_MAP)
                      .filter((key) => supportedNetworks.includes(Number(key)))
                      .reduce((obj, key) => {
                          return Object.assign(obj, {
                              [key]: SUPPORTED_NETWORK_IDS_MAP[Number(key)],
                          });
                      }, {})
                : SUPPORTED_NETWORK_IDS_MAP,
        [supportedNetworks]
    );

    // TODO: add support for testnets
    const selectedNetwork = useMemo(
        () =>
            filteredSupportedNetworks[selectedNetworkId || networkId] ||
            filteredSupportedNetworks[DEFAULT_NETWORK.networkId],
        [networkId, selectedNetworkId, filteredSupportedNetworks]
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isLedgerLive = isLedgerDappBrowserProvider();

    return (
        <NetworkInfoContainer>
            <OutsideClickHandler onOutsideClick={() => isDropdownOpen && setIsDropdownOpen(false)}>
                <SelectedNetworkContainer cursor={isLedgerLive ? 'initial' : 'pointer'}>
                    <NetworkItem
                        selectedItem={true}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen && !isLedgerLive)}
                        noHover
                    >
                        {React.createElement(selectedNetwork.icon, {
                            style: { marginRight: 5 },
                        })}
                        <NetworkName>{selectedNetwork.name}</NetworkName>
                        {<Icon className={isDropdownOpen ? `icon icon--caret-up` : `icon icon--caret-down`} />}
                    </NetworkItem>
                    {isDropdownOpen && (
                        <NetworkDropDown>
                            {Object.keys(filteredSupportedNetworks)
                                .map((key) => {
                                    return { id: Number(key), ...filteredSupportedNetworks[Number(key)] };
                                })
                                .sort((a, b) => a.order - b.order)
                                .map((network, index) => (
                                    <NetworkItem
                                        key={index}
                                        onClick={async () => {
                                            setIsDropdownOpen(!isDropdownOpen);
                                            if (setSelectedNetworkId) {
                                                setSelectedNetworkId(Number(network.id));
                                            } else {
                                                await filteredSupportedNetworks[network.id].changeNetwork(
                                                    network.id,
                                                    () => {
                                                        switchNetwork?.(network.id);
                                                        // Trigger App.js init
                                                        // do not use updateNetworkSettings(networkId) as it will trigger queries before provider in App.js is initialized
                                                        dispatch(
                                                            switchToNetworkId({
                                                                networkId: Number(network.id) as Network,
                                                            })
                                                        );
                                                    }
                                                );
                                            }
                                        }}
                                    >
                                        {React.createElement(filteredSupportedNetworks[network.id].icon, {
                                            height: '18px',
                                            width: '18px',
                                            style: { marginRight: 5 },
                                        })}
                                        {filteredSupportedNetworks[network.id].name}
                                    </NetworkItem>
                                ))}
                        </NetworkDropDown>
                    )}
                </SelectedNetworkContainer>
            </OutsideClickHandler>
        </NetworkInfoContainer>
    );
};

const NetworkInfoContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const NetworkDropDown = styled.div`
    z-index: 9999;
    position: absolute;
    top: 30px;
    right: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    width: 136px;
    max-width: 136px;
    padding: 5px;
    justify-content: center;
    align-items: center;
    gap: 5px;
    @media (max-width: 500px) {
        width: 110px;
    }
`;

const SelectedNetworkContainer = styled.div<{ cursor: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 136px;
    width: 136px;
    color: ${(props) => props.theme.textColor.primary};
    cursor: ${(props) => props.cursor};
    flex-direction: column;
    z-index: 1;
    @media (max-width: 500px) {
        width: 110px;
    }
`;

const NetworkItem = styled.div<{ selectedItem?: boolean; noHover?: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: ${(props) => (props.selectedItem ? '4px 13px' : '6px')};
    font-size: 13px;
    border-radius: 8px;
    &:hover {
        background: ${(props) => (props.noHover ? '' : props.theme.background.primary)};
    }
    svg {
        width: 16px;
        height: 16px;
    }
    @media (max-width: 500px) {
        ${(props) => (props.selectedItem ? 'padding: 4px 7px' : '')}
    }
`;

const NetworkName = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Icon = styled.i`
    margin-left: auto;
    font-size: 10px;
    color: ${(props) => props.theme.textColor.primary};
`;

export default NetworkSwitch;
