import TileTable from 'components/TileTable';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { IconLink, getAmount, getStatus } from '../styled-components';
import { UserPosition } from 'types/profile';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsMobile } from 'redux/modules/ui';
import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import useClosedPositionsQuery from 'queries/profile/useClosedPositionsQuery';

type PositionHistoryProps = {
    searchAddress: string;
    searchText: string;
};

const PositionHistory: React.FC<PositionHistoryProps> = ({ searchAddress, searchText }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const closedPositionsQuery = useClosedPositionsQuery(networkId, searchAddress || walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const closedPositions: UserPosition[] =
        closedPositionsQuery.isSuccess && closedPositionsQuery.data ? closedPositionsQuery.data : [];

    const filteredData = useMemo(() => {
        if (searchText === '') return closedPositions;
        return closedPositions.filter(
            (position: UserPosition) => position.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
    }, [searchText, closedPositions]);

    const generateRows = (data: UserPosition[]) => {
        try {
            return data.map((row: UserPosition) => {
                const cells: any = [
                    {
                        value: getStatus(row.claimed, theme, t),
                    },
                    {
                        title: row.isRanged
                            ? t('markets.market.ranged-markets.strike-range')
                            : t(`profile.strike-price`),
                        value: row.isRanged
                            ? `$${formatCurrency(row.leftPrice)} - $${formatCurrency(row.rightPrice)}`
                            : `$${formatCurrency(row.strikePrice)}`,
                    },
                    {
                        title: t('profile.final-price'),
                        value: formatCurrencyWithSign(USD_SIGN, row.finalPrice),
                    },
                    {
                        title: t('profile.leaderboard.trades.table.amount-col'),
                        value: getAmount(formatCurrency(row.amount, 2), row.side, theme),
                    },
                    {
                        title: t('profile.history.expired'),
                        value: formatShortDate(row.maturityDate).toUpperCase(),
                    },
                ];

                if (!isMobile) {
                    cells.push({
                        value: (
                            <SPAAnchor
                                href={
                                    row.isRanged
                                        ? buildRangeMarketLink(row.market, row.side)
                                        : buildOptionsMarketLink(row.market, row.side)
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
                    },
                    cells: cells,
                    link: isMobile
                        ? row.isRanged
                            ? buildRangeMarketLink(row.market, row.side)
                            : buildOptionsMarketLink(row.market, row.side)
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

    return <TileTable rows={rows as any} isLoading={closedPositionsQuery.isLoading} />;
};

export default PositionHistory;
