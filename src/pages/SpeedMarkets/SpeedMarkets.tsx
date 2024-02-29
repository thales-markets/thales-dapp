import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import banner from 'assets/images/speed-markets/speed-markets-banner.png';
import PageLinkBanner from 'components/PageLinkBanner';
import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import SimpleLoader from 'components/SimpleLoader';
import SwitchInput from 'components/SwitchInput';
import Tooltip from 'components/Tooltip';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';
import { CONNECTION_TIMEOUT_MS, SUPPORTED_ASSETS } from 'constants/pyth';
import ROUTES from 'constants/routes';
import { secondsToMilliseconds } from 'date-fns';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useInterval from 'hooks/useInterval';
import OpenPositions from 'pages/Trade/components/OpenPositions';
import useAmmChainedSpeedMarketsLimitsQuery from 'queries/options/speedMarkets/useAmmChainedSpeedMarketsLimitsQuery';
import useAmmSpeedMarketsLimitsQuery from 'queries/options/speedMarkets/useAmmSpeedMarketsLimitsQuery';
import queryString from 'query-string';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled, { useTheme } from 'styled-components';
import { BoldText, FlexDivCentered, FlexDivRowCentered, FlexDivSpaceBetween, FlexDivStart } from 'styles/common';
import { roundNumberToDecimals } from 'thales-utils';
import { ThemeInterface } from 'types/ui';
import { getSupportedNetworksByRoute } from 'utils/network';
import { getCurrentPrices, getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import { buildHref, history } from 'utils/routes';
import AmmSpeedTrading from './components/AmmSpeedTrading';
import ClosedPositions from './components/ClosedPositions';
import SelectAsset from './components/SelectAsset';
import SelectBuyin from './components/SelectBuyin';
import SelectPosition from './components/SelectPosition';
import { SelectedPosition } from './components/SelectPosition/SelectPosition';
import SelectTime from './components/SelectTime';
import LightweightChart from 'pages/Trade/components/PriceChart/LightweightChart';

const SpeedMarkets: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const theme: ThemeInterface = useTheme();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const isChainedSupported = getSupportedNetworksByRoute(ROUTES.Options.ChainedSpeedMarkets).includes(networkId);
    const isChainedMarkets = isChainedSupported && queryString.parse(location.search).isChained === 'true';

    const [isChained, setIsChained] = useState(isChainedMarkets);
    const [currentPrices, setCurrentPrices] = useState<{ [key: string]: number }>({
        [CRYPTO_CURRENCY_MAP.BTC]: 0,
        [CRYPTO_CURRENCY_MAP.ETH]: 0,
    });
    const [currencyKey, setCurrencyKey] = useState(SUPPORTED_ASSETS[0]);
    const [positionType, setPositionType] = useState<SelectedPosition>(undefined);
    const [chainedPositions, setChainedPositions] = useState<SelectedPosition[]>([undefined, undefined]);
    const [deltaTimeSec, setDeltaTimeSec] = useState(0);
    const [strikeTimeSec, setStrikeTimeSec] = useState(0);
    const [selectedStableBuyinAmount, setSelectedStableBuyinAmount] = useState(0);
    const [isResetTriggered, setIsResetTriggered] = useState(false);
    const [skew, setSkew] = useState({ [Positions.UP]: 0, [Positions.DOWN]: 0 });

    const ammSpeedMarketsLimitsQuery = useAmmSpeedMarketsLimitsQuery(networkId, undefined, {
        enabled: isAppReady,
    });

    const ammSpeedMarketsLimitsData = useMemo(() => {
        return ammSpeedMarketsLimitsQuery.isSuccess ? ammSpeedMarketsLimitsQuery.data : null;
    }, [ammSpeedMarketsLimitsQuery]);

    const ammChainedSpeedMarketsLimitsQuery = useAmmChainedSpeedMarketsLimitsQuery(networkId, undefined, {
        enabled: isAppReady && isChainedSupported,
    });

    const ammChainedSpeedMarketsLimitsData = useMemo(() => {
        return ammChainedSpeedMarketsLimitsQuery.isSuccess ? ammChainedSpeedMarketsLimitsQuery.data : null;
    }, [ammChainedSpeedMarketsLimitsQuery]);

    const priceConnection = useMemo(() => {
        return new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), { timeout: CONNECTION_TIMEOUT_MS });
    }, [networkId]);

    const prevPrice = useRef(0);
    const fetchCurrentPrices = useCallback(async () => {
        const priceIds = SUPPORTED_ASSETS.map((asset) => getPriceId(networkId, asset));
        const prices: typeof currentPrices = await getCurrentPrices(priceConnection, networkId, priceIds);
        if (!mountedRef.current) return null;
        setCurrentPrices((prev) => {
            if (prev[currencyKey] !== prices[currencyKey]) {
                prevPrice.current = prev[currencyKey];
            }
            return prices;
        });
    }, [networkId, priceConnection, currencyKey]);

    // Set isChained when query param is changed after initialization
    useEffect(() => {
        setIsChained(isChainedMarkets);
    }, [isChainedMarkets]);

    // Used for canceling asynchronous tasks
    const mountedRef = useRef(true);
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Set initial current prices
    useEffect(() => {
        fetchCurrentPrices();
    }, [currencyKey, fetchCurrentPrices]);

    // Set initial chained positions
    useEffect(() => {
        if (ammChainedSpeedMarketsLimitsData?.minChainedMarkets) {
            setChainedPositions(Array(ammChainedSpeedMarketsLimitsData.minChainedMarkets).fill(undefined));
        }
    }, [ammChainedSpeedMarketsLimitsData?.minChainedMarkets]);

    // Update current prices on every 5 seconds
    useInterval(async () => {
        fetchCurrentPrices();
    }, secondsToMilliseconds(5));

    const resetData = useCallback(() => {
        setIsResetTriggered(true);
        setPositionType(undefined);
        if (ammChainedSpeedMarketsLimitsData?.minChainedMarkets) {
            setChainedPositions(Array(ammChainedSpeedMarketsLimitsData.minChainedMarkets).fill(undefined));
        }
        setDeltaTimeSec(0);
        setStrikeTimeSec(0);
        setSelectedStableBuyinAmount(0);
    }, [ammChainedSpeedMarketsLimitsData?.minChainedMarkets]);

    useEffect(() => {
        if (!isWalletConnected) {
            resetData();
        }
    }, [isWalletConnected, resetData]);

    useEffect(() => {
        resetData();
    }, [networkId, resetData]);

    useEffect(() => {
        if (isResetTriggered) {
            setIsResetTriggered(false);
        }
    }, [isResetTriggered]);

    useEffect(() => {
        setSelectedStableBuyinAmount(0);
    }, [isChained]);

    const getStep = (stepNumber: number, name: string) => {
        const isAssetStep = stepNumber === 1;
        const isDirectionsStep = stepNumber === 2;
        const isTimeStep = stepNumber === 3;
        const isBuyinStep = stepNumber === 4;
        return (
            <>
                <Step>
                    <FlexDivRowCentered>
                        <StepNumber>{stepNumber}</StepNumber>
                        <StepName>{name}</StepName>
                    </FlexDivRowCentered>
                    {isChained && isDirectionsStep && (
                        <>
                            <AddRemoveWrapper>
                                <AddRemove
                                    isDisabled={
                                        chainedPositions.length ===
                                        (ammChainedSpeedMarketsLimitsData?.minChainedMarkets || 0)
                                    }
                                    onClick={() => {
                                        if (
                                            chainedPositions.length >
                                            (ammChainedSpeedMarketsLimitsData?.minChainedMarkets || 0)
                                        ) {
                                            setChainedPositions(chainedPositions.slice(0, -1));
                                        }
                                    }}
                                >
                                    {'-'}
                                </AddRemove>
                                <Separator />
                                <AddRemove
                                    isDisabled={chainedPositions.length === 6}
                                    onClick={() => {
                                        if (
                                            chainedPositions.length <
                                            (ammChainedSpeedMarketsLimitsData?.maxChainedMarkets || 0)
                                        ) {
                                            setChainedPositions([...chainedPositions, undefined]);
                                        }
                                    }}
                                >
                                    {'+'}
                                </AddRemove>
                            </AddRemoveWrapper>
                            <AddRemoveLabel>{t('speed-markets.chained.add-directions')}</AddRemoveLabel>
                        </>
                    )}
                    {isChained && isTimeStep && (
                        <SelectTime
                            selectedDeltaSec={deltaTimeSec}
                            onDeltaChange={setDeltaTimeSec}
                            onExactTimeChange={setStrikeTimeSec}
                            ammSpeedMarketsLimits={ammSpeedMarketsLimitsData}
                            isResetTriggered={isResetTriggered}
                            isChained={isChained}
                        />
                    )}
                </Step>
                {isAssetStep && (
                    <SelectAsset selectedAsset={currencyKey} allAssets={SUPPORTED_ASSETS} onChange={setCurrencyKey} />
                )}
                {isDirectionsStep && (
                    <SelectPosition
                        selected={isChained ? chainedPositions : [positionType]}
                        onChange={setPositionType}
                        onChainedChange={setChainedPositions}
                        ammChainedSpeedMarketsLimits={ammChainedSpeedMarketsLimitsData}
                        skew={skew}
                    />
                )}
                {isTimeStep && !isChained && (
                    <SelectTime
                        selectedDeltaSec={deltaTimeSec}
                        onDeltaChange={setDeltaTimeSec}
                        onExactTimeChange={setStrikeTimeSec}
                        ammSpeedMarketsLimits={ammSpeedMarketsLimitsData}
                        isResetTriggered={isResetTriggered}
                        isChained={isChained}
                    />
                )}
                {isBuyinStep && (
                    <SelectBuyin
                        value={selectedStableBuyinAmount}
                        onChange={setSelectedStableBuyinAmount}
                        isChained={isChained}
                        chainedPositions={chainedPositions}
                        ammSpeedMarketsLimits={ammSpeedMarketsLimitsData}
                        ammChainedSpeedMarketsLimits={ammChainedSpeedMarketsLimitsData}
                    />
                )}
            </>
        );
    };

    const getToggle = () => {
        return (
            <SwitchInput
                active={isChained}
                disabled={!isChainedSupported}
                width="80px"
                height="30px"
                dotSize="20px"
                dotBackground={theme.background.quaternary}
                borderColor={theme.borderColor.primary}
                borderWidth="2px"
                borderRadius="50px"
                margin={isMobile ? '0 0 10px 0' : undefined}
                label={{
                    firstLabel: t(`speed-markets.single`),
                    secondLabel: t(`speed-markets.chained.label`),
                    fontSize: '18px',
                    firstLabelColor: isChained ? undefined : theme.textColor.quaternary,
                    secondLabelColor: isChained ? theme.textColor.quaternary : undefined,
                }}
                handleClick={() => {
                    setIsChained(!isChained);
                    history.push({
                        pathname: location.pathname,
                        search: queryString.stringify({
                            isChained: !isChained,
                        }),
                    });
                }}
            />
        );
    };

    return (
        <>
            {ammSpeedMarketsLimitsQuery.isLoading || ammChainedSpeedMarketsLimitsQuery.isLoading ? (
                <SimpleLoader />
            ) : (
                <Container>
                    <HeaderImage />
                    <ContentWrapper>
                        <LeftSide>
                            <Info>
                                <Trans
                                    i18nKey={isChained ? 'speed-markets.chained.info' : 'speed-markets.info'}
                                    components={{
                                        bold: <BoldText />,
                                    }}
                                    values={{
                                        minMarkets: ammChainedSpeedMarketsLimitsData?.minChainedMarkets,
                                        maxMarkets: ammChainedSpeedMarketsLimitsData?.maxChainedMarkets,
                                        maxRoi: ammChainedSpeedMarketsLimitsData
                                            ? roundNumberToDecimals(
                                                  ammChainedSpeedMarketsLimitsData?.payoutMultipliers[
                                                      ammChainedSpeedMarketsLimitsData.maxChainedMarkets -
                                                          ammChainedSpeedMarketsLimitsData.minChainedMarkets
                                                  ] ** ammChainedSpeedMarketsLimitsData?.maxChainedMarkets,
                                                  0
                                              )
                                            : '...',
                                    }}
                                />
                                <Tooltip
                                    overlay={t('speed-markets.tooltips.buyin-fees')}
                                    customIconStyling={{ top: '-2px' }}
                                />
                            </Info>
                            <LightweightChart
                                position={isChained ? undefined : positionType}
                                asset={currencyKey}
                                selectedPrice={
                                    !isChained && positionType !== undefined ? currentPrices[currencyKey] : undefined
                                }
                                selectedDate={getTimeStampForDelta(deltaTimeSec)}
                                deltaTimeSec={deltaTimeSec}
                                selectedRightPrice={undefined}
                                isSpeedMarkets
                                explicitCurrentPrice={currentPrices[currencyKey]}
                                prevExplicitPrice={prevPrice.current}
                                chainedRisk={isChained ? ammChainedSpeedMarketsLimitsData?.risk : undefined}
                                risksPerAsset={isChained ? undefined : ammSpeedMarketsLimitsData?.risksPerAsset}
                                risksPerAssetAndDirection={
                                    isChained ? undefined : ammSpeedMarketsLimitsData?.risksPerAssetAndDirection
                                }
                            ></LightweightChart>
                        </LeftSide>
                        <RightSide>
                            {getToggle()}
                            {/* Asset */}
                            {getStep(1, t('speed-markets.steps.choose-asset'))}
                            {/* Direction */}
                            {getStep(2, t('speed-markets.steps.choose-direction'))}
                            {/* Time */}
                            {getStep(3, t('speed-markets.steps.choose-time'))}
                            {/* Buyin */}
                            {getStep(4, t('speed-markets.steps.enter-buyin'))}
                        </RightSide>
                    </ContentWrapper>

                    <AmmSpeedTrading
                        isChained={isChained}
                        currencyKey={currencyKey}
                        positionType={positionType}
                        chainedPositions={chainedPositions}
                        strikeTimeSec={strikeTimeSec}
                        deltaTimeSec={deltaTimeSec}
                        selectedStableBuyinAmount={selectedStableBuyinAmount}
                        setSelectedStableBuyinAmount={setSelectedStableBuyinAmount}
                        ammSpeedMarketsLimits={ammSpeedMarketsLimitsData}
                        ammChainedSpeedMarketsLimits={ammChainedSpeedMarketsLimitsData}
                        currentPrice={currentPrices[currencyKey]}
                        setSkewImpact={setSkew}
                        resetData={resetData}
                    />
                    {getSupportedNetworksByRoute(ROUTES.Options.Home).includes(networkId) && (
                        <PageLinkBanner rout={ROUTES.Options.Home} />
                    )}
                    {isWalletConnected && (
                        <>
                            <OpenPositions
                                isSpeedMarkets
                                isChainedSpeedMarkets={isChained}
                                maxPriceDelayForResolvingSec={ammSpeedMarketsLimitsData?.maxPriceDelayForResolvingSec}
                                currentPrices={currentPrices}
                            />
                            <ClosedPositions isChained={isChained} />
                        </>
                    )}
                    <OverviewLinkWrapper>
                        <SPAAnchor href={buildHref(`${ROUTES.Options.SpeedMarketsOverview}?isChained=${isChained}`)}>
                            <OverviewLinkText>
                                {isChained
                                    ? t('speed-markets.overview.navigate-chained')
                                    : t('speed-markets.overview.navigate')}
                            </OverviewLinkText>
                            <ArrowRight className="icon icon--arrow" />
                        </SPAAnchor>
                    </OverviewLinkWrapper>
                </Container>
            )}
        </>
    );
};

