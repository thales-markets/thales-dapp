import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import OptionPriceChart from '../../OptionPriceChart';
import ChartContainer from './styled-components/ChartContainer';
import Container from './styled-components/Container';
import { useMarketContext } from '../../../contexts/MarketContext';

import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';

import { maxBy, orderBy } from 'lodash';
// import { formatCurrencyWithSign } from 'utils/formatters/number';
// import { EMPTY_VALUE } from 'constants/placeholder';
// import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
// import { USD_SIGN } from 'constants/currency';

import { MarketType, OptionsMarketInfo, OptionsTransactions, RangedMarketData } from 'types/options';

import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
// import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import useAmmMaxLimitsQuery from 'queries/options/useAmmMaxLimitsQuery';
import useBinaryOptionsTradesQuery from 'queries/options/useBinaryOptionsTradesQuery';
// import { useTranslation } from 'react-i18next';
import { MARKET_TYPE } from 'constants/options';
import useRangedAMMMaxLimitsQuery from 'queries/options/rangedMarkets/useRangedAMMMaxLimitsQuery';

const OptionPriceTab: React.FC<{ marketType: MarketType }> = ({ marketType }) => {
    const optionsMarket: OptionsMarketInfo | RangedMarketData =
        marketType == MARKET_TYPE[0] ? useMarketContext() : useRangedMarketContext();
    // const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    // const longOrderbookQuery = useBinaryOptionsMarketOrderbook(
    //     networkId,
    //     (optionsMarket as OptionsMarketInfo)?.longAddress,
    //     {
    //         enabled: isAppReady && marketType == MARKET_TYPE[0],
    //     }
    // );
    // const shortOrderbookQuery = useBinaryOptionsMarketOrderbook(
    //     networkId,
    //     (optionsMarket as OptionsMarketInfo)?.shortAddress,
    //     {
    //         enabled: isAppReady && marketType == MARKET_TYPE[0],
    //     }
    // );

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(optionsMarket?.address, networkId, {
        enabled: isAppReady && marketType == MARKET_TYPE[0],
    });

    const rangedAMMLimitsQuery = useRangedAMMMaxLimitsQuery(optionsMarket?.address, networkId, {
        enabled: isAppReady && marketType == MARKET_TYPE[1],
    });

    console.log('ammMaxLimitsQuery ', ammMaxLimitsQuery);
    console.log('rangedAMMLimitsQuery ', rangedAMMLimitsQuery);

    const tradesQuery = useBinaryOptionsTradesQuery(
        optionsMarket?.address,
        marketType == MARKET_TYPE[0]
            ? (optionsMarket as OptionsMarketInfo).longAddress
            : (optionsMarket as RangedMarketData)?.inAddress,
        marketType == MARKET_TYPE[0]
            ? (optionsMarket as OptionsMarketInfo).shortAddress
            : (optionsMarket as RangedMarketData)?.outAddress,
        networkId,
        marketType,
        { enabled: isAppReady && !!marketType }
    );

    const getLastPrice = (data: OptionsTransactions, side: string, timestamp: number) => {
        const lastTrade = maxBy(
            data.filter((trade) => trade.timestamp < timestamp && trade.side === side),
            'timestamp'
        );
        return lastTrade ? lastTrade.price : 0;
    };

    const chartData = useMemo(() => {
        let trades: any = [];

        if (marketType == MARKET_TYPE[0] && tradesQuery?.data) {
            trades = tradesQuery.data.map((trade) => {
                const longPrice =
                    trade.side === 'long' ? trade.price : getLastPrice(tradesQuery.data, 'long', trade.timestamp);
                const shortPrice =
                    trade.side === 'short' ? trade.price : getLastPrice(tradesQuery.data, 'short', trade.timestamp);
                return {
                    timestamp: trade.timestamp,
                    firstPositionPrice: longPrice,
                    secondPositionPrice: shortPrice,
                };
            });
        }

        if (marketType == MARKET_TYPE[1] && tradesQuery?.data) {
            trades = tradesQuery.data.map((trade) => {
                const inPrice =
                    trade.side === 'in' ? trade.price : getLastPrice(tradesQuery.data, 'in', trade.timestamp);
                const outPrice =
                    trade.side === 'out' ? trade.price : getLastPrice(tradesQuery.data, 'out', trade.timestamp);
                return {
                    timestamp: trade.timestamp,
                    firstPositionPrice: inPrice,
                    secondPositionPrice: outPrice,
                };
            });
        }

        const data = orderBy(trades ? trades : [], 'timestamp', 'desc');
        if (data.length) {
            return [...data].reverse().slice(0, 8);
        }
        return [];
    }, [tradesQuery.data]);

    // const getMarketPrice = (sellOrders: Orders, buyOrders: Orders) => {
    //     if (sellOrders.length > 0 && buyOrders.length > 0) {
    //         const lowestSellOrderPrice = sellOrders[0].displayOrder.price;
    //         const highestBuyOrderPrice = buyOrders[0].displayOrder.price;
    //         const marketPrice = mean([lowestSellOrderPrice, highestBuyOrderPrice]);
    //         return marketPrice;
    //     }
    //     if (sellOrders.length > 0) {
    //         const lowestSellOrderPrice = sellOrders[0].displayOrder.price;
    //         return lowestSellOrderPrice;
    //     }
    //     if (buyOrders.length > 0) {
    //         const highestBuyOrderPrice = buyOrders[0].displayOrder.price;
    //         return highestBuyOrderPrice;
    //     }

    //     return EMPTY_VALUE;
    // };

    // const firstPositionPrice = useMemo(() => {
    //     const sellOrders =
    //         shortOrderbookQuery.isSuccess && longOrderbookQuery.data ? longOrderbookQuery.data.sellOrders : [];
    //     const buyOrders =
    //         longOrderbookQuery.isSuccess && longOrderbookQuery.data ? longOrderbookQuery.data.buyOrders : [];
    //     const ammMaxLimits =
    //         ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data
    //             ? (ammMaxLimitsQuery.data as AmmMaxLimits)
    //             : undefined;
    //     const rangedAMMLimits =
    //         rangedAMMLimitsQuery.isSuccess && rangedAMMLimitsQuery.data
    //             ? (rangedAMMLimitsQuery.data as RangeAmmMaxLimits)
    //             : undefined;

    //     let marketPrice = undefined;

    //     if (ammMaxLimits && marketType == MARKET_TYPE[0]) {
    //         marketPrice = ammMaxLimits.isMarketInAmmTrading
    //             ? mean([ammMaxLimits.buyLongPrice, ammMaxLimits.sellLongPrice])
    //             : getMarketPrice(sellOrders, buyOrders);
    //     }

    //     if (rangedAMMLimits && marketType == MARKET_TYPE[1]) {
    //         marketPrice = rangedAMMLimits
    //             ? mean([rangedAMMLimits.in.buyPrice, rangedAMMLimits.in.sellPrice])
    //             : getMarketPrice(sellOrders, buyOrders);
    //     }

    //     return formatCurrencyWithSign(USD_SIGN, Number(marketPrice), DEFAULT_OPTIONS_DECIMALS);
    // }, [longOrderbookQuery.data, ammMaxLimitsQuery.data, rangedAMMLimitsQuery.isLoading]);

    // const secondPositionPrice = useMemo(() => {
    //     const sellOrders =
    //         shortOrderbookQuery.isSuccess && shortOrderbookQuery.data ? shortOrderbookQuery.data.sellOrders : [];
    //     const buyOrders =
    //         shortOrderbookQuery.isSuccess && shortOrderbookQuery.data ? shortOrderbookQuery.data.buyOrders : [];
    //     const ammMaxLimits =
    //         ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data
    //             ? (ammMaxLimitsQuery.data as AmmMaxLimits)
    //             : undefined;
    //     const rangedAMMLimits =
    //         rangedAMMLimitsQuery.isSuccess && rangedAMMLimitsQuery.data
    //             ? (rangedAMMLimitsQuery.data as RangeAmmMaxLimits)
    //             : undefined;

    //     let marketPrice = undefined;

    //     if (ammMaxLimits && marketType == MARKET_TYPE[0]) {
    //         marketPrice = ammMaxLimits.isMarketInAmmTrading
    //             ? mean([ammMaxLimits.buyShortPrice, ammMaxLimits.sellShortPrice])
    //             : getMarketPrice(sellOrders, buyOrders);
    //     }

    //     if (rangedAMMLimits && marketType == MARKET_TYPE[1]) {
    //         marketPrice = rangedAMMLimits
    //             ? mean([rangedAMMLimits.out.buyPrice, rangedAMMLimits.out.sellPrice])
    //             : getMarketPrice(sellOrders, buyOrders);
    //     }

    //     return formatCurrencyWithSign(USD_SIGN, Number(marketPrice), DEFAULT_OPTIONS_DECIMALS);
    // }, [shortOrderbookQuery.data, ammMaxLimitsQuery.data, rangedAMMLimitsQuery.isLoading]);

    return (
        <Container>
            <ChartContainer>
                <OptionPriceChart data={chartData} marketType={marketType} />
            </ChartContainer>
        </Container>
    );
};

export default OptionPriceTab;
