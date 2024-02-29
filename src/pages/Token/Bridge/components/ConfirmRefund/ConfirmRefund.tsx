import React, { useState } from 'react';
import snxJSConnector from 'utils/snxJSConnector';
import { useTranslation } from 'react-i18next';
import { getNetworkId, getWalletAddress, switchToNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'components/Button';
import { toast } from 'react-toastify';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { GetTransferStatusRequest, GetTransferStatusResponse } from 'ts-proto/gateway/gateway_pb';
import { WebClient } from 'ts-proto/gateway/GatewayServiceClientPb';
import { generalConfig } from 'config/general';
import { base64, getAddress, hexlify } from 'ethers/lib/utils';
import { refetchCelerBridgeHistory } from 'utils/queryConnector';
import styled, { CSSProperties } from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import OutsideClickHandler from 'react-outside-click-handler';
import { SUPPORTED_NETWORK_IDS_MAP } from 'utils/network';
import { Network } from 'enums/network';
import { useSwitchNetwork } from 'wagmi';

type ConfirmRefundProps = {
    transferId: string;
    srcChainId: number;
};

const ConfirmRefund: React.FC<ConfirmRefundProps> = ({ transferId, srcChainId }) => {
    const { t } = useTranslation();
    const { switchNetwork } = useSwitchNetwork();
    const dispatch = useDispatch();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isNetworkSwitchDropDownOpen, setIsNetworkSwitchDropDownOpen] = useState(false);

    const fetchTransferStatus = async () => {
        const transferStatusRequest = new GetTransferStatusRequest();
        transferStatusRequest.setTransferId(transferId);
        const client = new WebClient(generalConfig.CELER_BRIDGE_URL, null, null);
        const response: GetTransferStatusResponse = await client.getTransferStatus(transferStatusRequest, null);
        return response.toObject();
    };

    const handleSubmit = async () => {
        if (networkId !== srcChainId) {
            setIsNetworkSwitchDropDownOpen(true);
            return;
        }

        const { thalesTokenContract, celerBridgeContract } = snxJSConnector as any;

        if (thalesTokenContract && celerBridgeContract) {
            setIsSubmitting(true);
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

            try {
                const celerBridgeContractWithSigner = celerBridgeContract.connect((snxJSConnector as any).signer);
                const transferStatus = await fetchTransferStatus();

                const wdmsg = base64.decode(transferStatus.wdOnchain.toString());

                const signers = transferStatus.signersList.map((item) => {
                    const decodeSigners = base64.decode(item.toString());
                    const hexlifyObj = hexlify(decodeSigners);
                    return getAddress(hexlifyObj);
                });

                const sigs = transferStatus.sortedSigsList.map((item) => {
                    return base64.decode(item.toString());
                });

                const powers = transferStatus.powersList.map((item) => {
                    return base64.decode(item.toString());
                });

                const tx = await celerBridgeContractWithSigner.withdraw(wdmsg, sigs, signers, powers);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t('thales-token.bridge.history.confirm-refund-button.confirmation-message'),
                            id
                        )
                    );
                    refetchCelerBridgeHistory(walletAddress);
                    setIsSubmitting(false);
                }
                setIsSubmitting(false);
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsSubmitting(false);
            }
        }
    };

    const handleSwitch = async () => {
        await SUPPORTED_NETWORK_IDS_MAP[srcChainId].changeNetwork(srcChainId, () => {
            switchNetwork?.(srcChainId);
            // Trigger App.js init
            // do not use updateNetworkSettings(networkId) as it will trigger queries before provider in App.js is initialized
            dispatch(
                switchToNetworkId({
                    networkId: Number(srcChainId) as Network,
                })
            );
        });
        setIsNetworkSwitchDropDownOpen(false);
    };

    return (
        <Container>
            <OutsideClickHandler
                onOutsideClick={() => isNetworkSwitchDropDownOpen && setIsNetworkSwitchDropDownOpen(false)}
            >
                <Button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    {...defaultButtonProps}
                    additionalStyles={additionalButtonStyles}
                >
                    {!isSubmitting
                        ? t('thales-token.bridge.history.confirm-refund-button.label')
                        : t('thales-token.bridge.history.confirm-refund-button.progress-label')}
                </Button>
                {isNetworkSwitchDropDownOpen && (
                    <NetworkSwitchDropDown>
                        {t('thales-token.bridge.history.switch-message', {
                            network: SUPPORTED_NETWORK_IDS_MAP[srcChainId]?.name,
                        })}
                        <Button onClick={handleSwitch} {...defaultSwitchButtonProps}>
                            {t('thales-token.bridge.history.switch-label')}
                        </Button>
                    </NetworkSwitchDropDown>
                )}
            </OutsideClickHandler>
        </Container>
    );
};

const Container = styled(FlexDivCentered)`
    position: relative;
`;

const NetworkSwitchDropDown = styled(FlexDivColumnCentered)`
    z-index: 9999;
    position: absolute;
    top: -18px;
    right: -8px;
    border-radius: 8px;
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    background: ${(props) => props.theme.background.primary};
    width: 250px;
    max-width: 250px;
    padding: 10px 15px;
    user-select: none;
`;

const defaultButtonProps = {
    fontSize: '12px',
    height: '18px;',
    padding: '0 5px',
    width: '100%',
};

const additionalButtonStyles: CSSProperties = {
    whiteSpace: 'nowrap',
};

const defaultSwitchButtonProps = {
    fontSize: '12px',
    height: '18px;',
    padding: '0 5px',
    margin: '5px 0 0 0',
};

export default ConfirmRefund;
