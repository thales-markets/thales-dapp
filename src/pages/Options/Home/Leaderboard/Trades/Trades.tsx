import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivColumn, FlexDivColumnCentered, Text } from 'theme/common';
import { ExtendedTrade, HistoricalOptionsMarketInfo, OptionSide } from 'types/options';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useBinaryOptionsAllTradesQuery from 'queries/options/useBinaryOptionsAllTradesQuery';
import TradesTable from './TradesTable';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { getSynthName } from 'utils/snxJSConnector';
import { USD_SIGN } from 'constants/currency';

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const DEFAULT_ORDER_BY = 1;

const Trades: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);

    const tradesQuery = useBinaryOptionsAllTradesQuery(networkId, {
        enabled: isAppReady,
    });
    const trades: ExtendedTrade[] = tradesQuery.isSuccess && tradesQuery.data ? tradesQuery.data : [];

    const sortedTrades = useMemo(() => {
        return trades.sort((a, b) => {
            switch (orderBy) {
                case 1:
                    return sortByField(a, b, orderDirection, 'timestamp');
                case 2:
                    return sortByMarketHeading(a, b, orderDirection);
                case 3:
                    return sortByField(a, b, orderDirection, 'optionSide');
                case 4:
                    return sortByField(a, b, orderDirection, 'orderSide');
                case 5:
                    return sortByAmount(a, b, orderDirection);
                case 6:
                    return sortByPrice(a, b, orderDirection);
                default:
                    return 0;
            }
        });
    }, [trades, orderBy, orderDirection]);

    return (
        <FlexDivColumnCentered className="leaderboard__wrapper">
            <TradesTable
                trades={sortedTrades}
                isLoading={tradesQuery.isLoading}
                orderBy={orderBy}
                orderDirection={orderDirection}
                setOrderBy={setOrderBy}
                setOrderDirection={setOrderDirection}
            >
                <NoTrades>
                    <Text className="text-l bold pale-grey">{t('options.leaderboard.trades.no-trades-found')}</Text>
                </NoTrades>
            </TradesTable>
        </FlexDivColumnCentered>
    );
};

export const marketHeading = (optionsMarket: HistoricalOptionsMarketInfo, optionSide: OptionSide) => {
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

    return optionsMarket.customMarket
        ? `${optionsMarket.country} ${orderbookSign} ${formatCurrency(
              optionsMarket.outcome || 0,
              optionsMarket.eventName === 'Flippening Markets' || optionsMarket.eventName === 'ETH/BTC market cap ratio'
                  ? 2
                  : 0
          )} @ ${formatShortDate(optionsMarket.maturityDate)}`
        : `${getSynthName(optionsMarket.currencyKey)} ${orderbookSign} ${formatCurrencyWithSign(
              USD_SIGN,
              optionsMarket.strikePrice
          )} @ ${formatShortDate(optionsMarket.maturityDate)}`;
};

const sortByMarketHeading = (a: ExtendedTrade, b: ExtendedTrade, direction: OrderDirection) => {
    const aMarket = marketHeading(a.marketItem, a.optionSide);
    const bMarket = marketHeading(b.marketItem, b.optionSide);
    if (direction === OrderDirection.ASC) {
        return aMarket < bMarket ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aMarket < bMarket ? 1 : -1;
    }

    return 0;
};

const sortByField = (a: ExtendedTrade, b: ExtendedTrade, direction: OrderDirection, field: keyof ExtendedTrade) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

const sortByAmount = (a: ExtendedTrade, b: ExtendedTrade, direction: OrderDirection) => {
    const aAmount = a.orderSide === 'buy' ? a.makerAmount : a.takerAmount;
    const bAmount = b.orderSide === 'buy' ? b.makerAmount : b.takerAmount;
    if (direction === OrderDirection.ASC) {
        return aAmount < bAmount ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aAmount < bAmount ? 1 : -1;
    }

    return 0;
};

const sortByPrice = (a: ExtendedTrade, b: ExtendedTrade, direction: OrderDirection) => {
    const aPrice = a.orderSide === 'buy' ? a.takerAmount / a.makerAmount : a.makerAmount / a.takerAmount;
    const bPrice = b.orderSide === 'buy' ? b.takerAmount / b.makerAmount : b.makerAmount / b.takerAmount;
    if (direction === OrderDirection.ASC) {
        return aPrice < bPrice ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aPrice < bPrice ? 1 : -1;
    }

    return 0;
};

const NoTrades = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    align-items: center;
    .primary {
        align-self: center;
    }
    border-radius: 0 0 23px 23px;
`;

export default Trades;
