import { orderBy } from 'lodash';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Header, Icon, Segment, Table } from 'semantic-ui-react';
import { OrderItem, OrderSide, OptionSide } from 'types/options';
import { formatCurrency, formatPercentage } from 'utils/formatters/number';
import { useMarketContext } from '../../contexts/MarketContext';
import { useContractWrappers0xContext } from '../../contexts/ContractWrappers0xContext';

type MyOrdersProps = {
    optionSide: OptionSide;
};

type MyOrder = OrderItem & {
    side: OrderSide;
};

const MyOrders: React.FC<MyOrdersProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const contractWrappers0x = useContractWrappers0xContext();

    const optionsTokenAddress = optionSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;

    const orderbookQuery = useBinaryOptionsMarketOrderbook(networkId, optionsTokenAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const cancelOrder = async (order: MyOrder) => {
        await contractWrappers0x.exchangeProxy
            .cancelLimitOrder(order.rawOrder)
            .sendTransactionAsync({ from: walletAddress });
    };

    const orders = useMemo(() => {
        if (orderbookQuery.isSuccess && orderbookQuery.data) {
            const buyOrders: MyOrder[] = orderbookQuery.data.buyOrders.map(
                (orderItem: OrderItem): MyOrder => {
                    return { ...orderItem, side: 'buy' };
                }
            );
            const sellOrders: MyOrder[] = orderbookQuery.data.sellOrders.map(
                (orderItem: OrderItem): MyOrder => {
                    return { ...orderItem, side: 'sell' };
                }
            );
            const orders = orderBy(
                [...buyOrders, ...sellOrders].filter(
                    (order: MyOrder) => order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase()
                ),
                'displayOrder.timeRemaining',
                'asc'
            );
            return orders;
        }
        return [];
    }, [orderbookQuery.data, walletAddress]);

    return (
        <Segment color={optionSide === 'long' ? 'green' : 'red'}>
            <Header as="h2">{t(`options.market.trade-options.my-orders.${optionSide}.title`)}</Header>
            <Table compact>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.type-col')}
                        </Table.HeaderCell>
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
                            {t('options.market.trade-options.orderbook.table.remaining-amount-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.remaining-amount-susd-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.time-remaining-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.cancel-col')}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {orders.map((orderItem: MyOrder, index: number) => {
                        return (
                            <Table.Row key={index} style={{ color: orderItem.side === 'buy' ? 'green' : 'red' }}>
                                <Table.Cell style={{ textTransform: 'uppercase' }}>{orderItem.side}</Table.Cell>
                                <Table.Cell>{formatCurrency(orderItem.displayOrder.price)}</Table.Cell>
                                <Table.Cell>{formatCurrency(orderItem.displayOrder.amount)}</Table.Cell>
                                <Table.Cell>{formatCurrency(orderItem.displayOrder.total)}</Table.Cell>
                                <Table.Cell>{formatPercentage(orderItem.displayOrder.filled)}</Table.Cell>
                                <Table.Cell>{formatCurrency(orderItem.displayOrder.fillableAmount)}</Table.Cell>
                                <Table.Cell>
                                    {formatCurrency(
                                        orderItem.displayOrder.fillableAmount * orderItem.displayOrder.price
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <TimeRemaining end={orderItem.displayOrder.timeRemaining} />
                                </Table.Cell>
                                <Table.Cell>
                                    <Icon name="cancel" color="red" onClick={() => cancelOrder(orderItem)} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </Segment>
    );
};

export default MyOrders;
