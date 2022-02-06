import React from 'react';
import styled from 'styled-components';

import SwitchInput from 'components/SwitchInput/SwitchInput';
import { FlexDivRow, UserCardSectionHeader } from 'theme/common';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsOVM } from 'utils/network';
import { getNetworkId } from 'redux/modules/wallet';
import { hexStripZeros } from '@ethersproject/bytes';
import { BigNumber } from '@ethersproject/bignumber';

import { NetworkId } from '@synthetixio/contracts-interface';

import { L1_TO_L2_NETWORK_MAPPER, L2_TO_L1_NETWORK_MAPPER, OPTIMISM_NETWORKS } from 'constants/network';

export const NetworkSwitch: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const switchOrAddOptimismNetwork = async () => {
        const switchTo = L1_TO_L2_NETWORK_MAPPER[networkId] ?? NetworkId['Mainnet-Ovm'];
        const optimismNetworkParms = OPTIMISM_NETWORKS[switchTo];

        if (typeof window.ethereum !== 'undefined') {
            try {
                await (window.ethereum as any).request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: optimismNetworkParms.chainId }],
                });
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                    try {
                        await (window.ethereum as any).request({
                            method: 'wallet_addEthereumChain',
                            params: [optimismNetworkParms],
                        });
                        await (window.ethereum as any).request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: optimismNetworkParms.chainId }],
                        });
                    } catch (addError) {
                        console.log(addError);
                    }
                } else {
                    console.log(switchError);
                }
            }
        }
    };

    const switchToL1 = async () => {
        const formattedChainId = hexStripZeros(BigNumber.from(L2_TO_L1_NETWORK_MAPPER[networkId]).toHexString());

        if (typeof window.ethereum !== 'undefined') {
            try {
                await (window.ethereum as any).request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: formattedChainId }],
                });
            } catch (switchError: any) {
                console.log(switchError);
            }
        }
    };

    return (
        <NetworkSwitchContainer>
            <SectionHeader>{t('common.user-info-card.network')}</SectionHeader>
            <SwitchContainer>
                <NetworkIcon active={isL2} className="sidebar-icon icon--optimism" />
                <SwitchInput
                    value={!isL2 ? true : false}
                    clickEventHandler={async () => (isL2 ? await switchToL1() : await switchOrAddOptimismNetwork())}
                />
                <NetworkIcon active={!isL2} style={{ marginRight: '0px' }} className="sidebar-icon icon--ethereum" />
            </SwitchContainer>
        </NetworkSwitchContainer>
    );
};

const NetworkSwitchContainer = styled(FlexDivRow)`
    width: 100%;
    align-items: center;
    margin: 16px 0px;
`;

const SectionHeader = styled(UserCardSectionHeader)`
    display: inline-block;
`;

const NetworkIcon = styled.i<{ active: boolean }>`
    font-size: 17px;
    display: inline;
    color: ${(props: any) => (props.active ? 'var(--icon-color)' : '#8181ac')};
    margin-right: 5px;
    margin-left: 5px;
`;

const SwitchContainer = styled.div`
    display: flex;
    align-items: center;
`;

export default NetworkSwitch;
