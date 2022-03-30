import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import NetworkFees from 'pages/AMMTrading/components/AMM/components/NetworkFees';
import Divider from 'pages/AMMTrading/components/AMM/styled-components/Divider';
// import Divider from 'pages/AMMTrading/components/AMM/styled-components/Divider';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { OptionSide, OrderItem } from 'types/options';
import { cancelOrder, getCancelOrderData } from 'utils/1inch';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import { refetchOrderbook, refetchOrders } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import OrderDetails from '../../components/OrderDetails';
import { CloseIconContainer, ModalContainer, ModalHeader, ModalTitle, StyledModal } from '../components';

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
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);

    const isButtonDisabled = !isWalletConnected || isCanceling;

    useEffect(() => {
        const fetchL1Fee = async (limitOrderProtocol1inchContractWithSigner: any, cancelOrderData: any) => {
            const txRequest = await limitOrderProtocol1inchContractWithSigner.populateTransaction.cancelOrder(
                cancelOrderData
            );
            return getL1FeeInWei(txRequest);
        };

        const fetchGasLimit = async () => {
            try {
                const { limitOrderProtocol1inchContract } = snxJSConnector as any;
                const limitOrderProtocol1inchContractWithSigner = limitOrderProtocol1inchContract.connect(
                    (snxJSConnector as any).signer
                );
                const cancelOrderData = getCancelOrderData(order.orderData);

                if (isL2) {
                    const [gasEstimate, l1FeeInWei] = await Promise.all([
                        limitOrderProtocol1inchContractWithSigner.estimateGas.cancelOrder(cancelOrderData),
                        fetchL1Fee(limitOrderProtocol1inchContractWithSigner, cancelOrderData),
                    ]);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                    setL1Fee(l1FeeInWei);
                } else {
                    const gasEstimate = await limitOrderProtocol1inchContractWithSigner.estimateGas.cancelOrder(
                        getCancelOrderData(order.orderData)
                    );
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                }
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
        <>
            <StyledModal
                container={() => document.querySelector('.dark') || document.querySelector('.light')}
                open
                onClose={onClose}
            >
                <ModalContainer>
                    <ModalHeader>
                        <ModalTitle>{t(`options.market.trade-options.cancel-order.title`)}</ModalTitle>
                        <CloseIconContainer onClick={onClose} />
                    </ModalHeader>
                    <OrderDetails order={order.displayOrder} optionSide={optionSide} />
                    <Divider />
                    <NetworkFees gasLimit={gasLimit} l1Fee={l1Fee} />
                    <Button
                        active={true}
                        margin={'30px auto 10px auto'}
                        padding={'5px 30px'}
                        disabled={isButtonDisabled || !gasLimit}
                        onClickHandler={handleCancelOrder}
                    >
                        {!isCanceling
                            ? t('options.market.trade-options.cancel-order.confirm-button.label')
                            : t('options.market.trade-options.cancel-order.confirm-button.progress-label')}
                    </Button>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </ModalContainer>
            </StyledModal>
        </>
    );
};

export default CancelOrderModal;
