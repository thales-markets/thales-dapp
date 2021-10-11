import React, { useEffect, useMemo, useState } from 'react';
import OrderbookSide from './OrderbookSide';
import { OptionSide, OrderItem, Orders } from 'types/options';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import { useMarketContext } from '../../contexts/MarketContext';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { formatShortDate } from 'utils/formatters/date';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDiv } from 'theme/common';
import { ReactComponent as OrderbookBuyIcon } from 'assets/images/orderbook-buy.svg';
import { ReactComponent as OrderbookSellIcon } from 'assets/images/orderbook-sell.svg';
import { ReactComponent as OrderbookAllIcon } from 'assets/images/orderbook-all.svg';
import { ReactComponent as UserIcon } from 'assets/images/user.svg';
import OrderbookTableHeader from '../components/OrderbookTable/OrderbookTableHeader';
import { maxBy, mean } from 'lodash';
import { OrderbookFilterEnum } from 'constants/options';
import MarketWidgetHeader from '../../components/MarketWidget/MarketWidgetHeader';
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetContent from '../../components/MarketWidget/MarketWidgetContent';
import { FilterButton, LightTooltip } from '../../components';
import snxJSConnector from 'utils/snxJSConnector';
import { refetchOrderbook } from 'utils/queryConnector';
import { get0xWebSocketBaseURL } from 'utils/0x';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';

type OrderbookProps = {
    optionSide: OptionSide;
};

const orderbookFilterIconMap = {
    [OrderbookFilterEnum.ALL]: <OrderbookAllIcon />,
    [OrderbookFilterEnum.BUY]: <OrderbookBuyIcon />,
    [OrderbookFilterEnum.SELL]: <OrderbookSellIcon />,
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

    const optionsTokenAddress = optionSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;
    const orderbookSign = optionsMarket.customMarket
        ? optionSide === 'long'
            ? optionsMarket.eventName === 'XYZ airdrop claims' ||
              optionsMarket.eventName === 'ETH burned count' ||
              optionsMarket.eventName === 'Flippening Markets' ||
              optionsMarket.eventName === 'ETH/BTC market cap ratio'
                ? '>='
                : '=='
            : optionsMarket.eventName === 'XYZ airdrop claims' ||
              optionsMarket.eventName === 'ETH burned count' ||
              optionsMarket.eventName === 'Flippening Markets' ||
              optionsMarket.eventName === 'ETH/BTC market cap ratio'
            ? '<'
            : '!='
        : optionSide === 'long'
        ? '>'
        : '<';

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

    const marketHeading = optionsMarket
        ? optionsMarket.customMarket
            ? `${optionsMarket.country} ${orderbookSign} ${formatCurrency(
                  optionsMarket.outcome || 0,
                  optionsMarket.eventName === 'Flippening Markets' ||
                      optionsMarket.eventName === 'ETH/BTC market cap ratio'
                      ? 2
                      : 0
              )} @ ${formatShortDate(optionsMarket.maturityDate)}`
            : `${optionsMarket.asset} ${orderbookSign} ${formatCurrencyWithSign(
                  USD_SIGN,
                  optionsMarket.strikePrice
              )} @ ${formatShortDate(optionsMarket.maturityDate)}`
        : null;

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

    const getWebSocketRequest = (makerToken: string, takerToken: string) => ({
        type: 'subscribe',
        channel: 'orders',
        requestId: `${makerToken}-${takerToken}`,
        payload: {
            makerToken: makerToken,
            takerToken: takerToken,
        },
    });

    useEffect(() => {
        const {
            contracts: { SynthsUSD },
        } = snxJSConnector.snxJS as any;
        const ws = new WebSocket(get0xWebSocketBaseURL(networkId));

        ws.onopen = () => {
            const sellsRequest = getWebSocketRequest(optionsTokenAddress, SynthsUSD.address);
            ws.send(JSON.stringify(sellsRequest));

            const buysRequest = getWebSocketRequest(SynthsUSD.address, optionsTokenAddress);
            ws.send(JSON.stringify(buysRequest));
        };

        ws.onmessage = () => {
            refetchOrderbook(optionsTokenAddress);
        };
    }, [networkId, optionsTokenAddress]);

    return (
        <>
            <MarketWidgetHeader widgetKey={MarketWidgetKey.ORDERBOOK}>
                <FilterContainer>
                    {Object.values(OrderbookFilterEnum).map((filterItem) => (
                        <LightTooltip
                            key={filterItem}
                            title={t(`options.market.trade-options.orderbook.filter.tooltips.${filterItem}`)}
                        >
                            <OrderbookFilterButton
                                className={` ${filter === filterItem ? 'selected' : ''} market__orderbook__headerBtn`}
                                onClick={() => setFilter(filterItem)}
                            >
                                {orderbookFilterIconMap[filterItem]}
                            </OrderbookFilterButton>
                        </LightTooltip>
                    ))}
                    <LightTooltip
                        title={
                            !isWalletConnected
                                ? t(`options.market.trade-options.orderbook.filter.my-orders.tooltip-connected`)
                                : t(`options.market.trade-options.orderbook.filter.my-orders.tooltip-not-connected`)
                        }
                    >
                        <OrderbookFilterButton
                            onClick={isWalletConnected ? () => setFilterMyOrders(!filterMyOrders) : undefined}
                            className={` ${filterMyOrders ? 'selected' : ''} market__orderbook__userBtn`}
                            disabled={!isWalletConnected}
                        >
                            <UserIcon />
                        </OrderbookFilterButton>
                    </LightTooltip>
                </FilterContainer>
            </MarketWidgetHeader>
            <MarketWidgetContent>
                <Container>
                    <Header>{marketHeading}</Header>
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
            </MarketWidgetContent>
        </>
    );
};

const SidesContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(100% - 76px);
`;

const Container = styled(FlexDivColumn)`
    height: 100%;
`;

const Header = styled(FlexDivCentered)`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
    padding: 10px 0;
`;

const FilterContainer = styled(FlexDiv)`
    &:last-child {
        margin-right: 20px;
    }
`;

const OrderbookFilterButton = styled(FilterButton)`
    padding: 4px 16px;
`;

// const Divider = styled.hr`
//     width: 100%;
//     border: none;
//     border-top: 2px solid rgba(228, 228, 228, 0.1);
// `;

const MarketPrice = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 24px;
    color: #f6f6fe;
    padding: 5px 20px;
`;

export default Orderbook;