const getTimeStampForDelta = (seconds: number) => {
    if (seconds) {
        const reuslt = Number(Date.now() + seconds * 1000);
        return reuslt;
    }
};

const Container = styled.div`
    width: 100%;
    max-width: 1080px;
    min-height: 799px;
`;

const HeaderImage = styled.div`
    height: 120px;
    background-image: url(${banner});
    background-position: center;
    border-radius: 11px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 11px;
    justify-content: space-between;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        gap: 10px;
        margin-top: 0;
    }
`;

const LeftSide = styled.div`
    height: 100%;
    width: 100%;
    max-width: 640px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-width: initial;
    }
`;
const RightSide = styled.div`
    width: 100%;
    height: 100%;
    max-width: 410px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-width: initial;
    }
`;

const Step = styled(FlexDivStart)`
    align-items: center;
    :not(:first-child) {
        margin-top: 15px;
    }
    margin-bottom: 11px;
`;
const StepNumber = styled(FlexDivCentered)`
    width: 36px;
    height: 36px;
    border: 3px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 50%;
    color: ${(props) => props.theme.textColor.primary};
    font-weight: 700;
    font-size: 18px;
    line-height: 100%;
`;
const StepName = styled.span`
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    padding-left: 8px;
    text-transform: capitalize;
`;

