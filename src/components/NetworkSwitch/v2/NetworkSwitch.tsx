import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FlexDivColumn, UserCardSectionHeader } from 'theme/common';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { SUPPORTED_MAINNET_NETWORK_IDS_MAP } from 'constants/network';
import OutsideClickHandler from 'react-outside-click-handler';
import { isLedgerDappBrowserProvider } from 'utils/ledger';

type Properties = {
    setShowCard: (showCard: boolean) => void;
};

export const NetworkSwitch: React.FC<Properties> = ({ setShowCard }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    // TODO: add support for testnets
    const selectedNetwork = useMemo(
        () => SUPPORTED_MAINNET_NETWORK_IDS_MAP[networkId] || SUPPORTED_MAINNET_NETWORK_IDS_MAP[10],
        [networkId]
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isLedgerLive = isLedgerDappBrowserProvider();

    return (
        <NetworkSwitchContainer>
            <SectionHeader>{t('common.user-info-card.network')}</SectionHeader>
            <RelativeContainer>
                <OutsideClickHandler onOutsideClick={() => isDropdownOpen && setIsDropdownOpen(false)}>
                    <SelectedNetworkContainer
                        dropdownOpen={isDropdownOpen}
                        cursor={isLedgerLive ? 'initial' : 'pointer'}
                    >
                        {!isDropdownOpen ? (
                            <NetworkItem onClick={() => setIsDropdownOpen(!isDropdownOpen && !isLedgerLive)}>
                                {React.createElement(selectedNetwork.icon)}
                                {selectedNetwork.name}
                            </NetworkItem>
                        ) : (
                            Object.keys(SUPPORTED_MAINNET_NETWORK_IDS_MAP).map((id) => (
                                <NetworkItem
                                    dropdownOpen={isDropdownOpen}
                                    key={id}
                                    onClick={() => {
                                        setIsDropdownOpen(!isDropdownOpen);
                                        SUPPORTED_MAINNET_NETWORK_IDS_MAP[id].changeNetwork(+id, () => {
                                            setShowCard(false);
                                        });
                                    }}
                                >
                                    {React.createElement(SUPPORTED_MAINNET_NETWORK_IDS_MAP[id].icon, {
                                        height: '18px',
                                        width: '18px',
                                    })}
                                    {SUPPORTED_MAINNET_NETWORK_IDS_MAP[id].name}
                                </NetworkItem>
                            ))
                        )}
                    </SelectedNetworkContainer>
                </OutsideClickHandler>
            </RelativeContainer>
        </NetworkSwitchContainer>
    );
};

const NetworkSwitchContainer = styled(FlexDivColumn)`
    width: 100%;
    align-items: center;
    margin: 16px 0px;
    svg {
        margin-right: 5px;
    }
    @media (min-width: 500px) {
        display: none;
    }
`;

const SectionHeader = styled(UserCardSectionHeader)`
    align-self: self-start;
`;

const SelectedNetworkContainer = styled.div<{ dropdownOpen: boolean; cursor: string }>`
    position: ${(props) => (props.dropdownOpen ? 'absolute' : 'relative')};
    left: 0;
    right: 0;
    background-color: var(--background);
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 135px;
    width: 135px;
    margin: 9px auto;
    border: 2px solid var(--icon-color);
    color: var(--icon-color);
    border-radius: 20px;
    cursor: ${(props) => props.cursor};
    flex-direction: column;
    z-index: 1;
    @media (max-width: 1024px) {
        flex: 1;
        width: auto;
        max-width: 400px;
        margin: 0;
        margin-right: 10px;
    }
`;

const NetworkItem = styled.div<{ dropdownOpen?: boolean }>`
    font-family: 'Sansation' !important;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 6px 22px;
    font-size: 14px;
`;

const RelativeContainer = styled.div`
    height: 30px;
`;

export default NetworkSwitch;
