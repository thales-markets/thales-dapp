import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import TileTable from 'components/TileTable/TileTable';
import { USD_SIGN } from 'constants/currency';
import { millisecondsToSeconds } from 'date-fns';
import { Positions } from 'enums/options';
import { BigNumber } from 'ethers';
import { orderBy } from 'lodash';
import ChainedPositionAction from 'pages/SpeedMarkets/components/ChainedPositionAction';
import SharePositionModal from 'pages/Trade/components/AmmTrading/components/SharePositionModal/SharePositionModal';
import { ShareIcon } from 'pages/Trade/components/OpenPosition/OpenPosition';
import useUserActiveChainedSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveChainedSpeedMarketsDataQuery';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import usePythPriceQueries from 'queries/prices/usePythPriceQueries';
import useClaimablePositionsQuery from 'queries/profile/useClaimablePositionsQuery';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import { useTheme } from 'styled-components';
import { formatCurrency, formatCurrencyWithSign, formatShortDate, formatShortDateWithTime } from 'thales-utils';
import { SharePositionData } from 'types/flexCards';
import { UserPosition } from 'types/profile';
import { ThemeInterface } from 'types/ui';
import { isOnlySpeedMarketsSupported } from 'utils/network';
import { getPriceId } from 'utils/pyth';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import MyPositionAction from '../MyPositionAction';
import { IconLink, TextLink, getAmount } from '../styled-components';

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
        enabled: isAppReady && isWalletConnected && !isOnlySpeedMarketsSupported(networkId),
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

    const userActiveChainedSpeedMarketsDataQuery = useUserActiveChainedSpeedMarketsDataQuery(
        networkId,
        searchAddress || walletAddress,
        {
            enabled: isAppReady && isWalletConnected && !isOnlySpeedMarketsSupported(networkId),
        }
    );

    const userOpenChainedSpeedMarketsData = useMemo(
        () =>
            userActiveChainedSpeedMarketsDataQuery.isSuccess && userActiveChainedSpeedMarketsDataQuery.data
                ? userActiveChainedSpeedMarketsDataQuery.data
                : [],
        [userActiveChainedSpeedMarketsDataQuery]
    );

    // Prepare chained speed markets that are matured
    const userMaturedChainedMarkets = userOpenChainedSpeedMarketsData
        .filter((marketData) => marketData.isMatured)
        .map((marketData) => {
            return {
                ...marketData,
                pythPriceId: getPriceId(networkId, marketData.currencyKey),
            };
        });

    const priceRequests = userMaturedChainedMarkets
        .map((data) =>
            data.strikeTimes.map((strikeTime) => ({
                priceId: data.pythPriceId,
                publishTime: millisecondsToSeconds(strikeTime),
                market: data.address,
            }))
        )
        .flat();

    const pythPricesQueries = usePythPriceQueries(networkId, priceRequests, { enabled: priceRequests.length > 0 });
    const pythPricesWithMarket = priceRequests.map((request, i) => ({
        market: request.market,
        price: pythPricesQueries[i]?.data || 0,
    }));

    // Based on Pyth prices populate strike prices
    const userOpenChainedSpeedMarketsDataWithPrices = userMaturedChainedMarkets
        .map((marketData) => {
            const finalPrices = marketData.finalPrices.map(
                (_, i) =>
                    pythPricesWithMarket.filter((pythPrice) => pythPrice.market === marketData.address)[i]?.price || 0
            );
            const strikePrices = marketData.strikePrices.map((strikePrice, i) =>
                i === 0 ? strikePrice : finalPrices[i - 1]
            );
            const userWonStatuses = marketData.sides.map((side, i) =>
                finalPrices[i] > 0 && strikePrices[i] > 0
                    ? (side === Positions.UP && finalPrices[i] > strikePrices[i]) ||
                      (side === Positions.DOWN && finalPrices[i] < strikePrices[i])
                    : undefined
            );
            const canResolve =
                userWonStatuses.some((status) => status === false) ||
                userWonStatuses.every((status) => status !== undefined);
            const claimable = userWonStatuses.every((status) => status);
            return { ...marketData, strikePrices, finalPrices, canResolve, claimable };
        })
        .filter((marketData) => marketData.claimable);

    const data: UserPosition[] = useMemo(() => {
        const speedMarketsOpenPositions: UserPosition[] = userOpenSpeedMarketsData
            .filter((marketData) => marketData.claimable)
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

        const chainedSpeedMarketsOpenPositions: UserPosition[] = userOpenChainedSpeedMarketsDataWithPrices.map(
            (marketData) => {
                return {
                    positionAddress: marketData.address,
                    currencyKey: marketData.currencyKey,
                    strikePrice: marketData.strikePrices[marketData.strikePrices.length - 1],
                    leftPrice: 0,
                    rightPrice: 0,
                    finalPrice: marketData.finalPrices[marketData.finalPrices.length - 1],
                    amount: marketData.amount,
                    amountBigNumber: BigNumber.from(0), // won't be used
                    maturityDate: marketData.maturityDate,
                    expiryDate: marketData.maturityDate,
                    market: marketData.address,
                    side: marketData.sides[marketData.sides.length - 1],
                    paid: marketData.paid,
                    value: marketData.amount,
                    claimable: marketData.claimable,
                    claimed: false,
                    isRanged: false,
                    isSpeedMarket: true,
                    isChainedSpeedMarket: true,
                };
            }
        );

        return orderBy(
            claimablePositions.concat(speedMarketsOpenPositions).concat(chainedSpeedMarketsOpenPositions),
            ['maturityDate', 'value'],
            ['asc', 'desc']
        );
    }, [claimablePositions, userOpenSpeedMarketsData, userOpenChainedSpeedMarketsDataWithPrices]);

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
                    const chainedPosition = row.isChainedSpeedMarket
                        ? userOpenChainedSpeedMarketsDataWithPrices.find(
                              (marketData) => marketData.address === row.market
                          )
                        : undefined;
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
                            value: getAmount(formatCurrency(row.amount, 2), row.side, theme, row.isChainedSpeedMarket),
                        },
                        {
                            title: t('profile.history.expired'),
                            value: row.isSpeedMarket
                                ? formatShortDateWithTime(row.maturityDate)
                                : formatShortDate(row.maturityDate),
                        },
                        {
                            value: chainedPosition ? (
                                <ChainedPositionAction
                                    position={chainedPosition}
                                    isOverview={false}
                                    isAdmin={false}
                                    isSubmittingBatch={false}
                                    isProfileAction
                                />
                            ) : (
                                <MyPositionAction position={row} isProfileAction />
                            ),
                        },
                        {
                            value: (
                                <ShareIcon
                                    className="icon-home icon-home--twitter-x"
                                    disabled={false}
                                    onClick={() => {
                                        setOpenTwitterShareModal(true);
                                        if (row.isChainedSpeedMarket && chainedPosition) {
                                            setPositionShareData({
                                                type: 'chained-speed-won',
                                                positions: chainedPosition.sides,
                                                currencyKey: chainedPosition.currencyKey,
                                                strikeDate: chainedPosition.maturityDate,
                                                strikePrices: chainedPosition.strikePrices,
                                                finalPrices: chainedPosition.finalPrices,
                                                buyIn: chainedPosition.paid,
                                                payout: chainedPosition.amount,
                                                payoutMultiplier: chainedPosition.payoutMultiplier,
                                            });
                                        } else {
                                            setPositionShareData({
                                                type: row.isSpeedMarket ? 'resolved-speed' : 'resolved',
                                                positions: [row.side],
                                                currencyKey: row.currencyKey,
                                                strikePrices: [row.strikePrice],
                                                leftPrice: row.leftPrice,
                                                rightPrice: row.rightPrice,
                                                strikeDate: row.maturityDate,
                                                buyIn: row.paid,
                                                payout: row.amount,
                                            });
                                        }
                                    }}
                                />
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
                            isChainedPosition: row.isChainedSpeedMarket,
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
    }, [filteredData, isMobile, t, theme, userOpenChainedSpeedMarketsDataWithPrices]);

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
                    positions={positionsShareData.positions}
                    currencyKey={positionsShareData.currencyKey}
                    strikeDate={positionsShareData.strikeDate}
                    strikePrices={positionsShareData.strikePrices}
                    finalPrices={positionsShareData.finalPrices}
                    leftPrice={positionsShareData.leftPrice}
                    rightPrice={positionsShareData.rightPrice}
                    buyIn={positionsShareData.buyIn}
                    payout={positionsShareData.payout}
                    payoutMultiplier={positionsShareData.payoutMultiplier}
                    onClose={() => setOpenTwitterShareModal(false)}
                />
            )}
        </>
    );
};

export default ClaimablePositions;
