import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { OptionSide, OrderItem } from 'types/options';
import { formatGasLimit } from 'utils/network';
import NetworkFees from 'pages/Options/components/NetworkFees';
// import { IZeroExEvents } from '@0x/contract-wrappers';
import { refetchOrderbook, refetchOrders } from 'utils/queryConnector';
import OrderDetails from '../../components/OrderDetails';
// import contractWrappers0xConnector from 'utils/contractWrappers0xConnector';
// import { getIs0xReady } from 'redux/modules/app';
import { DefaultSubmitButton, SubmitButtonContainer } from 'pages/Options/Market/components';
import ValidationMessage from 'components/ValidationMessage';
import {
    StyledModal,
    ModalContainer,
    ModalTitle,
    CloseIconContainer,
    ModalSummaryContainer,
    ModalHeader,
} from '../components';
import { cancelOrder } from 'utils/1inch';
import { ethers } from 'ethers';

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
    // const is0xReady = useSelector((state: RootState) => getIs0xReady(state));

    // const { exchangeProxy } = contractWrappers0xConnector;

    // const isButtonDisabled = !isWalletConnected || isCanceling || !is0xReady;

    const isButtonDisabled = !isWalletConnected || isCanceling;

    // useEffect(() => {

    // if (is0xReady) {
    //     const subscriptionToken = exchangeProxy.subscribe(
    //         IZeroExEvents.OrderCancelled,
    //         { orderHash: order.displayOrder.orderHash },
    //         (_, log) => {
    //             if (log?.log.args.orderHash.toLowerCase() === order.displayOrder.orderHash.toLowerCase()) {
    //                 refetchOrderbook(baseToken);
    //                 refetchOrders(networkId);
    //                 onClose();
    //             }
    //         }
    //     );
    //     return () => {
    //         exchangeProxy.unsubscribe(subscriptionToken);
    //     };
    // }
    // }, [is0xReady]);

    useEffect(() => {
        // TODO: FETCHING GAS LIMIT ON BUTTON ENABLING/DISABLING => SOLUTION TBD
        // const fetchGasLimit = async () => {
        //     try {
        //         const gasEstimate = await exchangeProxy
        //             .cancelLimitOrder(order.rawOrder)
        //             .estimateGasAsync({ from: walletAddress });
        //         setGasLimit(formatGasLimit(gasEstimate, networkId));
        //     } catch (e) {
        //         console.log(e);
        //         setGasLimit(null);
        //     }
        // };
        // if (isButtonDisabled) return;
        // fetchGasLimit();

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
            cancelOrder(
                networkId,
                walletAddress,
                order.rawOrder,
                gasLimit !== null ? gasLimit : undefined,
                gasLimit
            ).then(() => {
                refetchOrderbook(baseToken);
                refetchOrders(networkId);
            });
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsCanceling(false);
        }

        // try {
        //     await exchangeProxy.cancelLimitOrder(order.rawOrder).sendTransactionAsync({
        //         from: walletAddress,
        //         gas: gasLimit !== null ? gasLimit : undefined,
        //     });
        // } catch (e) {
        //     console.log(e);
        //     setTxErrorMessage(t('common.errors.unknown-error-try-again'));
        //     setIsCanceling(false);
        // }
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
