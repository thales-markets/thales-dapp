import TileTable from 'components/TileTable';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { UserPosition } from 'queries/user/useAllPositions';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import styled from 'styled-components';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { Positions } from 'enums/options';
import { getColorPerPosition } from 'utils/options';

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

    const getAmount = (amount: number | string, position: Positions) => {
        return (
            <Value>
                {amount} <Value color={getColorPerPosition(position, theme)}>{position}</Value>
            </Value>
        );
    };

    const getStatus = (claimed: boolean) => {
        if (claimed) {
            return <Value color={theme.textColor.quaternary}>{t('options.home.market-card.claimed')}</Value>;
        } else {
            return (
                <Value color={theme.textColor.tertiary}>
                    {t('options.home.market-card.rip')}
                    <Icon color={theme.textColor.tertiary} className="v2-icon v2-icon--rip"></Icon>
                </Value>
            );
        }
    };

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
                    value: getAmount(formatCurrency(row.amount, 2), row.side),
                });

                cells.push({
                    title: t('options.home.markets-table.status-col'),
                    value: getStatus(row.claimed),
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

export const Value = styled.span<{ color?: string }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
`;

export const Icon = styled.i<{ color?: string }>`
    margin: 0px 0px 2px 4px;
    font-size: 10px;
    color: ${(props) => props.color || props.theme.textColor.primary};
    @media (max-width: 568px) {
        font-size: 16px;
        line-height: 100%;
    }
`;

export default PositionHistory;
