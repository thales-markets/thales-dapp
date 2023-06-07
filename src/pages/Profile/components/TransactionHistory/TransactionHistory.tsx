import TileTable from 'components/TileTable';
import { currencyKeyToCoinGeckoIndexMap, currencyKeyToNameMap } from 'constants/currency';
import { keyBy } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTheme } from 'styled-components';
import { OptionsMarkets } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { sortOptionsMarkets } from 'utils/options';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';
import { getIsAppReady } from 'redux/modules/app';
import { formatHoursAndMinutesFromTimestamp, formatShortDate } from 'utils/formatters/date';
import { formatCurrency } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { POSITIONS_TO_SIDE_MAP, RANGE_SIDE } from 'constants/options';
import { Positions } from 'enums/options';
import { getAmount } from '../styled-components';

type TransactionHistoryProps = {
    markets?: OptionsMarkets;
    trades: [];
    searchText: string;
    isLoading?: boolean;
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ markets, trades, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

    const rangedTrades = trades
        .filter((trade: any) => trade.optionSide === 'in' || trade.optionSide === 'out')
        .map((trade: any) => trade.market);

    const rangedMarketsQuery = useRangedMarketsQuery(networkId, rangedTrades, {
        enabled: isAppReady && rangedTrades.length > 0,
    });
    const rangedMarkets = rangedMarketsQuery.isSuccess ? rangedMarketsQuery.data : [];
    const allMarkets = [...(markets as any), ...rangedMarkets];

    const getOptionSideLabel = (optionSide: string) => {
        switch (optionSide.toLowerCase()) {
            case 'short':
                return Positions.DOWN;
            case 'long':
                return Positions.UP;
            case 'in':
                return Positions.IN;
            case 'out':
                return Positions.OUT;
        }
        return Positions.UP;
    };

    const generateRows = (data: any[]) => {
        try {
            const dateMap: Record<string, any> = {};
            const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedData.forEach((trade) => {
                const tradeDateKey = formatShortDate(trade.timestamp).toUpperCase();
                if (!dateMap[tradeDateKey]) {
                    dateMap[tradeDateKey] = [];
                }
                dateMap[tradeDateKey].push(trade);
            });

            const rows = Object.keys(dateMap).reduce((prev: any[], curr: string) => {
                prev.push(curr);
                prev.push(...dateMap[curr]);
                return prev;
            }, []);

            return rows.map((d) => {
                if (typeof d === 'string') {
                    return d;
                }
                const isRanged =
                    d.optionSide === RANGE_SIDE[POSITIONS_TO_SIDE_MAP[Positions.IN]] ||
                    d.optionSide == RANGE_SIDE[POSITIONS_TO_SIDE_MAP[Positions.OUT]]
                        ? true
                        : false;
                const marketExpired = d.marketItem?.result;
                const optionPrice =
                    d.orderSide != 'sell' ? d.takerAmount / d.makerAmount : d.makerAmount / d.takerAmount;
                const paidAmount = d.orderSide == 'sell' ? d.makerAmount : d.takerAmount;

                return {
                    dotColor: theme.background.tertiary,
                    backgroundColor: theme.background.secondary,
                    asset: {
                        currencyKey: d.marketItem.currencyKey,
                    },
                    cells: [
                        { title: d.orderSide, value: formatHoursAndMinutesFromTimestamp(d.timestamp) },
                        {
                            title: t('options.trading-profile.history.strike'),
                            value: isRanged
                                ? `$${formatCurrency(d.marketItem.leftPrice)} - $${formatCurrency(
                                      d.marketItem.rightPrice
                                  )}`
                                : `$${formatCurrency(d.marketItem.strikePrice)}`,
                        },
                        {
                            title: t('options.trading-profile.history.price'),
                            value: `$${formatCurrency(optionPrice)}`,
                        },
                        {
                            title: t('options.trading-profile.history.amount'),
                            value: getAmount(
                                formatCurrency(d.orderSide == 'sell' ? d.takerAmount : d.makerAmount),
                                getOptionSideLabel(d.optionSide),
                                theme
                            ),
                        },
                        {
                            title: t('options.trading-profile.history.paid'),
                            value: `$${formatCurrency(paidAmount)}`,
                        },
                        {
                            title: marketExpired
                                ? t('options.trading-profile.history.expired')
                                : t('options.trading-profile.history.expires'),
                            value: formatShortDate(new Date(d.marketItem.maturityDate)),
                        },
                    ],
                    link: isRanged
                        ? buildRangeMarketLink(d.marketItem.address)
                        : buildOptionsMarketLink(d.marketItem.address),
                };
            });
        } catch (e) {
            console.log(e);
        }
    };

    const rows = useMemo(() => {
        if (trades.length > 0 && markets) {
            const optionsMarketsMap = keyBy(sortOptionsMarkets(allMarkets), 'address');
            return generateRows(
                trades
                    .map((trade: any) => ({
                        ...trade,
                        marketItem: optionsMarketsMap[trade.market],
                    }))
                    .filter((trade: any) => {
                        if (!trade?.marketItem) return false;

                        const search = searchText.toLowerCase();
                        const tradeValue = `${trade?.marketItem?.currencyKey} ${
                            currencyKeyToCoinGeckoIndexMap[trade?.marketItem?.asset?.toUpperCase()]
                        } ${currencyKeyToNameMap[trade?.marketItem?.asset?.toUpperCase()]}`.toLowerCase();
                        return !searchText || tradeValue.includes(search);
                    })
            );
        }
        return [];
    }, [trades, walletAddress, markets, searchText]);

    return (
        <TileTable
            rows={rows as any}
            isLoading={isLoading || rangedMarketsQuery.isLoading}
            defaultFlowColor={theme.background.tertiary}
        />
    );
};

export default TransactionHistory;
