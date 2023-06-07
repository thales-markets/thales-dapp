import TileTable from 'components/TileTable';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { UserPosition } from 'queries/user/useAllPositions';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { getAmount, getStatus } from '../styled-components';

type PositionHistoryProps = {
    claimedPositions: UserPosition[];
    ripPositions: UserPosition[];
    searchText: string;
    isLoading?: boolean;
};

const PositionHistory: React.FC<PositionHistoryProps> = ({ claimedPositions, ripPositions, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const data = useMemo(() => [...claimedPositions, ...ripPositions], [claimedPositions, ripPositions]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter((value: UserPosition) => {
            return value.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        });
    }, [searchText, data]);

    const generateStrike = (position: UserPosition) =>
        position.isRanged
            ? `$${formatCurrency(position.leftPrice)} - $${formatCurrency(position.rightPrice)}`
            : `$${formatCurrency(position.strikePrice)}`;

    const generateRows = (data: UserPosition[]) => {
        try {
            const dateMap: Record<string, UserPosition[]> = {};
            const sortedData = data.sort((a, b) => b.maturityDate - a.maturityDate);
            sortedData.forEach((position) => {
                const maturityDateKey = `${t(`options.home.markets-table.maturity-date-col`)}: ${formatShortDate(
                    position.maturityDate
                ).toUpperCase()}`;
                if (!dateMap[maturityDateKey]) {
                    dateMap[maturityDateKey] = [];
                }
                dateMap[maturityDateKey].push(position);
            });

            const rows = Object.keys(dateMap).reduce((prev: (string | UserPosition)[], curr: string) => {
                prev.push(curr);
                prev.push(...dateMap[curr]);
                return prev;
            }, []);

            return rows.map((row: string | UserPosition) => {
                if (typeof row === 'string') {
                    return row;
                }

                const cells: any = [
                    {
                        title: row.isRanged
                            ? t('options.market.ranged-markets.strike-range')
                            : t(`options.home.markets-table.strike-price-col`),
                        value: generateStrike(row),
                    },
                    {
                        title: t('options.home.markets-table.final-asset-price-col'),
                        value: formatCurrencyWithSign(USD_SIGN, row.finalPrice),
                    },
                ];

                // if (!d.range) {
                //     cells.push({
                //         title: translator('options.home.market-card.price-difference'),
                //         value: `${getPercentageDifference(d.market.finalPrice, d.market.strikePrice).toFixed(2)}%`,
                //     });
                // }

                cells.push({
                    title: t('options.leaderboard.trades.table.amount-col'),
                    value: getAmount(formatCurrency(row.amount, 2), row.side, theme),
                });

                cells.push({
                    title: t('options.home.markets-table.status-col'),
                    value: getStatus(row.claimed, theme, t),
                });

                return {
                    dotColor: theme.background.tertiary,
                    backgroundColor: theme.background.secondary,
                    asset: {
                        currencyKey: row.currencyKey,
                    },
                    cells: cells,
                    link: row.isRanged ? buildRangeMarketLink(row.market) : buildOptionsMarketLink(row.market),
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

    return <TileTable rows={rows as any} isLoading={isLoading} defaultFlowColor={theme.background.tertiary} />;
};

export default PositionHistory;
