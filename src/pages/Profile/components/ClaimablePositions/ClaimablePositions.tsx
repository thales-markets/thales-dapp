import { USD_SIGN } from 'constants/currency';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { formatShortDate, formatShortDateWithTime } from 'utils/formatters/date';
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
import { ShareIcon } from 'pages/Trade/components/OpenPosition/OpenPosition';
import { SharePositionData } from 'types/flexCards';
import SharePositionModal from 'pages/Trade/components/AmmTrading/components/SharePositionModal/SharePositionModal';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import { orderBy } from 'lodash';

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

    const [openTwitterShareModal, setOpenTwitterShareModal] = useState<boolean>(false);
    const [positionsShareData, setPositionShareData] = useState<SharePositionData | null>(null);

    const claimablePositionsQuery = useClaimablePositionsQuery(networkId, searchAddress || walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const claimablePositions: UserPosition[] = useMemo(
        () => (claimablePositionsQuery.isSuccess && claimablePositionsQuery.data ? claimablePositionsQuery.data : []),
        [claimablePositionsQuery.isSuccess, claimablePositionsQuery.data]
    );

    const userActiveSpeedMarketsDataQuery = useUserActiveSpeedMarketsDataQuery(
        networkId,
        searchAddress || walletAddress,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );

    const userOpenSpeedMarketsData = useMemo(
        () =>
            userActiveSpeedMarketsDataQuery.isSuccess && userActiveSpeedMarketsDataQuery.data
                ? userActiveSpeedMarketsDataQuery.data
                : [],
        [userActiveSpeedMarketsDataQuery]
    );

    const data: UserPosition[] = useMemo(() => {
        const speedMarketsOpenPositions: UserPosition[] = userOpenSpeedMarketsData
            .filter((marketData) => marketData.maturityDate < Date.now() && marketData.claimable)
            .map((marketData) => {
                return {
                    positionAddress: marketData.positionAddress,
                    currencyKey: marketData.currencyKey,
                    strikePrice: marketData.strikePriceNum || 0,
                    leftPrice: 0,
                    rightPrice: 0,
                    finalPrice: marketData.finalPrice || 0,
                    amount: marketData.amount,
                    amountBigNumber: marketData.amountBigNumber,
                    maturityDate: marketData.maturityDate,
                    expiryDate: marketData.maturityDate,
                    market: marketData.market,
                    side: marketData.side,
                    paid: marketData.paid,
                    value: marketData.value,
                    claimable: !!marketData.claimable,
                    claimed: false,
                    isRanged: false,
                    isSpeedMarket: true,
                };
            });

        return orderBy(
            claimablePositions.concat(speedMarketsOpenPositions),
            ['maturityDate', 'value'],
            ['asc', 'desc']
        );
    }, [claimablePositions, userOpenSpeedMarketsData]);

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
                        {
                            value: <MyPositionAction position={row} isProfileAction />,
                        },
                        {
                            value: (
                                <>
                                    <ShareIcon
                                        className="icon-home icon-home--twitter-x"
                                        disabled={false}
                                        onClick={() => {
                                            setOpenTwitterShareModal(true);
                                            setPositionShareData({
                                                type: row.claimable
                                                    ? row.isSpeedMarket
                                                        ? 'resolved-speed'
                                                        : 'resolved'
                                                    : row.isSpeedMarket
                                                    ? 'potential-speed'
                                                    : 'potential',
                                                position: row.side,
                                                currencyKey: row.currencyKey,
                                                strikePrice: row.strikePrice,
                                                leftPrice: row.leftPrice,
                                                rightPrice: row.rightPrice,
                                                strikeDate: row.maturityDate,
                                                buyIn: row.paid,
                                                payout: row.amount,
                                            });
                                        }}
                                    />
                                </>
                            ),
                            width: isMobile ? undefined : '20px',
                        },
                        {
                            value: !row.isSpeedMarket && (
                                <SPAAnchor
                                    href={
                                        row.isRanged
                                            ? buildRangeMarketLink(row.market, row.side)
                                            : buildOptionsMarketLink(row.market, row.side)
                                    }
                                >
                                    {isMobile ? (
                                        <TextLink>
                                            {t('profile.go-to-market')}{' '}
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

        if (filteredData.length > 0) {
            return generateRows(filteredData);
        }
        return [];
    }, [filteredData, isMobile, t, theme]);

    return (
        <>
            <TileTable
                rows={rows as any}
                isLoading={claimablePositionsQuery.isLoading || userActiveSpeedMarketsDataQuery.isLoading}
                hideFlow
            />
            {positionsShareData !== null && openTwitterShareModal && (
                <SharePositionModal
                    type={positionsShareData.type}
                    position={positionsShareData.position}
                    currencyKey={positionsShareData.currencyKey}
                    strikeDate={positionsShareData.strikeDate}
                    strikePrice={positionsShareData.strikePrice}
                    leftPrice={positionsShareData.leftPrice}
                    rightPrice={positionsShareData.rightPrice}
                    buyIn={positionsShareData.buyIn}
                    payout={positionsShareData.payout}
                    onClose={() => setOpenTwitterShareModal(false)}
                />
            )}
        </>
    );
};

export default ClaimablePositions;
