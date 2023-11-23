import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import TileTable from 'components/TileTable/TileTable';
import Tooltip from 'components/Tooltip/Tooltip';
import { CRYPTO_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { CONNECTION_TIMEOUT_MS, SUPPORTED_ASSETS } from 'constants/pyth';
import { millisecondsToSeconds, secondsToMilliseconds } from 'date-fns';
import { Positions } from 'enums/options';
import { BigNumber } from 'ethers';
import useInterval from 'hooks/useInterval';
import { orderBy } from 'lodash';
import MaturityDate from 'pages/AMMTrading/components/MaturityDate/MaturityDate';
import SharePositionModal from 'pages/Trade/components/AmmTrading/components/SharePositionModal';
import { ShareIcon } from 'pages/Trade/components/OpenPosition/OpenPosition';
import useUserActiveChainedSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveChainedSpeedMarketsDataQuery';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import usePythPriceQueries from 'queries/prices/usePythPriceQueries';
import useOpenPositionsQuery from 'queries/profile/useOpenPositionsQuery';
import useExchangeRatesQuery, { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTheme } from 'styled-components';
import { formatCurrency, formatCurrencyWithSign } from 'thales-utils';
import { SharePositionData } from 'types/flexCards';
import { UserPosition } from 'types/profile';
import { ThemeInterface } from 'types/ui';
import { getCurrentPrices, getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import MyPositionAction from '../MyPositionAction/MyPositionAction';
import { IconLink, TextLink, getAmount } from '../styled-components';

type OpenPositionsProps = {
    searchAddress: string;
    searchText: string;
};

const OpenPositions: React.FC<OpenPositionsProps> = ({ searchAddress, searchText }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [openTwitterShareModal, setOpenTwitterShareModal] = useState<boolean>(false);
    const [positionsShareData, setPositionShareData] = useState<SharePositionData | null>(null);
    const [currentPrices, setCurrentPrices] = useState<{ [key: string]: number }>({
        [CRYPTO_CURRENCY_MAP.BTC]: 0,
        [CRYPTO_CURRENCY_MAP.ETH]: 0,
    });

    const priceConnection = useMemo(() => {
        return new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), { timeout: CONNECTION_TIMEOUT_MS });
    }, [networkId]);

    const fetchCurrentPrice = useCallback(async () => {
        const priceIds = SUPPORTED_ASSETS.map((asset) => getPriceId(networkId, asset));
        const prices: typeof currentPrices = await getCurrentPrices(priceConnection, networkId, priceIds);
        setCurrentPrices(prices);
    }, [networkId, priceConnection]);

    // Set initial current price
    useEffect(() => {
        fetchCurrentPrice();
    }, [fetchCurrentPrice]);

    // Update current price on every 10 seconds
    useInterval(async () => {
        fetchCurrentPrice();
    }, secondsToMilliseconds(10));

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery(networkId, {
        enabled: isAppReady,
    });
    const exchangeRates: Rates | null =
        exchangeRatesMarketDataQuery.isSuccess && exchangeRatesMarketDataQuery.data
            ? exchangeRatesMarketDataQuery.data
            : null;

    const openPositionsQuery = useOpenPositionsQuery(networkId, searchAddress || walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const openPositions: UserPosition[] = useMemo(
        () => (openPositionsQuery.isSuccess && openPositionsQuery.data ? openPositionsQuery.data : []),
        [openPositionsQuery.isSuccess, openPositionsQuery.data]
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
            enabled: isAppReady && isWalletConnected,
        }
    );

    const userOpenChainedSpeedMarketsData = useMemo(
        () =>
            userActiveChainedSpeedMarketsDataQuery.isSuccess && userActiveChainedSpeedMarketsDataQuery.data
                ? userActiveChainedSpeedMarketsDataQuery.data
                : [],
        [userActiveChainedSpeedMarketsDataQuery]
    );

    // Prepare chained speed markets that are not matured
    const userOpenChainedMarkets = userOpenChainedSpeedMarketsData
        .filter((marketData) => !marketData.isMatured)
        .map((marketData) => {
            return {
                ...marketData,
                pythPriceId: getPriceId(networkId, marketData.currencyKey),
            };
        });

    const priceRequests = userOpenChainedMarkets
        .map((data) =>
            data.strikeTimes
                .filter((strikeTime) => strikeTime < Date.now())
                .map((strikeTime) => ({
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
    const userOpenChainedSpeedMarketsDataWithPrices = userOpenChainedMarkets.map((marketData) => {
        const finalPrices = marketData.finalPrices.map(
            (_, i) => pythPricesWithMarket.filter((pythPrice) => pythPrice.market === marketData.address)[i]?.price || 0
        );
        const strikePrices = marketData.strikePrices.map((strikePrice, i) =>
            i === 0 ? strikePrice : finalPrices[i - 1]
        );
        const lastStrikePrice = [...strikePrices].reverse().find((strikePrice) => strikePrice);
        const currentSide = marketData.sides[marketData.strikeTimes.findIndex((strikeTime) => strikeTime < Date.now())];
        const userWonStatuses = marketData.sides.map((side, i) =>
            finalPrices[i] > 0
                ? (side === Positions.UP && finalPrices[i] > strikePrices[i]) ||
                  (side === Positions.DOWN && finalPrices[i] < strikePrices[i])
                : undefined
        );
        const userLost = userWonStatuses.some((status) => status === false);
        return { ...marketData, strikePrices, userLost, lastStrikePrice, currentSide };
    });

    const data = useMemo(() => {
        const speedMarketsOpenPositions: UserPosition[] = userOpenSpeedMarketsData
            .filter((marketData) => marketData.maturityDate > Date.now())
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
                } as UserPosition;
            });

        const chainedSpeedMarketsOpenPositions: UserPosition[] = userOpenChainedSpeedMarketsDataWithPrices
            .filter((marketData) => !marketData.userLost)
            .map((marketData) => {
                return {
                    positionAddress: marketData.address,
                    currencyKey: marketData.currencyKey,
                    strikePrice: marketData.lastStrikePrice,
                    leftPrice: 0,
                    rightPrice: 0,
                    finalPrice: 0, // won't be used
                    amount: marketData.amount,
                    amountBigNumber: BigNumber.from(0), // won't be used
                    maturityDate: marketData.maturityDate,
                    expiryDate: marketData.maturityDate,
                    market: marketData.address,
                    side: marketData.currentSide,
                    paid: marketData.paid,
                    value: marketData.amount,
                    claimable: marketData.claimable,
                    claimed: false,
                    isRanged: false,
                    isSpeedMarket: true,
                    isChainedSpeedMarket: true,
                } as UserPosition;
            });

        return orderBy(
            openPositions.concat(speedMarketsOpenPositions).concat(chainedSpeedMarketsOpenPositions),
            ['maturityDate', 'value'],
            ['asc', 'desc']
        );
    }, [openPositions, userOpenSpeedMarketsData, userOpenChainedSpeedMarketsDataWithPrices]);

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
                            title: (
                                <>
                                    {t('profile.current-price')}
                                    {row.isSpeedMarket && <Tooltip overlay={t('profile.current-price-tooltip')} />}
                                </>
                            ),
                            value: row.isSpeedMarket
                                ? formatCurrencyWithSign(USD_SIGN, currentPrices[row.currencyKey])
                                : formatCurrencyWithSign(USD_SIGN, exchangeRates?.[row.currencyKey] || 0),
                        },
                        {
                            title: t('profile.leaderboard.trades.table.amount-col'),
                            value: getAmount(formatCurrency(row.amount, 2), row.side, theme, row.isChainedSpeedMarket),
                        },
                        {
                            title: t('profile.history.paid'),
                            value: `$${formatCurrency(row.paid)}`,
                        },
                        {
                            title: t('profile.history.expires'),
                            value: (
                                <MaturityDate
                                    maturityDateUnix={row.maturityDate}
                                    showFullCounter
                                    showDateWithTime={row.isSpeedMarket}
                                />
                            ),
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
                                                type:
                                                    row.isSpeedMarket && row.claimable
                                                        ? 'resolved-speed'
                                                        : row.claimable
                                                        ? 'resolved'
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
                        backgroundColor: theme.background.secondary,
                        asset: {
                            currencyKey: row.currencyKey,
                            position: row.side,
                            isChainedPosition: row.isChainedSpeedMarket,
                            width: '50px',
                            displayInRowMobile: true,
                            hideFullName: true,
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
    }, [filteredData, isMobile, exchangeRates, t, theme, currentPrices]);

    return (
        <>
            <TileTable
                rows={rows as any}
                isLoading={
                    openPositionsQuery.isLoading ||
                    userActiveSpeedMarketsDataQuery.isLoading ||
                    userActiveChainedSpeedMarketsDataQuery.isLoading
                }
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

export default OpenPositions;
