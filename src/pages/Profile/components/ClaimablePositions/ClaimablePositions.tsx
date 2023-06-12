import { USD_SIGN } from 'constants/currency';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { getAmount, IconLink, TextLink } from '../styled-components';
import { UserPosition } from 'types/profile';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsMobile } from 'redux/modules/ui';
import TileTable from 'components/TileTable/TileTable';
import MyPositionAction from '../MyPositionAction';
import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import useClaimablePositionsQuery from 'queries/profile/useClaimablePositionsQuery';

type ClaimablePositionsProps = {
    searchAddress: string;
    searchText: string;
};

const ClaimablePositions: React.FC<ClaimablePositionsProps> = ({ searchAddress, searchText }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const claimablePositionsQuery = useClaimablePositionsQuery(networkId, searchAddress || walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const claimablePositions: UserPosition[] =
        claimablePositionsQuery.isSuccess && claimablePositionsQuery.data ? claimablePositionsQuery.data : [];

    const filteredData = useMemo(() => {
        if (searchText === '') return claimablePositions;
        return claimablePositions.filter(
            (position: UserPosition) => position.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
    }, [searchText, claimablePositions]);

    const generateRows = (data: UserPosition[]) => {
        try {
            return data.map((row: UserPosition) => {
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
                        value: <MyPositionAction position={row} isProfileAction />,
                    },
                    {
                        value: (
                            <SPAAnchor
                                href={
                                    row.isRanged
                                        ? buildRangeMarketLink(row.market, row.side)
                                        : buildOptionsMarketLink(row.market, row.side)
                                }
                            >
                                {isMobile ? (
                                    <TextLink>
                                        {t('options.trading-profile.go-to-market')}{' '}
                                        <IconLink
                                            className="icon icon--right"
                                            fontSize="10px"
                                            marginTop="-2px"
                                            color={theme.link.textColor.primary}
                                        />
                                    </TextLink>
                                ) : (
                                    <IconLink className="icon icon--right" />
                                )}
                            </SPAAnchor>
                        ),
                        width: isMobile ? undefined : '30px',
                    },
                ];

                return {
                    asset: {
                        currencyKey: row.currencyKey,
                        position: row.side,
                        width: '50px',
                        displayInRowMobile: true,
                    },
                    cells: cells,
                    displayInRowMobile: true,
                    gap: '8px',
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

    return <TileTable rows={rows as any} isLoading={claimablePositionsQuery.isLoading} hideFlow />;
};

export default ClaimablePositions;
