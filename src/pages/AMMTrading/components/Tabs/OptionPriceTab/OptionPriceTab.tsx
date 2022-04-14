import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import OptionPriceChart from '../../OptionPriceChart';
import ChartContainer from './styled-components/ChartContainer';
import Container from './styled-components/Container';
import { useMarketContext } from '../../../contexts/MarketContext';

import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';

import { mean, maxBy, orderBy } from 'lodash';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { EMPTY_VALUE } from 'constants/placeholder';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import { USD_SIGN } from 'constants/currency';

import { OptionsTransactions, Orders } from 'types/options';

import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import useAmmMaxLimitsQuery, { AmmMaxLimits } from 'queries/options/useAmmMaxLimitsQuery';
import useBinaryOptionsTradesQuery from 'queries/options/useBinaryOptionsTradesQuery';
import { useTranslation } from 'react-i18next';
import { getIsPolygon } from '../../../../../utils/network';

const OptionPriceTab: React.FC = () => {
    const optionsMarket = useMarketContext();
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isPolygon = getIsPolygon(networkId);
    const longOrderbookQuery = useBinaryOptionsMarketOrderbook(networkId, optionsMarket?.longAddress, {
        enabled: isAppReady && !!optionsMarket,
    });
    const shortOrderbookQuery = useBinaryOptionsMarketOrderbook(networkId, optionsMarket?.shortAddress, {
        enabled: isAppReady && !!optionsMarket,
    });

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(optionsMarket?.address, networkId, {
        enabled: isAppReady && !!optionsMarket,
    });

    const tradesQuery = useBinaryOptionsTradesQuery(
        optionsMarket?.address,
        optionsMarket?.longAddress,
        optionsMarket?.shortAddress,
        networkId,
        { enabled: isAppReady && !!optionsMarket }
    );

    const getLastPrice = (data: OptionsTransactions, side: string, timestamp: number) => {
        const lastTrade = maxBy(
            data.filter((trade) => trade.timestamp < timestamp && trade.side === side),
            'timestamp'
        );
        return lastTrade ? lastTrade.price : 0;
    };

    const chartData = useMemo(() => {
        const data = orderBy(
            tradesQuery.data
                ? tradesQuery.data.map((trade) => {
                      const longPrice =
                          trade.side === 'long' ? trade.price : getLastPrice(tradesQuery.data, 'long', trade.timestamp);
                      const shortPrice =
                          trade.side === 'short'
                              ? trade.price
                              : getLastPrice(tradesQuery.data, 'short', trade.timestamp);

                      return {
                          timestamp: trade.timestamp,
                          upPrice: isPolygon ? (longPrice || 0) * 1e12 : longPrice,
                          downPrice: isPolygon ? (shortPrice || 0) * 1e12 : shortPrice,
                      };
                  })
                : [],
            'timestamp',
            'desc'
        );
        if (data.length) {
            return [...data].reverse().slice(0, 8);
        }
        return [];
    }, [tradesQuery.data, isPolygon]);

    const getMarketPrice = (sellOrders: Orders, buyOrders: Orders) => {
        if (sellOrders.length > 0 && buyOrders.length > 0) {
            const lowestSellOrderPrice = sellOrders[0].displayOrder.price;
            const highestBuyOrderPrice = buyOrders[0].displayOrder.price;
            const marketPrice = mean([lowestSellOrderPrice, highestBuyOrderPrice]);
            return marketPrice;
        }
        if (sellOrders.length > 0) {
            const lowestSellOrderPrice = sellOrders[0].displayOrder.price;
            return lowestSellOrderPrice;
        }
        if (buyOrders.length > 0) {
            const highestBuyOrderPrice = buyOrders[0].displayOrder.price;
            return highestBuyOrderPrice;
        }

        return EMPTY_VALUE;
    };

    const longMarketPrice = useMemo(() => {
        const sellOrders =
            shortOrderbookQuery.isSuccess && longOrderbookQuery.data ? longOrderbookQuery.data.sellOrders : [];
        const buyOrders =
            longOrderbookQuery.isSuccess && longOrderbookQuery.data ? longOrderbookQuery.data.buyOrders : [];
        const ammMaxLimits =
            ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data
                ? (ammMaxLimitsQuery.data as AmmMaxLimits)
                : undefined;

        const marketPrice =
            ammMaxLimits && ammMaxLimits.isMarketInAmmTrading
                ? mean([ammMaxLimits.buyLongPrice, ammMaxLimits.sellLongPrice])
                : getMarketPrice(sellOrders, buyOrders);
        return formatCurrencyWithSign(USD_SIGN, marketPrice, DEFAULT_OPTIONS_DECIMALS);
    }, [longOrderbookQuery.data, ammMaxLimitsQuery.data]);

    const shortMarketPrice = useMemo(() => {
        const sellOrders =
            shortOrderbookQuery.isSuccess && shortOrderbookQuery.data ? shortOrderbookQuery.data.sellOrders : [];
        const buyOrders =
            shortOrderbookQuery.isSuccess && shortOrderbookQuery.data ? shortOrderbookQuery.data.buyOrders : [];
        const ammMaxLimits =
            ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data
                ? (ammMaxLimitsQuery.data as AmmMaxLimits)
                : undefined;

        const marketPrice =
            ammMaxLimits && ammMaxLimits.isMarketInAmmTrading
                ? mean([ammMaxLimits.buyShortPrice, ammMaxLimits.sellShortPrice])
                : getMarketPrice(sellOrders, buyOrders);
        return formatCurrencyWithSign(USD_SIGN, marketPrice, DEFAULT_OPTIONS_DECIMALS);
    }, [shortOrderbookQuery.data, ammMaxLimitsQuery.data]);

    return (
        <Container>
            <ChartContainer>
                <OptionPriceChart data={chartData} />
            </ChartContainer>
            <Container.Footer>
                <Container.Footer.PriceContainer>
                    <Container.Footer.PriceContainer.Price>{shortMarketPrice}</Container.Footer.PriceContainer.Price>
                    {' | '}
                    <Container.Footer.PriceContainer.Position>
                        {t('common.short')}
                    </Container.Footer.PriceContainer.Position>
                </Container.Footer.PriceContainer>
                <Container.Footer.PriceContainer long={true}>
                    <Container.Footer.PriceContainer.Price>{longMarketPrice}</Container.Footer.PriceContainer.Price>
                    {' | '}
                    <Container.Footer.PriceContainer.Position>
                        {t('common.long')}
                    </Container.Footer.PriceContainer.Position>
                </Container.Footer.PriceContainer>
            </Container.Footer>
        </Container>
    );
};

export default OptionPriceTab;
