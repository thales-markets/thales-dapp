import TileTable from 'components/TileTable';
import { keyBy } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTheme } from 'styled-components';
import { HistoricalOptionsMarketInfo, RangedMarket, Trade, Trades } from 'types/options';
import { ThemeInterface } from 'types/ui';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';
import { getIsAppReady } from 'redux/modules/app';
import { formatHoursAndMinutesFromTimestamp, formatShortDate } from 'utils/formatters/date';
import { formatCurrency } from 'utils/formatters/number';
import { OPTIONS_POSITIONS_MAP } from 'constants/options';
import { Positions } from 'enums/options';
import { ArrowLink, getAmount } from '../styled-components';
import { getEtherscanTxLink } from 'utils/etherscan';
import { getIsMobile } from 'redux/modules/ui';
import { TradeWithMarket } from 'types/profile';
import useTradesQuery from 'queries/profile/useTradesQuery';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';

type TransactionHistoryProps = {
    searchAddress: string;
    searchText: string;
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ searchAddress, searchText }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const tradesQuery = useTradesQuery(networkId, searchAddress || walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    const trades: Trades = tradesQuery.isSuccess && tradesQuery.data ? tradesQuery.data : [];

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: isAppReady });
    const markets = marketsQuery.isSuccess && marketsQuery.data ? marketsQuery.data : [];

    const rangedTrades = trades
        .filter((trade: Trade) => trade.optionSide === 'in' || trade.optionSide === 'out')
        .map((trade: Trade) => trade.market);

    const rangedMarketsQuery = useRangedMarketsQuery(networkId, rangedTrades, {
        enabled: isAppReady && rangedTrades.length > 0,
    });
    const rangedMarkets = rangedMarketsQuery.isSuccess && rangedMarketsQuery.data ? rangedMarketsQuery.data : [];

    const allMarkets = [...markets, ...rangedMarkets];

    const data = useMemo(() => {
        const marketsMap = keyBy(allMarkets, 'address');
        return trades.map((trade: Trade) => ({
            ...trade,
            marketItem: marketsMap[trade.market],
        }));
    }, [trades, allMarkets]);

    const filteredData = useMemo(
        () =>
            data.filter(
                (trade: TradeWithMarket) =>
                    trade.marketItem &&
                    (!searchText || trade.marketItem.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
            ),
        [searchText, data]
    );

    const generateRows = (data: TradeWithMarket[]) => {
        try {
            const dateMap: Record<string, TradeWithMarket[]> = {};
            const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedData.forEach((trade) => {
                const tradeDateKey = formatShortDate(trade.timestamp).toUpperCase();
                if (!dateMap[tradeDateKey]) {
                    dateMap[tradeDateKey] = [];
                }
                dateMap[tradeDateKey].push(trade);
            });

            const rows = Object.keys(dateMap).reduce((prev: (string | TradeWithMarket)[], curr: string) => {
                prev.push(curr);
                prev.push(...dateMap[curr]);
                return prev;
            }, []);

            return rows.map((row: string | TradeWithMarket) => {
                if (typeof row === 'string') {
                    return row;
                }
                const isRanged = row.optionSide === 'in' || row.optionSide == 'out';
                const marketExpired = row.marketItem.result;
                const optionPrice =
                    row.orderSide != 'sell' ? row.takerAmount / row.makerAmount : row.makerAmount / row.takerAmount;
                const paidAmount = row.orderSide == 'sell' ? row.makerAmount : row.takerAmount;
                const amount = row.orderSide == 'sell' ? row.takerAmount : row.makerAmount;

                const cells: any = [
                    { title: row.orderSide, value: formatHoursAndMinutesFromTimestamp(row.timestamp) },
                    {
                        title: t('profile.history.strike'),
                        value: isRanged
                            ? `$${formatCurrency((row.marketItem as RangedMarket).leftPrice)} - $${formatCurrency(
                                  (row.marketItem as RangedMarket).rightPrice
                              )}`
                            : `$${formatCurrency((row.marketItem as HistoricalOptionsMarketInfo).strikePrice)}`,
                    },
                    {
                        title: t('profile.history.price'),
                        value: `$${formatCurrency(optionPrice)}`,
                    },
                    {
                        title: t('profile.history.amount'),
                        value: getAmount(
                            formatCurrency(amount),
                            OPTIONS_POSITIONS_MAP[row.optionSide] as Positions,
                            theme
                        ),
                    },
                    {
                        title: row.orderSide == 'sell' ? t('profile.history.received') : t('profile.history.paid'),
                        value: `$${formatCurrency(paidAmount)}`,
                    },
                    {
                        title: marketExpired ? t('profile.history.expired') : t('profile.history.expires'),
                        value: formatShortDate(new Date(row.marketItem.maturityDate)),
                    },
                ];

                if (!isMobile) {
                    cells.push({
                        value: <ArrowLink href={getEtherscanTxLink(networkId, row.transactionHash)} />,
                        width: '30px',
                    });
                }

                return {
                    asset: {
                        currencyKey: row.marketItem.currencyKey,
                    },
                    cells,
                    link: isMobile ? getEtherscanTxLink(networkId, row.transactionHash) : undefined,
                };
            });
        } catch (e) {
            console.log(e);
        }
    };

    const rows = useMemo(() => {
        if (filteredData.length > 0) {
            return generateRows(filteredData);
        }
        return [];
    }, [filteredData]);

    return (
        <TileTable
            rows={rows as any}
            isLoading={tradesQuery.isLoading || marketsQuery.isLoading || rangedMarketsQuery.isLoading}
        />
    );
};

export default TransactionHistory;
