import { L1_TO_L2_NETWORK_MAPPER, SUPPORTED_NETWORKS_PARAMS } from 'constants/network';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumnCentered, FlexDivRowCentered } from 'styles/common';
import { Network } from 'enums/network';

const NetworkSwitch: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const switchOrAddOptimismNetwork = async () => {
        const switchTo = L1_TO_L2_NETWORK_MAPPER[networkId] ?? Network.OptimismMainnet;
        const optimismNetworkParms = SUPPORTED_NETWORKS_PARAMS[switchTo];

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

    return (
        <FlexDivRowCentered>
            <Container>
                <OptimismButton onClick={switchOrAddOptimismNetwork}>
                    <InnerButton>
                        <FlexDiv>{t('common.switch-to-l2')}</FlexDiv>
                    </InnerButton>
                </OptimismButton>
            </Container>
        </FlexDivRowCentered>
    );
};

const Container = styled(FlexDivColumnCentered)`
    width: 170px;
    margin-right: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
        margin-bottom: 20px;
        margin-right: 0px;
    }
`;

const OptimismButton = styled.button`
    position: relative;
    width: 170px;
    height: 40px;
    border: none;
    background: ${(props) => props.theme.button.background.primary};
    padding: 1px;
    border-radius: 23px;
    color: ${(props) => props.theme.button.textColor.primary};
    path {
        fill: ${(props) => props.theme.button.textColor.primary};
    }
    &:hover {
        cursor: pointer;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
    }
`;

const InnerButton = styled(FlexDivRowCentered)`
    background: ${(props) => props.theme.button.background.primary};
    border-radius: 23px;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    height: 100%;
    padding-left: 20px;
    padding-right: 20px;
    justify-content: center;
`;

export default NetworkSwitch;