import React, { useMemo, useState } from 'react';
import { Button, Header, Icon, Table } from 'semantic-ui-react';
import OrderbookSide from './OrderbookSide';
import { OptionSide, OrderItem } from 'types/options';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import { useMarketContext } from '../../contexts/MarketContext';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { formatShortDate } from 'utils/formatters/date';
import { Tooltip } from '@material-ui/core';

type OrderbookProps = {
    optionSide: OptionSide;
};

const Orderbook: React.FC<OrderbookProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [filterMyOrders, setFilterMyOrders] = useState<boolean>(false);
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const optionsTokenAddress = optionSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;
    const orderbookSign = optionSide === 'long' ? '>' : '<';

    const orderbookQuery = useBinaryOptionsMarketOrderbook(networkId, optionsTokenAddress, {
        enabled: isAppReady,
    });

    const buyOrders = useMemo(() => {
        const orders = orderbookQuery.isSuccess && orderbookQuery.data ? orderbookQuery.data.buyOrders : [];
        return filterMyOrders
            ? orders.filter((order: OrderItem) => order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase())
            : orders;
    }, [orderbookQuery.data, filterMyOrders]);

    const sellOrders = useMemo(() => {
        const orders = orderbookQuery.isSuccess && orderbookQuery.data ? orderbookQuery.data.sellOrders : [];
        return filterMyOrders
            ? orders.filter((order: OrderItem) => order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase())
            : orders;
    }, [orderbookQuery.data, filterMyOrders]);

    const marketHeading = optionsMarket
        ? `(${optionsMarket.asset} ${orderbookSign} ${formatCurrencyWithSign(
              USD_SIGN,
              optionsMarket.strikePrice
          )} @ ${formatShortDate(optionsMarket.maturityDate)})`
        : null;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Header as="h3">
                        {t(`options.market.trade-options.orderbook.title`)} {marketHeading}
                    </Header>
                </div>
                <div>
                    <Tooltip
                        title={
                            <span style={{ fontSize: 12 }}>
                                {!isWalletConnected
                                    ? t(`options.market.trade-options.orderbook.filter.my-orders.tooltip-connected`)
                                    : t(
                                          `options.market.trade-options.orderbook.filter.my-orders.tooltip-not-connected`
                                      )}
                            </span>
                        }
                        placement="top"
                        arrow={true}
                    >
                        <Button
                            toggle
                            basic
                            onClick={isWalletConnected ? () => setFilterMyOrders(!filterMyOrders) : undefined}
                            active={filterMyOrders}
                            size="tiny"
                            icon
                        >
                            <Icon name="user" />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <Table compact selectable fixed striped size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textAlign="right">
                            {t('options.market.trade-options.orderbook.table.price-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="right">
                            {t('options.market.trade-options.orderbook.table.amount-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="right">
                            {t('options.market.trade-options.orderbook.table.total-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="right" width={3}>
                            {t('options.market.trade-options.orderbook.table.filled-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.time-remaining-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell width={1} />
                    </Table.Row>
                </Table.Header>
            </Table>
            <OrderbookSide
                orders={buyOrders}
                orderSide="buy"
                optionSide={optionSide}
                optionsTokenAddress={optionsTokenAddress}
                filterMyOrders={filterMyOrders}
            />
            <OrderbookSide
                orders={sellOrders}
                orderSide="sell"
                optionSide={optionSide}
                optionsTokenAddress={optionsTokenAddress}
                filterMyOrders={filterMyOrders}
            />
        </>
    );
};

export default Orderbook;
