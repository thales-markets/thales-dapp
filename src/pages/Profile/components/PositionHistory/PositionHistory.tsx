import TileTable from 'components/TileTable';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { formatShortDate, formatShortDateWithTime } from 'utils/formatters/date';
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
import useUserResolvedSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserResolvedSpeedMarketsDataQuery';
import { orderBy } from 'lodash';
import { ZERO_ADDRESS } from 'constants/network';

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

    const closedSpeedMarketsDataQuery = useUserResolvedSpeedMarketsDataQuery(
        networkId,
        searchAddress || walletAddress,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );

    const closedSpeedMarketsData = useMemo(
        () =>
            closedSpeedMarketsDataQuery.isSuccess && closedSpeedMarketsDataQuery.data
                ? closedSpeedMarketsDataQuery.data
                : [],
        [closedSpeedMarketsDataQuery]
    );

    const data: UserPosition[] = useMemo(() => {
        const speedMarketsClosedPositions: UserPosition[] = closedSpeedMarketsData.map((marketData) => {
            return {
                positionAddress: ZERO_ADDRESS,
                currencyKey: marketData.currencyKey,
                strikePrice: marketData.strikePriceNum,
                leftPrice: 0,
                rightPrice: 0,
                finalPrice: marketData.finalPrice,
                amount: marketData.amount,
                amountBigNumber: marketData.amountBigNumber,
                maturityDate: marketData.maturityDate,
                expiryDate: marketData.maturityDate,
                market: marketData.market,
                side: marketData.side,
                paid: marketData.paid,
                value: marketData.value,
                claimable: false,
                claimed: marketData.isUserWinner,
                isRanged: false,
                isSpeedMarket: true,
            };
        });

        return orderBy(closedPositions.concat(speedMarketsClosedPositions), ['maturityDate'], ['desc']);
    }, [closedPositions, closedSpeedMarketsData]);

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
                            value: row.isSpeedMarket
                                ? formatShortDateWithTime(row.maturityDate)
                                : formatShortDate(row.maturityDate),
                        },
                    ];

                    if (!isMobile) {
                        cells.push({
                            value: !row.isSpeedMarket && (
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

        if (filteredData.length > 0) {
            return generateRows(filteredData);
        }
        return [];
    }, [filteredData, isMobile, t, theme]);

    return <TileTable rows={rows as any} isLoading={closedPositionsQuery.isLoading} />;
};

export default PositionHistory;
