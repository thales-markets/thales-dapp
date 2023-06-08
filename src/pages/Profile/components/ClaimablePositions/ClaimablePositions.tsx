import { USD_SIGN } from 'constants/currency';
import { orderBy } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { getAmount, IconLink } from '../styled-components';
import { UserPosition } from 'types/options';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsMobile } from 'redux/modules/ui';
import TileTable from 'components/TileTable/TileTable';
import MyPositionAction from '../MyPositionAction';
import SPAAnchor from 'components/SPAAnchor/SPAAnchor';

type ClaimablePositionsProps = {
    claimablePositions: UserPosition[];
    searchText: string;
    isLoading: boolean;
};

const ClaimablePositions: React.FC<ClaimablePositionsProps> = ({ claimablePositions, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const data = useMemo(
        () => orderBy(claimablePositions, ['maturityDate', 'value', 'priceDiff'], ['asc', 'desc', 'asc']),
        [claimablePositions]
    );

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
                    {
                        value: <MyPositionAction position={row} />,
                    },
                ];

                if (!isMobile) {
                    cells.push({
                        value: (
                            <SPAAnchor
                                href={
                                    row.isRanged ? buildRangeMarketLink(row.market) : buildOptionsMarketLink(row.market)
                                }
                            >
                                <IconLink className="icon icon--right" />
                            </SPAAnchor>
                        ),
                        width: '30px',
                    });
                }

                return {
                    asset: {
                        currencyKey: row.currencyKey,
                        position: row.side,
                        width: '50px',
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

    return <TileTable rows={rows as any} isLoading={isLoading} hideFlow />;
};

export default ClaimablePositions;
