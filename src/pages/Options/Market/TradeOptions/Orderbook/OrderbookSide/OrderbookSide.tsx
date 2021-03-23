import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Table } from 'semantic-ui-react';
import { Orders, OrderItem, OrderSide } from 'types/options';
import FillOrderModal from '../FillOrderModal';

type OrderbookSideProps = {
    orders: Orders;
    orderSide: OrderSide;
};

const OrderbookSide: React.FC<OrderbookSideProps> = ({ orders, orderSide }) => {
    const { t } = useTranslation();
    const [fillOrderModalVisible, setFillOrderModalVisible] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const openFillOrderModal = useCallback((order: OrderItem) => {
        setFillOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);

    return (
        <div>
            <Header as="h3">{t(`options.market.trade-options.orderbook.${orderSide}.title`)}</Header>
            <Table compact selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{ textTransform: 'none' }}>
                            {t('options.market.trade-options.orderbook.table.price-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.amount-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.total-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.time-remaining-col')}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body style={{ color: orderSide === 'buy' ? 'green' : 'red' }}>
                    {orders.map((orderItem: OrderItem, index: number) => {
                        return (
                            <Table.Row key={index} onClick={() => openFillOrderModal(orderItem)}>
                                <Table.Cell>{orderItem.order.price}</Table.Cell>
                                <Table.Cell>{orderItem.order.amount}</Table.Cell>
                                <Table.Cell>{orderItem.order.total}</Table.Cell>
                                <Table.Cell>
                                    <TimeRemaining end={orderItem.order.timeRemaining} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            {fillOrderModalVisible && selectedOrder !== null && (
                <FillOrderModal order={selectedOrder} onClose={() => setFillOrderModalVisible(false)} />
            )}
        </div>
    );
};

export default OrderbookSide;
