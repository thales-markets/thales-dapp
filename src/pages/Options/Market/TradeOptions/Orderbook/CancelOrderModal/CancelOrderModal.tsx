import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from 'redux/modules/wallet';
import { OptionSide, OrderItem } from 'types/options';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { IZeroExEvents } from '@0x/contract-wrappers';
import { refetchOrderbook, refetchOrders } from 'utils/queryConnector';
import OrderDetails from '../../components/OrderDetails';
import contractWrappers0xConnector from 'utils/contractWrappers0xConnector';
import { getIs0xReady } from 'redux/modules/app';
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
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [isCanceling, setIsCanceling] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const is0xReady = useSelector((state: RootState) => getIs0xReady(state));

    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPrice = useMemo(
        () =>
            customGasPrice !== null
                ? customGasPrice
                : ethGasPriceQuery.data != null
                ? ethGasPriceQuery.data[gasSpeed]
                : null,
        [customGasPrice, ethGasPriceQuery.data, gasSpeed]
    );
    const { exchangeProxy } = contractWrappers0xConnector;

    const isButtonDisabled = !isWalletConnected || isCanceling || !is0xReady;

    useEffect(() => {
        if (is0xReady) {
            const subscriptionToken = exchangeProxy.subscribe(
                IZeroExEvents.OrderCancelled,
                { orderHash: order.displayOrder.orderHash },
                (_, log) => {
                    if (log?.log.args.orderHash.toLowerCase() === order.displayOrder.orderHash.toLowerCase()) {
                        refetchOrderbook(baseToken);
                        refetchOrders(networkId);
                        onClose();
                    }
                }
            );
            return () => {
                exchangeProxy.unsubscribe(subscriptionToken);
            };
        }
    }, [is0xReady]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            try {
                const gasEstimate = await exchangeProxy
                    .cancelLimitOrder(order.rawOrder)
                    .estimateGasAsync({ from: walletAddress });
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled]);

    const handleCancelOrder = async () => {
        if (gasPrice !== null) {
            setTxErrorMessage(null);
            setIsCanceling(true);

            try {
                await exchangeProxy.cancelLimitOrder(order.rawOrder).sendTransactionAsync({
                    from: walletAddress,
                    gas: gasLimit !== null ? gasLimit : undefined,
                    gasPrice: gasPriceInWei(gasPrice),
                });
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsCanceling(false);
            }
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
