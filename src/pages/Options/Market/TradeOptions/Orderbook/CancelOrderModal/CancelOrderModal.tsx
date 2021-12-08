import ValidationMessage from 'components/ValidationMessage';
import { ethers } from 'ethers';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { DefaultSubmitButton, SubmitButtonContainer } from 'pages/Options/Market/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { OptionSide, OrderItem } from 'types/options';
import { cancelOrder } from 'utils/1inch';
import { formatGasLimit } from 'utils/network';
import { refetchOrderbook, refetchOrders } from 'utils/queryConnector';
import OrderDetails from '../../components/OrderDetails';
import {
    CloseIconContainer,
    ModalContainer,
    ModalHeader,
    ModalSummaryContainer,
    ModalTitle,
    StyledModal,
} from '../components';

type CancelOrderModalProps = {
    order: OrderItem;
    baseToken: string;
    onClose: () => void;
    optionSide: OptionSide;
};

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ onClose, order, baseToken, optionSide }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [isCanceling, setIsCanceling] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const isButtonDisabled = !isWalletConnected || isCanceling;

    useEffect(() => {
        const fetchGasLimit = async () => {
            try {
                const provider = new ethers.providers.Web3Provider((window as any).ethereum);
                const gasPrice = await provider.getGasPrice();

                setGasLimit(formatGasLimit(gasPrice, networkId));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled]);

    const handleCancelOrder = async () => {
        setTxErrorMessage(null);
        setIsCanceling(true);
        try {
            await cancelOrder(networkId, walletAddress, order.orderData, gasLimit !== null ? gasLimit : undefined);
            refetchOrderbook(baseToken);
            refetchOrders(networkId);
            onClose();
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsCanceling(false);
        }
    };

    return (
        <StyledModal open disableBackdropClick onClose={onClose}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>{t(`options.market.trade-options.cancel-order.title`)}</ModalTitle>
                    <CloseIconContainer onClick={onClose} />
                </ModalHeader>
                <OrderDetails order={order.displayOrder} optionSide={optionSide} />
                <ModalSummaryContainer>
                    <NetworkFees gasLimit={gasLimit} disabled={isCanceling} />
                </ModalSummaryContainer>
                <SubmitButtonContainer>
                    <DefaultSubmitButton disabled={isButtonDisabled || !gasLimit} onClick={handleCancelOrder}>
                        {!isCanceling
                            ? t('options.market.trade-options.cancel-order.confirm-button.label')
                            : t('options.market.trade-options.cancel-order.confirm-button.progress-label')}
                    </DefaultSubmitButton>
                </SubmitButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </ModalContainer>
        </StyledModal>
    );
};

export default CancelOrderModal;
