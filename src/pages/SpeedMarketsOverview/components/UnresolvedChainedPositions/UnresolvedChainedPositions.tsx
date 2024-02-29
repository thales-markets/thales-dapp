import Button from 'components/Button';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import { SPEED_MARKETS_OVERVIEW_SECTIONS as SECTIONS } from 'constants/options';
import { millisecondsToSeconds, secondsToMilliseconds } from 'date-fns';
import { Positions } from 'enums/options';
import useInterval from 'hooks/useInterval';
import ChainedPosition from 'pages/SpeedMarkets/components/ChainedPosition';
import {
    LoaderContainer,
    NoPositionsText,
    PositionsWrapper,
    Row,
    Title,
    Wrapper,
    getAdditionalButtonStyle,
    getDefaultButtonProps,
} from 'pages/SpeedMarketsOverview/styled-components';
import useActiveChainedSpeedMarketsDataQuery from 'queries/options/speedMarkets/useActiveChainedSpeedMarketsDataQuery';
import useAmmChainedSpeedMarketsLimitsQuery from 'queries/options/speedMarkets/useAmmChainedSpeedMarketsLimitsQuery';
import usePythPriceQueries from 'queries/prices/usePythPriceQueries';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import { ChainedSpeedMarket } from 'types/options';
import { getPriceId } from 'utils/pyth';
import { refetchActiveSpeedMarkets, refetchPythPrice } from 'utils/queryConnector';
import { resolveAllChainedMarkets } from 'utils/speedAmm';