const AddRemoveWrapper = styled(FlexDivSpaceBetween)`
    width: 80px;
    height: 35px;
    border-radius: 30px;
    border: 2px solid ${(props) => props.theme.borderColor.quaternary};
    margin: 0 6px;
`;

const AddRemove = styled.div<{ isDisabled: boolean }>`
    width: 100%;
    color: ${(props) => (props.isDisabled ? props.theme.textColor.secondary : props.theme.textColor.primary)};
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    line-height: 90%;
    cursor: ${(props) => (props.isDisabled ? 'default' : 'pointer')};
`;

const AddRemoveLabel = styled(StepName)`
    padding: 0;
    text-transform: lowercase;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
    }
`;

const Info = styled.span`
    display: block;
    text-align: justify;
    font-size: 18px;
    font-weight: 300;
    line-height: 20px;
    color: ${(props) => props.theme.textColor.primary};
`;

const OverviewLinkWrapper = styled.div`
    margin-top: 20px;
`;

const OverviewLinkText = styled.span`
    font-size: 18px;
    line-height: 110%;
    &:hover {
        text-decoration: underline;
    }
`;

const ArrowRight = styled.i`
    font-size: 14px;
    margin-left: 6px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-bottom: 4px;
    }
`;

const Separator = styled.div`
    background: ${(props) => props.theme.borderColor.primary};
    width: 2px;
    height: 23px;
    border-radius: 6px;
`;

export default SpeedMarkets;
