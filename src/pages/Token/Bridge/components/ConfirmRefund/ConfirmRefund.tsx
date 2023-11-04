import React, { useState } from 'react';
import snxJSConnector from 'utils/snxJSConnector';
import { useTranslation } from 'react-i18next';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
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
import { CSSProperties } from 'styled-components';

type ConfirmRefundProps = {
    transferId: string;
};

const ConfirmRefund: React.FC<ConfirmRefundProps> = ({ transferId }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const fetchTransferStatus = async () => {
        const transferStatusRequest = new GetTransferStatusRequest();
        transferStatusRequest.setTransferId(transferId);
        const client = new WebClient(generalConfig.CELER_BRIDGE_URL, null, null);
        const response: GetTransferStatusResponse = await client.getTransferStatus(transferStatusRequest, null);
        return response.toObject();
    };

    const handleSubmit = async () => {
        const { thalesTokenContract, celerBridgeContract } = snxJSConnector as any;

        if (thalesTokenContract && celerBridgeContract) {
            setIsSubmitting(true);
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

            try {
                const celerBridgeContractWithSigner = celerBridgeContract.connect((snxJSConnector as any).signer);
                const transferStatus = await fetchTransferStatus();
                console.log(transferStatus);

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

    return (
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
    );
};

const defaultButtonProps = {
    fontSize: '12px',
    height: '18px;',
    padding: '0 5px',
    width: '100%',
};

const additionalButtonStyles: CSSProperties = {
    whiteSpace: 'nowrap',
};

export default ConfirmRefund;
