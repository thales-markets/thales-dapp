import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import banner from 'assets/images/speed-markets/speed-markets-banner.png';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';
import { CONNECTION_TIMEOUT_MS, SUPPORTED_ASSETS } from 'constants/pyth';
import { secondsToMilliseconds } from 'date-fns';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useInterval from 'hooks/useInterval';
import AssetDropdown from 'pages/Trade/components/AssetDropdown';
import OpenPositions from 'pages/Trade/components/OpenPositions';
import PriceChart from 'pages/Trade/components/PriceChart/PriceChart';
import useAmmSpeedMarketsLimitsQuery from 'queries/options/speedMarkets/useAmmSpeedMarketsLimitsQuery';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { BoldText, FlexDivCentered, FlexDivStart } from 'styles/common';
import { getCurrentPrices, getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import AmmSpeedTrading from './components/AmmSpeedTrading';
import ClosedPositions from './components/ClosedPositions';
import SelectBuyin from './components/SelectBuyin';
import SelectPosition from './components/SelectPosition';
import SelectTime from './components/SelectTime';
import Tooltip from 'components/Tooltip';
import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import ROUTES from 'constants/routes';
import { buildHref } from 'utils/routes';
import SimpleLoader from 'components/SimpleLoader';
import PageLinkBanner from 'components/PageLinkBanner';

const SpeedMarkets: React.FC<RouteComponentProps> = () => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [currentPrices, setCurrentPrices] = useState<{ [key: string]: number }>({
        [CRYPTO_CURRENCY_MAP.BTC]: 0,
        [CRYPTO_CURRENCY_MAP.ETH]: 0,
    });
    const [currencyKey, setCurrencyKey] = useState(SUPPORTED_ASSETS[0]);
    const [positionType, setPositionType] = useState<Positions.UP | Positions.DOWN | undefined>(undefined);
    const [deltaTimeSec, setDeltaTimeSec] = useState(0);
    const [strikeTimeSec, setStrikeTimeSec] = useState(0);
    const [selectedStableBuyinAmount, setSelectedStableBuyinAmount] = useState(0);
    const [isResetTriggered, setIsResetTriggered] = useState(false);

    const ammSpeedMarketsLimitsQuery = useAmmSpeedMarketsLimitsQuery(networkId, undefined, {
        enabled: isAppReady,
    });

    const ammSpeedMarketsLimitsData = useMemo(() => {
        return ammSpeedMarketsLimitsQuery.isSuccess ? ammSpeedMarketsLimitsQuery.data : null;
    }, [ammSpeedMarketsLimitsQuery]);

    const priceConnection = useMemo(() => {
        return new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), { timeout: CONNECTION_TIMEOUT_MS });
    }, [networkId]);

    const prevPrice = useRef(0);
    const fetchCurrentPrice = useCallback(async () => {
        const priceIds = SUPPORTED_ASSETS.map((asset) => getPriceId(networkId, asset));
        const prices: typeof currentPrices = await getCurrentPrices(priceConnection, networkId, priceIds);
        setCurrentPrices((prev) => {
            if (prev[currencyKey] !== prices[currencyKey]) {
                prevPrice.current = prev[currencyKey];
            }
            return prices;
        });
    }, [networkId, priceConnection, currencyKey]);

    // Set initial current price
    useEffect(() => {
        fetchCurrentPrice();
    }, [currencyKey, fetchCurrentPrice]);

    // Update current price on every 5 seconds
    useInterval(async () => {
        fetchCurrentPrice();
    }, secondsToMilliseconds(5));

    const resetData = () => {
        setIsResetTriggered(true);
        setPositionType(undefined);
        setDeltaTimeSec(0);
        setStrikeTimeSec(0);
        setSelectedStableBuyinAmount(0);
    };

    useEffect(() => {
        if (!isWalletConnected) {
            resetData();
        }
    }, [isWalletConnected]);

    useEffect(() => {
        resetData();
    }, [networkId]);

    useEffect(() => {
        if (isResetTriggered) {
            setIsResetTriggered(false);
        }
    }, [isResetTriggered]);

    const getStepLabel = (sn: number, name: string) => {
        return (
            <Step>
                <StepNumber>{sn}</StepNumber>
                <StepName>{name}</StepName>
            </Step>
        );
    };

    return (
        <>
            {ammSpeedMarketsLimitsQuery.isLoading ? (
                <SimpleLoader />
            ) : (
                <Container>
                    <HeaderImage />
                    <Info>
                        <Trans
                            i18nKey="speed-markets.info"
                            components={{
                                bold: <BoldText />,
                            }}
                        />
                        <Tooltip overlay={t('speed-markets.tooltips.buyin-fees')} customIconStyling={{ top: '-2px' }} />
                    </Info>
                    <ContentWrapper>
                        <LeftSide>
                            <PriceChart
                                position={positionType}
                                asset={currencyKey}
                                selectedPrice={positionType !== undefined ? currentPrices[currencyKey] : undefined}
                                selectedRightPrice={undefined}
                                isSpeedMarkets
                                explicitCurrentPrice={currentPrices[currencyKey]}
                                prevExplicitPrice={prevPrice.current}
                                risksPerAsset={ammSpeedMarketsLimitsData?.risksPerAsset}
                                risksPerAssetAndDirection={ammSpeedMarketsLimitsData?.risksPerAssetAndDirection}
                            ></PriceChart>
                        </LeftSide>
                        <RightSide>
                            {getStepLabel(1, t('speed-markets.steps.choose-asset'))}
                            <AssetDropdown
                                asset={currencyKey}
                                setAsset={setCurrencyKey}
                                allAssets={SUPPORTED_ASSETS}
                                showAssetIcon={true}
                                type="center"
                            />
                            {getStepLabel(2, t('speed-markets.steps.choose-direction'))}
                            <SelectPosition selected={positionType} onChange={setPositionType} />
                            {getStepLabel(3, t('speed-markets.steps.choose-time'))}
                            <SelectTime
                                selectedDeltaSec={deltaTimeSec}
                                onDeltaChange={setDeltaTimeSec}
                                onExactTimeChange={setStrikeTimeSec}
                                ammSpeedMarketsLimits={ammSpeedMarketsLimitsData}
                                isResetTriggered={isResetTriggered}
                            />
                            {getStepLabel(4, t('speed-markets.steps.enter-buyin'))}
                            <SelectBuyin
                                value={selectedStableBuyinAmount}
                                onChange={setSelectedStableBuyinAmount}
                                ammSpeedMarketsLimits={ammSpeedMarketsLimitsData}
                            />
                        </RightSide>
                    </ContentWrapper>

                    <AmmSpeedTrading
                        currencyKey={currencyKey}
                        positionType={positionType}
                        strikeTimeSec={strikeTimeSec}
                        deltaTimeSec={deltaTimeSec}
                        selectedStableBuyinAmount={selectedStableBuyinAmount}
                        setSelectedStableBuyinAmount={setSelectedStableBuyinAmount}
                        ammSpeedMarketsLimits={ammSpeedMarketsLimitsData}
                        currentPrice={currentPrices[currencyKey]}
                        resetData={resetData}
                    />
                    <BannerWrapper>
                        <PageLinkBanner rout={ROUTES.Options.Home} />
                    </BannerWrapper>
                    {isWalletConnected && (
                        <>
                            <OpenPositions
                                isSpeedMarkets
                                maxPriceDelayForResolvingSec={ammSpeedMarketsLimitsData?.maxPriceDelayForResolvingSec}
                                currentPrices={currentPrices}
                            />
                            <ClosedPositions />
                        </>
                    )}
                    <OverviewLinkWrapper>
                        <SPAAnchor href={buildHref(`${ROUTES.Options.SpeedMarketsOverview}`)}>
                            <OverviewLinkText>{t('speed-markets.overview.navigate')}</OverviewLinkText>
                            <ArrowRight className="icon icon--arrow" />
                        </SPAAnchor>
                    </OverviewLinkWrapper>
                </Container>
            )}
        </>
    );
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
    margin-bottom: 20px;
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
    margin-left: 8px;
    text-transform: capitalize;
`;

const Info = styled.span`
    display: block;
    text-align: justify;
    font-size: 18px;
    font-weight: 300;
    line-height: 110%;
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

const BannerWrapper = styled.div`
    margin-top: 40px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 20px;
    }
`;

export default SpeedMarkets;
