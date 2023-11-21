import * as pythEvmJs from '@pythnetwork/pyth-evm-js';
import PythInterfaceAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import Button from 'components/Button';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getInfoToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { SPEED_MARKETS_OVERVIEW_SECTIONS as SECTIONS } from 'constants/options';
import { CONNECTION_TIMEOUT_MS, PYTH_CONTRACT_ADDRESS, PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import { millisecondsToSeconds, secondsToMilliseconds } from 'date-fns';
import { Positions } from 'enums/options';
import { BigNumber, ethers } from 'ethers';
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
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { truncToDecimals } from 'thales-utils';
import { ChainedSpeedMarket } from 'types/options';
import { getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import { refetchActiveSpeedMarkets, refetchPythPrice } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { getUserLostAtSideIndex } from 'utils/speedAmm';
import { delay } from 'utils/timer';

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
    const now = useMemo(
        () =>
            activeChainedSpeedMarketsDataQuery.isSuccess && activeChainedSpeedMarketsDataQuery.data ? Date.now() : 0,
        [activeChainedSpeedMarketsDataQuery]
    );

    // Prepare chained speed markets that are partially matured to fetch Pyth prices
    const partiallyMaturedChainedMarkets = activeChainedSpeedMarketsData
        .filter((marketData) => marketData.strikeTimes.some((strikeTime) => strikeTime < now))
        .map((marketData) => {
            const strikeTimes = marketData.strikeTimes.filter((strikeTime) => strikeTime < now);
            return {
                ...marketData,
                strikeTimes,
                pythPriceId: getPriceId(networkId, marketData.currencyKey),
            };
        });

    const priceRequests = partiallyMaturedChainedMarkets
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

    // Based on Pyth prices determine if chained position is claimable
    const partiallyMaturedUnresolvedWithPrices = partiallyMaturedChainedMarkets.map((marketData) => {
        const finalPrices = marketData.strikeTimes.map(
            (_, i) => pythPricesWithMarket.filter((pythPrice) => pythPrice.market === marketData.address)[i].price
        );
        const strikePrices = marketData.strikePrices.map((strikePrice, i) =>
            i > 0 ? finalPrices[i - 1] : strikePrice
        );
        const userWonStatuses = marketData.sides.map((side, i) =>
            finalPrices[i] > 0
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
        (marketData) => marketData.isUnknownPrice
    );
    const openSpeedMarketsData = activeChainedSpeedMarketsData.filter(
        (marketData) =>
            !partiallyMaturedChainedMarkets.some((maturedMarket) => maturedMarket.address === marketData.address) ||
            (!userWinnerSpeedMarketsData.some((maturedMarket) => maturedMarket.address === marketData.address) &&
                !ammWinnerSpeedMarketsData.some((maturedMarket) => maturedMarket.address === marketData.address) &&
                !unknownPriceSpeedMarketsData.some((maturedMarket) => maturedMarket.address === marketData.address))
    );

    const isLoading =
        isLoadingEnabled &&
        (activeChainedSpeedMarketsDataQuery.isLoading || pythPricesQueries.some((price) => price.isLoading));

    useInterval(async () => {
        // Check if there are new matured markets from open markets and refresh it
        const openMatured = openSpeedMarketsData.filter((marketData) => marketData.maturityDate < Date.now());
        if (openMatured.length) {
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
        if (!positions.length) {
            return;
        }

        const priceConnection = new pythEvmJs.EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), {
            timeout: CONNECTION_TIMEOUT_MS,
        });

        const { chainedSpeedMarketsAMMContract, signer } = snxJSConnector as any;
        if (chainedSpeedMarketsAMMContract) {
            setIsSubmitting(true);
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

            const chainedSpeedMarketsAMMContractWithSigner = chainedSpeedMarketsAMMContract.connect(signer);

            const marketsToResolve: string[] = isAdmin
                ? positions.filter((position) => position.canResolve).map((position) => position.address)
                : [];

            const fetchUntilFinalPriceEndIndexes = positions.map((position) => getUserLostAtSideIndex(position) + 1);
            const manualFinalPrices: number[][] = isAdmin
                ? positions
                      .filter((position) => position.canResolve)
                      .map((position, i) =>
                          position.finalPrices
                              .slice(0, fetchUntilFinalPriceEndIndexes[i])
                              .map((finalPrice) =>
                                  Number(
                                      ethers.utils.parseUnits(
                                          truncToDecimals(finalPrice, PYTH_CURRENCY_DECIMALS),
                                          PYTH_CURRENCY_DECIMALS
                                      )
                                  )
                              )
                      )
                : [];

            const priceUpdateDataArray: string[][][] = [];
            let totalUpdateFee = BigNumber.from(0);

            // Fetch prices for non-admin resolve
            for (let index = 0; index < positions.length; index++) {
                if (isAdmin) {
                    break;
                }
                const position = positions[index];
                try {
                    const pythContract = new ethers.Contract(
                        PYTH_CONTRACT_ADDRESS[networkId],
                        PythInterfaceAbi as any,
                        (snxJSConnector as any).provider
                    );

                    let promises = [];
                    const pythPriceId = getPriceId(networkId, position.currencyKey);
                    const strikeTimesToFetchPrice = position.strikeTimes.slice(
                        0,
                        fetchUntilFinalPriceEndIndexes[index]
                    );
                    for (let i = 0; i < strikeTimesToFetchPrice.length; i++) {
                        promises.push(
                            priceConnection.getVaa(pythPriceId, millisecondsToSeconds(position.strikeTimes[i]))
                        );
                    }
                    const priceFeedUpdateVaas = await Promise.all(promises);

                    promises = [];
                    const priceUpdateDataPerMarket: string[][] = [];
                    for (let i = 0; i < strikeTimesToFetchPrice.length; i++) {
                        const [priceFeedUpdateVaa] = priceFeedUpdateVaas[i];
                        const priceUpdateData = ['0x' + Buffer.from(priceFeedUpdateVaa, 'base64').toString('hex')];
                        priceUpdateDataPerMarket.push(priceUpdateData);
                        promises.push(pythContract.getUpdateFee(priceUpdateData));
                    }
                    priceUpdateDataArray.push(priceUpdateDataPerMarket);

                    const updateFees = await Promise.all(promises);
                    totalUpdateFee = totalUpdateFee.add(
                        updateFees.reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from(0))
                    );
                    marketsToResolve.push(position.address);
                } catch (e) {
                    console.log(`Can't fetch VAA from Pyth API for marekt ${position.address}`, e);
                }
            }

            if (marketsToResolve.length > 0) {
                try {
                    const tx: ethers.ContractTransaction = isAdmin
                        ? await chainedSpeedMarketsAMMContractWithSigner.resolveMarketManuallyBatch(
                              marketsToResolve,
                              manualFinalPrices
                          )
                        : await chainedSpeedMarketsAMMContractWithSigner.resolveMarketsBatch(
                              marketsToResolve,
                              priceUpdateDataArray,
                              { value: totalUpdateFee }
                          );

                    const txResult = await tx.wait();

                    if (txResult && txResult.transactionHash) {
                        toast.update(id, getSuccessToastOptions(t(`speed-markets.overview.confirmation-message`), id));
                        refetchActiveSpeedMarkets(true, networkId);
                    }
                } catch (e) {
                    console.log(e);
                    await delay(800);
                    toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                }
            } else {
                toast.update(id, getInfoToastOptions(t('speed-markets.overview.no-resolve-positions'), id));
            }
            setIsSubmitting(false);
            setIsSubmittingSection('');
        }
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
                            positions
                                .sort((a, b) => a.maturityDate - b.maturityDate)
                                .map((position, index) => (
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
            {getSection(SECTIONS.userWinner, userWinnerSpeedMarketsData)}
            {getSection(SECTIONS.ammWinner, ammWinnerSpeedMarketsData)}
            {getSection(SECTIONS.unknownPrice, unknownPriceSpeedMarketsData)}
            {getSection(SECTIONS.openPositions, openSpeedMarketsData)}
        </Wrapper>
    );
};

export default UnresolvedChainedPositions;