const UnresolvedChainedPositions: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingSection, setIsSubmittingSection] = useState('');
    const [isLoadingEnabled, setIsLoadingEnabled] = useState(true);

    const ammChainedSpeedMarketsLimitsQuery = useAmmChainedSpeedMarketsLimitsQuery(networkId, walletAddress, {
        enabled: isAppReady,
    });

    const ammChainedSpeedMarketsLimitsData = useMemo(() => {
        return ammChainedSpeedMarketsLimitsQuery.isSuccess ? ammChainedSpeedMarketsLimitsQuery.data : null;
    }, [ammChainedSpeedMarketsLimitsQuery]);

    const activeChainedSpeedMarketsDataQuery = useActiveChainedSpeedMarketsDataQuery(networkId, {
        enabled: isAppReady,
    });

    const activeChainedSpeedMarketsData = useMemo(
        () =>
            activeChainedSpeedMarketsDataQuery.isSuccess && activeChainedSpeedMarketsDataQuery.data
                ? activeChainedSpeedMarketsDataQuery.data
                : [],

        [activeChainedSpeedMarketsDataQuery]
    );

    // Prepare chained speed markets that are partially matured to fetch Pyth prices
    const partiallyMaturedChainedMarkets = activeChainedSpeedMarketsData
        .filter((marketData) => marketData.strikeTimes.some((strikeTime) => strikeTime < Date.now()))
        .map((marketData) => {
            return {
                ...marketData,
                pythPriceId: getPriceId(networkId, marketData.currencyKey),
            };
        });

    const priceRequests = partiallyMaturedChainedMarkets
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

    // Based on Pyth prices determine if chained position is claimable
    const partiallyMaturedUnresolvedWithPrices = partiallyMaturedChainedMarkets.map((marketData) => {
        const finalPrices = marketData.strikeTimes.map(
            (_, i) => pythPricesWithMarket.filter((pythPrice) => pythPrice.market === marketData.address)[i]?.price || 0
        );
        const strikePrices = marketData.strikePrices.map((strikePrice, i) =>
            i > 0 ? finalPrices[i - 1] : strikePrice
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
        const isUnknownPrice = marketData.isMatured && userWonStatuses.some((status) => status === undefined);

        return { ...marketData, strikePrices, finalPrices, canResolve, claimable, isUnknownPrice };
    });

    const userWinnerSpeedMarketsData = partiallyMaturedUnresolvedWithPrices.filter(
        (marketData) => marketData.claimable
    );
    const ammWinnerSpeedMarketsData = partiallyMaturedUnresolvedWithPrices.filter(
        (marketData) => marketData.canResolve && !marketData.claimable
    );
    const unknownPriceSpeedMarketsData = partiallyMaturedUnresolvedWithPrices.filter(
        (marketData) => !marketData.canResolve && marketData.isUnknownPrice
    );
    const openSpeedMarketsData = activeChainedSpeedMarketsData
        .filter(
            (marketData) =>
                !partiallyMaturedUnresolvedWithPrices.some(
                    (maturedMarket) => maturedMarket.address === marketData.address
                )
        )
        .concat(
            partiallyMaturedUnresolvedWithPrices.filter(
                (marketData) =>
                    !userWinnerSpeedMarketsData.some((maturedMarket) => maturedMarket.address === marketData.address) &&
                    !ammWinnerSpeedMarketsData.some((maturedMarket) => maturedMarket.address === marketData.address) &&
                    !unknownPriceSpeedMarketsData.some((maturedMarket) => maturedMarket.address === marketData.address)
            )
        );

    const isLoading =
        isLoadingEnabled &&
        (activeChainedSpeedMarketsDataQuery.isLoading || pythPricesQueries.some((price) => price.isLoading));

    // Used for canceling asynchronous tasks
    const mountedRef = useRef(true);
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useInterval(async () => {
        // Check if there are new matured markets from open markets and refresh it
        const openMatured = openSpeedMarketsData.filter((marketData) =>
            marketData.strikeTimes.some((strikeTime, i) => !marketData.finalPrices[i] && strikeTime < Date.now())
        );
        if (openMatured.length) {
            if (!mountedRef.current) return null;
            setIsLoadingEnabled(false);
            refetchActiveSpeedMarkets(true, networkId);
        }
        // Check if missing price is available
        if (unknownPriceSpeedMarketsData.length) {
            unknownPriceSpeedMarketsData.forEach((marketData) => {
                const priceId = getPriceId(networkId, marketData.currencyKey);
                marketData.finalPrices.forEach((finalPrice, i) => {
                    if (finalPrice === 0) {
                        const publishTime = millisecondsToSeconds(marketData.strikeTimes[i]);
                        refetchPythPrice(priceId, publishTime);
                    }
                });
            });
        }
    }, secondsToMilliseconds(10));

    const handleResolveAll = async (positions: ChainedSpeedMarket[], isAdmin: boolean) => {
        setIsSubmitting(true);
        await resolveAllChainedMarkets(positions, isAdmin, networkId);
        if (!mountedRef.current) return null;
        setIsSubmitting(false);
        setIsSubmittingSection('');
    };

    const getButton = (
        positions: ChainedSpeedMarket[],
        sectionName: typeof SECTIONS[keyof typeof SECTIONS],
        isAdmin: boolean
    ) => {
        return (
            !isLoading &&
            !!positions.length && (
                <Button
                    {...getDefaultButtonProps(isMobile)}
                    disabled={isSubmitting || !positions.length}
                    additionalStyles={getAdditionalButtonStyle(isMobile)}
                    onClick={() => {
                        setIsSubmittingSection(sectionName);
                        handleResolveAll(positions, isAdmin);
                    }}
                >
                    {isSubmittingSection === sectionName
                        ? t(`speed-markets.overview.resolve-progress`)
                        : isAdmin
                        ? `${t('common.admin')} ${t('speed-markets.overview.resolve-all')}`
                        : t('speed-markets.overview.resolve-all')}
                </Button>
            )
        );
    };

    const getSection = (section: typeof SECTIONS[keyof typeof SECTIONS], positions: ChainedSpeedMarket[]) => {
        let titleKey = '';
        switch (section) {
            case SECTIONS.userWinner:
                titleKey = 'speed-markets.overview.user-title';
                break;
            case SECTIONS.ammWinner:
                titleKey = 'speed-markets.overview.amm-title';
                break;
            case SECTIONS.unknownPrice:
                titleKey = 'speed-markets.overview.unknown-price-title';
                break;
            case SECTIONS.openPositions:
                titleKey = 'speed-markets.overview.open-positions-title';
                break;
            default:
        }

        const isAdmin = !!ammChainedSpeedMarketsLimitsData?.whitelistedAddress && section === SECTIONS.ammWinner;

        return (
            <>
                <Row>
                    <Title>{`${t(titleKey)} (${positions.length})`}</Title>
                    {[SECTIONS.userWinner, SECTIONS.ammWinner].includes(section) &&
                        getButton(positions, section, isAdmin)}
                </Row>
                {isLoading ? (
                    <LoaderContainer>
                        <SimpleLoader />
                    </LoaderContainer>
                ) : (
                    <PositionsWrapper hasPositions={positions.length > 0} isChained>
                        {positions.length > 0 ? (
                            positions.map((position, index) => (
                                <ChainedPosition
                                    position={position}
                                    maxPriceDelayForResolvingSec={
                                        ammChainedSpeedMarketsLimitsData?.maxPriceDelayForResolvingSec
                                    }
                                    isOverview
                                    isAdmin={isAdmin}
                                    isSubmittingBatch={isSubmitting}
                                    key={`${section}${index}`}
                                />
                            ))
                        ) : (
                            <NoPositionsText>{t('speed-markets.overview.no-positions')}</NoPositionsText>
                        )}
                    </PositionsWrapper>
                )}
            </>
        );
    };

    return (
        <Wrapper>
            {getSection(
                SECTIONS.userWinner,
                userWinnerSpeedMarketsData.sort((a, b) => b.maturityDate - a.maturityDate)
            )}
            {getSection(
                SECTIONS.ammWinner,
                ammWinnerSpeedMarketsData.sort((a, b) => b.maturityDate - a.maturityDate)
            )}
            {getSection(
                SECTIONS.unknownPrice,
                unknownPriceSpeedMarketsData.sort((a, b) => b.maturityDate - a.maturityDate)
            )}
            {getSection(
                SECTIONS.openPositions,
                openSpeedMarketsData.sort((a, b) => a.maturityDate - b.maturityDate)
            )}
        </Wrapper>
    );
};

export default UnresolvedChainedPositions;
