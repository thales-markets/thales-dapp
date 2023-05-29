import React, { useMemo } from 'react';
import TileTable, { TileRow } from 'components/TileTable/TileTable';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import useBinaryOptionsUserTradesQuery from 'queries/options/useBinaryOptionsUserTradesQuery';
import useBinaryOptionsUserTransactionsQuery from 'queries/options/useBinaryOptionsUserTransactionsQuery';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { orderBy } from 'lodash';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { formatHoursAndMinutesFromTimestamp, formatShortDate } from 'utils/formatters/date';
import { MarketType, OptionsMarketInfo, RangedMarketData } from 'types/options';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import { MARKET_TYPE } from 'constants/options';
import { Container, Date, DateTimeContainer, Time } from './styled-components';

type Activity = {
    timestamp: number;
    currencyKey: string;
    paid: number | null;
    price: number | null | string;
    amount: number;
    side: string;
    type: string;
    timeRemaining: number;
    link: any;
};

const UserActivity: React.FC<{ marketType: MarketType }> = ({ marketType }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    // TODO: fix this warning
    // eslint-disable-next-line
    const marketInfo =
        marketType == MARKET_TYPE[0]
            ? // eslint-disable-next-line
              (useMarketContext() as OptionsMarketInfo)
            : // eslint-disable-next-line
              (useRangedMarketContext() as RangedMarketData);

    const { t } = useTranslation();

    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const marketTransactionsQuery = useBinaryOptionsUserTransactionsQuery(
        marketInfo?.address,
        walletAddress,
        networkId,
        {
            enabled: isAppReady && marketType !== MARKET_TYPE[1] && isWalletConnected,
        }
    );

    const tradesQuery = useBinaryOptionsUserTradesQuery(
        marketInfo?.address,
        marketType == MARKET_TYPE[0]
            ? (marketInfo as OptionsMarketInfo)?.longAddress
            : (marketInfo as RangedMarketData)?.inAddress,
        marketType == MARKET_TYPE[0]
            ? (marketInfo as OptionsMarketInfo)?.shortAddress
            : (marketInfo as RangedMarketData)?.outAddress,
        networkId,
        walletAddress,
        marketType,
        { enabled: isAppReady && !!marketInfo?.address }
    );

    const generateRowsForTileTable = (data: Activity[]) => {
        if (data?.length) {
            const rows: TileRow[] = data.map((item: Activity) => {
                return {
                    cells: [
                        {
                            value: item.timestamp,
                        },
                        {
                            title: t('options.market.your-activity.paid'),
                            value: item.paid ? formatCurrencyWithSign(USD_SIGN, item.paid) : 'N/A',
                        },
                        {
                            title: t('options.market.your-activity.amount'),
                            value: `${formatCurrency(item.amount)} ${item.side.toUpperCase()}`,
                        },
                        {
                            title: t('options.market.your-activity.activity'),
                            value: item.type,
                        },
                        {
                            title: t('options.market.your-activity.tx-status'),
                            value: item.link,
                        },
                    ],
                };
            });

            return rows;
        }

        return [];
    };

    const userTransactionAndTradeList = useMemo(() => {
        if ((tradesQuery.isSuccess || marketTransactionsQuery.isSuccess) && marketInfo?.address) {
            const trades: Activity[] = tradesQuery?.data
                ? tradesQuery?.data.map((trade) => {
                      return {
                          timestamp: trade.timestamp,
                          currencyKey: marketInfo.currencyKey,
                          paid: Number(trade.amount) * Number(trade.price),
                          price: trade?.price ? trade.price : null,
                          amount: Number(trade.amount),
                          side: marketType == MARKET_TYPE[0] ? (trade.side == 'short' ? 'down' : 'up') : trade.side,
                          type: trade.type,
                          timeRemaining: marketInfo.timeRemaining,
                          link: <ViewEtherscanLink hash={trade.hash} />,
                      };
                  })
                : [];

            const transactions: Activity[] = marketTransactionsQuery?.data
                ? marketTransactionsQuery?.data.map((transaction) => {
                      return {
                          timestamp: transaction.timestamp,
                          currencyKey: marketInfo.currencyKey,
                          paid: null,
                          price: null,
                          amount: Number(transaction.amount),
                          side:
                              marketType == MARKET_TYPE[0]
                                  ? transaction.side == 'short'
                                      ? 'down'
                                      : 'up'
                                  : transaction.side,
                          type: transaction.type,
                          timeRemaining: marketInfo.timeRemaining,
                          link: <ViewEtherscanLink hash={transaction.hash} />,
                      };
                  })
                : [];

            return orderBy([...trades, ...transactions], ['timestamp'], ['desc']);
        }

        return [];
    }, [tradesQuery, marketTransactionsQuery, walletAddress, networkId]);

    return (
        <Container>
            <TileTable
                firstColumnRenderer={(row: TileRow | string) => <FirstColumn value={row} />}
                rows={generateRowsForTileTable(userTransactionAndTradeList)}
                isLoading={marketTransactionsQuery.isLoading || tradesQuery.isLoading}
                noResultsMessage={userTransactionAndTradeList.length === 0 ? t('common.no-data') : undefined}
            />
        </Container>
    );
};

const FirstColumn: React.FC<{ value: TileRow | string }> = ({ value }) => {
    if (typeof value !== 'string') {
        return (
            <DateTimeContainer>
                <Date>{formatShortDate(Number(value?.cells[0]?.value))}</Date>
                <Time>{formatHoursAndMinutesFromTimestamp(Number(value?.cells[0]?.value))}</Time>
            </DateTimeContainer>
        );
    }
    return <>{value}</>;
};

export default UserActivity;
