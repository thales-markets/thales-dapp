import TileTable from 'components/TileTable';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { MarketLink, getAmount, getStatus } from '../styled-components';
import { UserPosition } from 'types/options';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsMobile } from 'redux/modules/ui';

type PositionHistoryProps = {
    claimedPositions: UserPosition[];
    ripPositions: UserPosition[];
    searchText: string;
    isLoading: boolean;
};

const PositionHistory: React.FC<PositionHistoryProps> = ({ claimedPositions, ripPositions, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const data = useMemo(() => [...claimedPositions, ...ripPositions], [claimedPositions, ripPositions]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter(
            (position: UserPosition) => position.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
    }, [searchText, data]);

    const generateRows = (data: UserPosition[]) => {
        try {
            const rows = data.sort((a, b) => b.maturityDate - a.maturityDate);

            return rows.map((row: UserPosition) => {
                const cells: any = [
                    {
                        value: getStatus(row.claimed, theme, t),
                    },
                    {
                        title: row.isRanged
                            ? t('options.market.ranged-markets.strike-range')
                            : t(`options.home.markets-table.strike-price-col`),
                        value: row.isRanged
                            ? `$${formatCurrency(row.leftPrice)} - $${formatCurrency(row.rightPrice)}`
                            : `$${formatCurrency(row.strikePrice)}`,
                    },
                    {
                        title: t('options.home.markets-table.final-asset-price-col'),
                        value: formatCurrencyWithSign(USD_SIGN, row.finalPrice),
                    },
                    {
                        title: t('options.leaderboard.trades.table.amount-col'),
                        value: getAmount(formatCurrency(row.amount, 2), row.side, theme),
                    },
                    {
                        title: t('options.trading-profile.history.expired'),
                        value: formatShortDate(row.maturityDate).toUpperCase(),
                    },
                ];

                if (!isMobile) {
                    cells.push({
                        value: (
                            <MarketLink
                                href={
                                    row.isRanged ? buildRangeMarketLink(row.market) : buildOptionsMarketLink(row.market)
                                }
                            />
                        ),
                        width: '30px',
                    });
                }

                return {
                    asset: {
                        currencyKey: row.currencyKey,
                    },
                    cells: cells,
                    link: isMobile
                        ? row.isRanged
                            ? buildRangeMarketLink(row.market)
                            : buildOptionsMarketLink(row.market)
                        : undefined,
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

    return <TileTable rows={rows as any} isLoading={isLoading} />;
};

export default PositionHistory;
