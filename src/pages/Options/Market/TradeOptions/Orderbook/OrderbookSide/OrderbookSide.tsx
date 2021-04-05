import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React, { useCallback, useState } from 'react';
import { Table } from 'semantic-ui-react';
import { Orders, OrderItem, OrderSide, OptionSide } from 'types/options';
import { formatCurrency, formatPercentage } from 'utils/formatters/number';
import FillOrderModal from '../FillOrderModal';

type OrderbookSideProps = {
    orders: Orders;
    orderSide: OrderSide;
    optionSide: OptionSide;
};

const OrderbookSide: React.FC<OrderbookSideProps> = ({ orders, orderSide, optionSide }) => {
    const [fillOrderModalVisible, setFillOrderModalVisible] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const openFillOrderModal = useCallback((order: OrderItem) => {
        setFillOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);

    return (
        <Table compact selectable fixed striped size="small">
            <Table.Body>
                {orders.map((orderItem: OrderItem, index: number) => {
                    return (
                        <Table.Row
                            key={index}
                            onClick={() => openFillOrderModal(orderItem)}
                            style={{ color: orderSide === 'buy' ? 'green' : 'red' }}
                        >
                            <Table.Cell textAlign="right">{formatCurrency(orderItem.displayOrder.price)}</Table.Cell>
                            <Table.Cell textAlign="right">{formatCurrency(orderItem.displayOrder.amount)}</Table.Cell>
                            <Table.Cell textAlign="right">{formatCurrency(orderItem.displayOrder.total)}</Table.Cell>
                            <Table.Cell textAlign="right" width={3}>
                                {formatPercentage(orderItem.displayOrder.filled)}
                            </Table.Cell>
                            <Table.Cell>
                                <TimeRemaining end={orderItem.displayOrder.timeRemaining} />
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
            </Table.Body>
        </Table>
    );
};

export default OrderbookSide;
