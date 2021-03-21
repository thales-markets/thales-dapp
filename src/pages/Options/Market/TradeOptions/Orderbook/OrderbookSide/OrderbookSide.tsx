import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React, { useCallback, useState } from 'react';
import { Header, Table } from 'semantic-ui-react';
import { Orders, OrderItem, OrderSide } from 'types/options';
import FillOrderModal from '../FillOrderModal';

type OrderbookSideProps = {
    orders: Orders;
    side: OrderSide;
};

const OrderbookSide: React.FC<OrderbookSideProps> = ({ orders, side }) => {
    const [fillOrderModalVisible, setFillOrderModalVisible] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const openFillOrderModal = useCallback((order: OrderItem) => {
        setFillOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);

    return (
        <div>
            <Header as="h3">{side === 'buy' ? 'Buy Orders' : 'Sell Orders'}</Header>
            <Table compact>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Price (sUSD)</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Total (sUSD)</Table.HeaderCell>
                        <Table.HeaderCell>Time remaining</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body style={{ color: side === 'buy' ? 'green' : 'red' }}>
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
