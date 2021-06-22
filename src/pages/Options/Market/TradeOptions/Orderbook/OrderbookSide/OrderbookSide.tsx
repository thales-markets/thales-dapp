import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Orders, OrderItem, OrderSide, OptionSide, DisplayOrder } from 'types/options';
import { formatCurrency, formatPercentage } from 'utils/formatters/number';
import CancelOrderModal from '../CancelOrderModal';
import FillOrderModal from '../FillOrderModal';
import { CellProps, Row } from 'react-table';
import OrderbookTable from '../../components/OrderbookTable';
import styled from 'styled-components';
import { OrderbookFilterEnum } from 'constants/options';
import { COLORS } from 'constants/ui';
import { ReactComponent as CancelIcon } from 'assets/images/close-red.svg';

type OrderbookSideProps = {
    orders: Orders;
    orderSide: OrderSide;
    optionSide: OptionSide;
    optionsTokenAddress: string;
    filterMyOrders: boolean;
    filter: OrderbookFilterEnum;
    orderbookEmpty: boolean;
};

const OrderbookSide: React.FC<OrderbookSideProps> = ({
    orders,
    orderSide,
    optionSide,
    optionsTokenAddress,
    filterMyOrders,
    filter,
    orderbookEmpty,
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
        <TableContainer filter={filter}>
            <OrderbookTable
                columns={[
                    {
                        id: 'dot',
                        Cell: (cellProps: CellProps<OrderItem>) =>
                            cellProps.cell.row.original.rawOrder.maker.toLowerCase() ===
                                walletAddress.toLowerCase() && (
                                <YellowDotContainer>
                                    <YellowDot />
                                </YellowDotContainer>
                            ),
                        width: 14,
                        sortable: false,
                    },
                    {
                        Header: <>{t('options.market.trade-options.orderbook.table.price-col')}</>,
                        accessor: 'displayOrder.price',
                        Cell: (cellProps: CellProps<DisplayOrder, DisplayOrder['price']>) => (
                            <Price orderSide={orderSide}>{formatCurrency(cellProps.cell.value, 3)}</Price>
                        ),
                        width: 300,
                        sortable: false,
                    },
                    {
                        Header: <>{t('options.market.trade-options.orderbook.table.amount-col')}</>,
                        accessor: 'displayOrder.amount',
                        Cell: (cellProps: CellProps<DisplayOrder, DisplayOrder['amount']>) => (
                            <p>{formatCurrency(cellProps.cell.value)}</p>
                        ),
                        width: 300,
                        sortable: false,
                    },
                    {
                        Header: <>{t('options.market.trade-options.orderbook.table.total-col')}</>,
                        accessor: 'displayOrder.total',
                        Cell: (cellProps: CellProps<DisplayOrder, DisplayOrder['total']>) => (
                            <p>{formatCurrency(cellProps.cell.value)}</p>
                        ),
                        width: 300,
                        sortable: false,
                    },
                    {
                        Header: <>{t('options.market.trade-options.orderbook.table.filled-col')}</>,
                        accessor: 'displayOrder.filled',
                        Cell: (cellProps: CellProps<DisplayOrder, DisplayOrder['filled']>) => (
                            <p>{formatPercentage(cellProps.cell.value)}</p>
                        ),
                        width: 300,
                        sortable: false,
                    },
                    {
                        Header: <>{t('options.market.trade-options.orderbook.table.time-remaining-col')}</>,
                        accessor: 'displayOrder.timeRemaining',
                        Cell: (cellProps: CellProps<DisplayOrder, DisplayOrder['timeRemaining']>) => (
                            <TimeRemaining end={cellProps.cell.value} />
                        ),
                        width: 300,
                        sortable: false,
                    },
                    {
                        id: 'cancel',
                        Cell: (cellProps: CellProps<OrderItem>) =>
                            cellProps.cell.row.original.rawOrder.maker.toLowerCase() ===
                                walletAddress.toLowerCase() && (
                                <CancelIconContainer
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        openCancelOrderModal(cellProps.cell.row.original);
                                    }}
                                />
                            ),
                        width: 30,
                        sortable: false,
                    },
                ]}
                data={orders}
                noResultsMessage={
                    orders.length === 0 ? (
                        <NoResultContainer orderSide={orderSide} orderbookEmpty={orderbookEmpty}>
                            {filterMyOrders
                                ? t(`options.market.trade-options.orderbook.filter.my-orders.${orderSide}.no-results`)
                                : t(`options.market.trade-options.orderbook.${orderSide}.no-results`)}
                        </NoResultContainer>
                    ) : null
                }
                onTableRowClick={(row: Row<OrderItem>) => {
                    openFillOrderModal(row.original);
                }}
                orderSide={orderSide}
            />
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
                    optionSide={optionSide}
                    onClose={() => setCancelOrderModalVisible(false)}
                />
            )}
        </TableContainer>
    );
};

const TableContainer = styled.div<{ filter: OrderbookFilterEnum }>`
    height: ${(props) => (props.filter === OrderbookFilterEnum.ALL ? 'calc(50% - 17px)' : 'calc(100% - 34px)')};
`;

const Price = styled.p<{ orderSide: OrderSide }>`
    margin-left: 14px;
    color: ${(props) => (props.orderSide === 'buy' ? COLORS.BUY : COLORS.SELL)};
`;

const YellowDotContainer = styled.div`
    margin-left: 7px;
    padding-bottom: 3px;
`;

const YellowDot = styled.span`
    height: 4px;
    width: 4px;
    background-color: rgb(240, 185, 11);
    border-radius: 50%;
    display: inline-block;
`;

const CancelIconContainer = styled(CancelIcon)`
    min-width: 8px;
    min-height: 8px;
    margin-top: 2px;
    z-index: 2;
`;

const NoResultContainer = styled.div<{ orderSide: OrderSide; orderbookEmpty: boolean }>`
    color: ${(props) => (props.orderSide === 'buy' ? COLORS.BUY : COLORS.SELL)};
    padding-top: ${(props) => (props.orderbookEmpty ? '0px' : '17px')};
`;

export default OrderbookSide;
