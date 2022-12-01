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
import { MarketType, OptionsMarketInfo, OptionsTransactions, RangedMarketData } from 'types/options';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import useBinaryOptionsTradesQuery from 'queries/options/useBinaryOptionsTradesQuery';
import { MARKET_TYPE } from 'constants/options';

const OptionPriceTab: React.FC<{ marketType: MarketType }> = ({ marketType }) => {
    const optionsMarket: OptionsMarketInfo | RangedMarketData =
        marketType == MARKET_TYPE[0] ? useMarketContext() : useRangedMarketContext();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

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

    const removeTimePart = (timestamp: number) => {
        return new Date(new Date(timestamp).toDateString()).getTime();
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
                    timestamp: removeTimePart(trade.timestamp),
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
                    timestamp: removeTimePart(trade.timestamp),
                    firstPositionPrice: inPrice,
                    secondPositionPrice: outPrice,
                };
            });
        }

        // Calculate the price sums and group data by date (while tracking count)
        const groupedTradesByDate = trades.reduce((grouped: any, trade: any) => {
            if (!grouped[trade.timestamp]) {
                grouped[trade.timestamp] = { ...trade, count: 1 };
                return grouped;
            }
            grouped[trade.timestamp].firstPositionPrice += trade.firstPositionPrice;
            grouped[trade.timestamp].secondPositionPrice += trade.secondPositionPrice;
            grouped[trade.timestamp].count += 1;
            return grouped;
        }, {});

        // Create new array from grouped data and compute the average prices
        const avgPriceForGroupedTrades = Object.keys(groupedTradesByDate).map((timestamp) => {
            const groupedTrade = groupedTradesByDate[timestamp];
            return {
                timestamp: groupedTrade.timestamp,
                firstPositionPrice: groupedTrade.firstPositionPrice / groupedTrade.count,
                secondPositionPrice: groupedTrade.secondPositionPrice / groupedTrade.count,
            };
        });

        const data = orderBy(avgPriceForGroupedTrades ? avgPriceForGroupedTrades : [], 'timestamp', 'asc');
        if (data.length) {
            return [...data].slice(0, 8);
        }
        return [];
    }, [tradesQuery.data]);

    return (
        <Container>
            <ChartContainer>
                <OptionPriceChart data={chartData} marketType={marketType} />
            </ChartContainer>
        </Container>
    );
};

export default OptionPriceTab;
