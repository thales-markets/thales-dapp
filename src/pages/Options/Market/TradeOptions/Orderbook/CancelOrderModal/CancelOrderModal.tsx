import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Header, Message, Modal, Segment } from 'semantic-ui-react';
import { RootState } from 'redux/rootReducer';
import { getCustomGasPrice, getGasSpeed, getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { OrderItem } from 'types/options';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { useContractWrappers0xContext } from 'pages/Options/Market/contexts/ContractWrappers0xContext';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { IZeroExEvents } from '@0x/contract-wrappers';
import { refetchOrderbook } from 'utils/queryConnector';
import OrderDetails from '../../components/OrderDetails';

type CancelOrderModalProps = {
    order: OrderItem;
    baseToken: string;
    onClose: () => void;
};

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ onClose, order, baseToken }) => {
    const { t } = useTranslation();
    const contractWrappers0x = useContractWrappers0xContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [isCanceling, setIsCanceling] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

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

    const isButtonDisabled = !isWalletConnected || isCanceling;

    useEffect(() => {
        const subscriptionToken = contractWrappers0x.exchangeProxy.subscribe(
            IZeroExEvents.OrderCancelled,
            { orderHash: order.displayOrder.orderHash },
            (_, log) => {
                if (log?.log.args.orderHash.toLowerCase() === order.displayOrder.orderHash.toLowerCase()) {
                    refetchOrderbook(baseToken);
                    setIsCanceling(false);
                    onClose();
                }
            }
        );
        return () => {
            contractWrappers0x.exchangeProxy.unsubscribe(subscriptionToken);
        };
    }, []);

    useEffect(() => {
        const fetchGasLimit = async () => {
            if (gasPrice !== null) {
                try {
                    const gasEstimate = await contractWrappers0x.exchangeProxy
                        .cancelLimitOrder(order.rawOrder)
                        .estimateGasAsync({ from: walletAddress });
                    setGasLimit(normalizeGasLimit(Number(gasEstimate)));
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled, gasPrice]);

    const handleCancelOrder = async () => {
        if (gasPrice !== null) {
            setTxErrorMessage(null);
            setIsCanceling(true);

            try {
                await contractWrappers0x.exchangeProxy.cancelLimitOrder(order.rawOrder).sendTransactionAsync({
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
        <Modal open={true} onClose={onClose} centered={false} closeIcon size="mini">
            <Modal.Content>
                <Segment>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Header as="h3">{t(`options.market.trade-options.cancel-order.title`)}</Header>
                    </div>
                    <OrderDetails order={order.displayOrder} />
                    <NetworkFees gasLimit={gasLimit} />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                        <Button primary disabled={isButtonDisabled || !gasLimit} onClick={handleCancelOrder}>
                            {!isCanceling
                                ? t('options.market.trade-options.cancel-order.confirm-button.label')
                                : t('options.market.trade-options.cancel-order.confirm-button.progress-label')}
                        </Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                        {txErrorMessage && (
                            <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />
                        )}
                    </div>
                </Segment>
            </Modal.Content>
        </Modal>
    );
};

export default CancelOrderModal;
