import React, { useMemo } from 'react';

import TileTable, { TileRow } from 'components/TileTable/TileTable';
import DateTimeContainer from './styled-components/TimeDateContainer';
import Container from './styled-components/Container';
import { NoDataContainer, NoDataText } from 'theme/common';

import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useTranslation } from 'react-i18next';

import useBinaryOptionsUserTradesQuery from 'queries/options/useBinaryOptionsUserTradesQuery';
import useBinaryOptionsUserTransactionsQuery from 'queries/options/useBinaryOptionsUserTransactionsQuery';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';

import { orderBy } from 'lodash';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { formatHoursAndMinutesFromTimestamp, formatShortDateFromTimestamp } from 'utils/formatters/date';

import { OptionsMarketInfo } from 'types/options';
import { getIsPolygon } from '../../../../../utils/network';

type Activity = {
    timestamp: number;
    currencyKey: string;
    paid: number | null;
    price: number | null;
    amount: number;
    side: string;
    type: string;
    timeRemaining: number;
};

const UserActivity: React.FC = () => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const marketInfo = useMarketContext();

    const { t } = useTranslation();

    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isPolygon = getIsPolygon(networkId);

    const marketTransactionsQuery = useBinaryOptionsUserTransactionsQuery(
        marketInfo?.address,
        walletAddress,
        networkId,
        {
            enabled: isAppReady && !!marketInfo?.address && isWalletConnected,
        }
    );

    const tradesQuery = useBinaryOptionsUserTradesQuery(
        marketInfo?.address,
        marketInfo?.longAddress,
        marketInfo?.shortAddress,
        networkId,
        walletAddress,
        { enabled: isAppReady && !!marketInfo?.address }
    );

    const generateRowsForTileTable = (data: Activity[], marketInfo: OptionsMarketInfo) => {
        if (data?.length) {
            const rows: TileRow[] = data.map((item: Activity) => {
                return {
                    asset: { currencyKey: item.currencyKey, displayInRow: true },
                    cells: [
                        {
                            value: item.timestamp,
                        },
                        {
                            title: t('options.market.your-activity.strike-price'),
                            value: formatCurrencyWithSign(USD_SIGN, marketInfo.strikePrice),
                        },
                        {
                            title: t('options.market.your-activity.paid'),
                            value: item.paid
                                ? formatCurrencyWithSign(USD_SIGN, isPolygon ? item.paid * 1e12 : item.paid)
                                : 'N/A',
                        },
                        {
                            title: t('options.market.your-activity.amount'),
                            value: `${item.amount} ${item.side.toUpperCase()}`,
                        },
                        {
                            title: t('options.market.your-activity.activity'),
                            value: item.type,
                        },
                    ],
                };
            });

            return rows;
        }

        return [];
    };

    const userTransactionAndTradeList = useMemo(() => {
        if (tradesQuery.isSuccess && marketTransactionsQuery.isSuccess && marketInfo?.address) {
            const trades: Activity[] = tradesQuery?.data.map((trade) => {
                return {
                    timestamp: trade.timestamp,
                    currencyKey: marketInfo.currencyKey,
                    paid: Number(trade.amount) * Number(trade.price),
                    price: trade?.price ? trade.price : null,
                    amount: Number(trade.amount),
                    side: trade.side == 'short' ? 'down' : 'up',
                    type: trade.type,
                    timeRemaining: marketInfo.timeRemaining,
                };
            });

            const transactions: Activity[] = marketTransactionsQuery?.data.map((transaction) => {
                return {
                    timestamp: transaction.timestamp,
                    currencyKey: marketInfo.currencyKey,
                    paid: null,
                    price: null,
                    amount: Number(transaction.amount),
                    side: transaction.side == 'short' ? 'down' : 'up',
                    type: transaction.type,
                    timeRemaining: marketInfo.timeRemaining,
                };
            });

            return orderBy([...trades, ...transactions], ['timestamp'], ['desc']);
        }

        return [];
    }, [tradesQuery, marketTransactionsQuery, walletAddress, networkId]);

    return (
        <Container>
            {userTransactionAndTradeList?.length && (
                <TileTable
                    firstColumnRenderer={(row: TileRow | string) => <FirstColumn value={row} />}
                    rows={generateRowsForTileTable(userTransactionAndTradeList, marketInfo)}
                />
            )}
            {userTransactionAndTradeList.length == 0 && (
                <NoDataContainer>
                    <NoDataText>{t('common.no-data')}</NoDataText>
                </NoDataContainer>
            )}
        </Container>
    );
};

const FirstColumn: React.FC<{ value: TileRow | string }> = ({ value }) => {
    if (typeof value !== 'string') {
        console.log('Value ', value);
        return (
            <DateTimeContainer>
                <DateTimeContainer.Date>
                    {formatShortDateFromTimestamp(Number(value?.cells[0]?.value))}
                </DateTimeContainer.Date>
                <DateTimeContainer.Time>
                    {formatHoursAndMinutesFromTimestamp(Number(value?.cells[0]?.value))}
                </DateTimeContainer.Time>
            </DateTimeContainer>
        );
    }
    return <>{value}</>;
};

export default UserActivity;
