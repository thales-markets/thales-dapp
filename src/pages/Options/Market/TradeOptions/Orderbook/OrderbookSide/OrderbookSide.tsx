import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Table } from 'semantic-ui-react';
import { Orders, OrderItem, OrderSide, OptionSide } from 'types/options';
import { formatCurrency, formatPercentage } from 'utils/formatters/number';
import FillOrderModal from '../FillOrderModal';

type OrderbookSideProps = {
    orders: Orders;
    orderSide: OrderSide;
    optionSide: OptionSide;
};

const OrderbookSide: React.FC<OrderbookSideProps> = ({ orders, orderSide, optionSide }) => {
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
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.price-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.amount-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.total-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.filled-col')}
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
                                <Table.Cell>{formatCurrency(orderItem.displayOrder.price)}</Table.Cell>
                                <Table.Cell>{formatCurrency(orderItem.displayOrder.amount)}</Table.Cell>
                                <Table.Cell>{formatCurrency(orderItem.displayOrder.total)}</Table.Cell>
                                <Table.Cell>{formatPercentage(orderItem.displayOrder.filled)}</Table.Cell>
                                <Table.Cell>
                                    <TimeRemaining end={orderItem.displayOrder.timeRemaining} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            {fillOrderModalVisible && selectedOrder !== null && (
                <FillOrderModal
                    order={selectedOrder}
                    optionSide={optionSide}
                    orderSide={orderSide}
                    onClose={() => setFillOrderModalVisible(false)}
                />
            )}
        </div>
    );
};

export default OrderbookSide;
