import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import TileTable from 'components/TileTable';
import { USD_SIGN } from 'constants/currency';
import { orderBy } from 'lodash';
import useClosedPositionsQuery from 'queries/profile/useClosedPositionsQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useTheme } from 'styled-components';
import { formatCurrency, formatCurrencyWithSign, formatShortDate } from 'thales-utils';
import { UserPosition } from 'types/profile';
import { RootState, ThemeInterface } from 'types/ui';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { IconLink, getAmount, getStatus } from '../styled-components';

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

    const closedPositions: UserPosition[] = useMemo(
        () => (closedPositionsQuery.isSuccess && closedPositionsQuery.data ? closedPositionsQuery.data : []),
        [closedPositionsQuery.isSuccess, closedPositionsQuery.data]
    );

    const data: UserPosition[] = useMemo(() => {
        return orderBy(closedPositions, ['maturityDate'], ['desc']);
    }, [closedPositions]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter(
            (position: UserPosition) => position.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
    }, [searchText, data]);

    const rows = useMemo(() => {
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
                                ? `${formatCurrencyWithSign(USD_SIGN, row.leftPrice)} - ${formatCurrencyWithSign(
                                      USD_SIGN,
                                      row.rightPrice
                                  )}`
                                : `${formatCurrencyWithSign(USD_SIGN, row.strikePrice)}`,
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
                            value: formatShortDate(row.maturityDate),
                        },
                    ];

                    if (!isMobile) {
                        cells.push({
                            value: (
                                <SPAAnchor
                                    href={
                                        row.isRanged
                                            ? buildRangeMarketLink(row.market, row.isDeprecatedCurrency, row.side)
                                            : buildOptionsMarketLink(row.market, row.isDeprecatedCurrency, row.side)
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
                                ? buildRangeMarketLink(row.market, row.isDeprecatedCurrency, row.side)
                                : buildOptionsMarketLink(row.market, row.isDeprecatedCurrency, row.side)
                            : undefined,
                    };
                });
            } catch (e) {
                console.log(e);
            }
        };

        if (filteredData.length > 0) {
            return generateRows(filteredData);
        }
        return [];
    }, [filteredData, isMobile, t, theme]);

    return <TileTable rows={rows as any} isLoading={closedPositionsQuery.isLoading} />;
};

export default PositionHistory;
