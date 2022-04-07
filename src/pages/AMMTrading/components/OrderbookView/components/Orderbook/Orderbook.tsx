import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Filters from './components/Filters';
import OrderbookSide from './components/OrderbookSide';
import OrderbookTableHeader from './components/OrderbookTable/OrderbookTableHeader';

import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';

import { OrderbookFilterEnum } from 'constants/options';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { OptionSide, OrderItem, Orders } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { maxBy, mean } from 'lodash';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import { useTranslation } from 'react-i18next';

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
    const [filter, setFilter] = useState<string>(OrderbookFilterEnum.ALL);

    const orderbookSign = optionSide === 'long' ? '>' : '<';
    const optionsTokenAddress = optionSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;

    const marketHeading = optionsMarket
        ? `${optionsMarket.asset} ${orderbookSign} ${formatCurrencyWithSign(
              USD_SIGN,
              optionsMarket.strikePrice
          )} @ ${formatShortDate(optionsMarket.maturityDate)}`
        : null;

    const orderbookQuery = useBinaryOptionsMarketOrderbook(networkId, optionsTokenAddress, {
        enabled: isAppReady,
    });

    const getFilteredOrders = (orders: Orders) => {
        if (orders.length > 0) {
            const maxTotalItem = maxBy(orders, (order: OrderItem) => order.displayOrder.fillableTotal);
            if (maxTotalItem) {
                orders.forEach((order: OrderItem) => {
                    order.displayOrder.percentageOfMaximum =
                        (order.displayOrder.fillableTotal / maxTotalItem.displayOrder.fillableTotal) * 100;
                });
            }
        }
        return filterMyOrders
            ? orders.filter((order: OrderItem) => order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase())
            : orders;
    };

    const { buyOrders, filteredBuyOrders } = useMemo(() => {
        const orders = orderbookQuery.isSuccess && orderbookQuery.data ? orderbookQuery.data.buyOrders : [];
        return { buyOrders: orders, filteredBuyOrders: getFilteredOrders(orders) };
    }, [orderbookQuery.data, filterMyOrders, walletAddress]);

    const { sellOrders, filteredSellOrders } = useMemo(() => {
        const orders = orderbookQuery.isSuccess && orderbookQuery.data ? orderbookQuery.data.sellOrders : [];
        return { sellOrders: orders, filteredSellOrders: getFilteredOrders(orders) };
    }, [orderbookQuery.data, filterMyOrders, walletAddress]);

    const marketPrice = useMemo(() => {
        if (sellOrders.length > 0 && buyOrders.length > 0) {
            const lowestSellOrderPrice = sellOrders[0].displayOrder.price;
            const highestBuyOrderPrice = buyOrders[0].displayOrder.price;
            const marketPrice = mean([lowestSellOrderPrice, highestBuyOrderPrice]);
            return formatCurrencyWithKey(SYNTHS_MAP.sUSD, marketPrice, DEFAULT_OPTIONS_DECIMALS);
        }
        if (sellOrders.length > 0) {
            const lowestSellOrderPrice = sellOrders[0].displayOrder.price;
            return formatCurrencyWithKey(SYNTHS_MAP.sUSD, lowestSellOrderPrice, DEFAULT_OPTIONS_DECIMALS);
        }
        if (buyOrders.length > 0) {
            const highestBuyOrderPrice = buyOrders[0].displayOrder.price;
            return formatCurrencyWithKey(SYNTHS_MAP.sUSD, highestBuyOrderPrice, DEFAULT_OPTIONS_DECIMALS);
        }

        return '';
    }, [sellOrders, buyOrders]);

    return (
        <Container>
            <Filters
                filter={filter}
                onClick={setFilter}
                userOrderFilter={filterMyOrders}
                userOrderFilterTooltipText={
                    !isWalletConnected
                        ? t(`options.market.trade-options.orderbook.filter.my-orders.tooltip-connected`)
                        : t(`options.market.trade-options.orderbook.filter.my-orders.tooltip-not-connected`)
                }
                onUserOrderFilterClick={setFilterMyOrders}
            />
            <MarketHeading>{marketHeading}</MarketHeading>
            <OrderbookTableHeader optionsCurrencyKey={OPTIONS_CURRENCY_MAP[optionSide]} />
            <SidesContainer>
                {(filter === OrderbookFilterEnum.ALL || filter === OrderbookFilterEnum.SELL) && (
                    <OrderbookSide
                        orders={filteredSellOrders}
                        orderSide="sell"
                        optionSide={optionSide}
                        optionsTokenAddress={optionsTokenAddress}
                        filterMyOrders={filterMyOrders}
                        filter={filter}
                        orderbookEmpty={marketPrice === ''}
                        isLoading={orderbookQuery.isLoading}
                    />
                )}
                {marketPrice !== '' && <MarketPrice>{marketPrice}</MarketPrice>}
                {(filter === OrderbookFilterEnum.ALL || filter === OrderbookFilterEnum.BUY) && (
                    <OrderbookSide
                        orders={filteredBuyOrders}
                        orderSide="buy"
                        optionSide={optionSide}
                        optionsTokenAddress={optionsTokenAddress}
                        filterMyOrders={filterMyOrders}
                        filter={filter}
                        orderbookEmpty={marketPrice === ''}
                        isLoading={orderbookQuery.isLoading}
                    />
                )}
            </SidesContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
    height: 600px;
`;

const MarketHeading = styled.span`
    font-family: Roboto !important;
    font-weight: 700;
    font-size: 20px;
    margin: 20px 0px;
    color: var(--primary-color);
    align-self: center;
    justify-self: center;
`;

const MarketPrice = styled.div`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    color: #f6f6fe;
    padding: 5px 20px;
`;

const SidesContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(100% - 76px);
`;

export default Orderbook;
