import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Icon, Table } from 'semantic-ui-react';
import { Orders, OrderItem, OrderSide, OptionSide } from 'types/options';
import { formatCurrency, formatPercentage } from 'utils/formatters/number';
import CancelOrderModal from '../CancelOrderModal';
import FillOrderModal from '../FillOrderModal';

type OrderbookSideProps = {
    orders: Orders;
    orderSide: OrderSide;
    optionSide: OptionSide;
    optionsTokenAddress: string;
    filterMyOrders: boolean;
};

const OrderbookSide: React.FC<OrderbookSideProps> = ({
    orders,
    orderSide,
    optionSide,
    optionsTokenAddress,
    filterMyOrders,
}) => {
    const { t } = useTranslation();
    const [fillOrderModalVisible, setFillOrderModalVisible] = useState<boolean>(false);
    const [cancelOrderModalVisible, setCancelOrderModalVisible] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const openFillOrderModal = useCallback((order: OrderItem) => {
        setFillOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);
    const openCancelOrderModal = useCallback((order: OrderItem) => {
        setCancelOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);

    return (
        <Table compact selectable fixed striped size="small">
            {orders.length === 0 ? (
                <div style={{ color: orderSide === 'buy' ? 'green' : 'red' }}>
                    {filterMyOrders
                        ? t(`options.market.trade-options.orderbook.filter.my-orders.${orderSide}.no-results`)
                        : t(`options.market.trade-options.orderbook.${orderSide}.no-results`)}
                </div>
            ) : (
                <Table.Body>
                    {orders.map((orderItem: OrderItem, index: number) => {
                        return (
                            <Table.Row
                                key={index}
                                onClick={() => openFillOrderModal(orderItem)}
                                style={{
                                    color: orderSide === 'buy' ? 'green' : 'red',
                                    backgroundColor:
                                        orderItem.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase()
                                            ? '#e9f8fd'
                                            : index % 2 == 0
                                            ? '#fff'
                                            : 'rgba(0,0,50,.02)',
                                }}
                            >
                                <Table.Cell textAlign="right">
                                    {formatCurrency(orderItem.displayOrder.price)}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {formatCurrency(orderItem.displayOrder.amount)}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {formatCurrency(orderItem.displayOrder.total)}
                                </Table.Cell>
                                <Table.Cell textAlign="right" width={3}>
                                    {formatPercentage(orderItem.displayOrder.filled)}
                                </Table.Cell>
                                <Table.Cell>
                                    <TimeRemaining end={orderItem.displayOrder.timeRemaining} />
                                </Table.Cell>
                                <Table.Cell width={1}>
                                    {orderItem.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase() && (
                                        <Icon
                                            name="cancel"
                                            color="red"
                                            onClick={(e: any) => {
                                                e.stopPropagation();
                                                openCancelOrderModal(orderItem);
                                            }}
                                        />
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                    {fillOrderModalVisible && selectedOrder !== null && (
                        <FillOrderModal
                            order={selectedOrder}
                            optionSide={optionSide}
                            orderSide={orderSide}
                            onClose={() => setFillOrderModalVisible(false)}
                        />
                    )}
                    {cancelOrderModalVisible && selectedOrder !== null && (
                        <CancelOrderModal
                            order={selectedOrder}
                            baseToken={optionsTokenAddress}
                            onClose={() => setCancelOrderModalVisible(false)}
                        />
                    )}
                </Table.Body>
            )}
        </Table>
    );
};

export default OrderbookSide;
