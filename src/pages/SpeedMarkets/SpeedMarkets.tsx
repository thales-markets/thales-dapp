import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import UnsupportedNetwork from 'components/UnsupportedNetwork';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';
import { CONNECTION_TIMEOUT_MS } from 'constants/pyth';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useInterval from 'hooks/useInterval';
import AssetDropdown from 'pages/Trade/components/AssetDropdown';
import BannerCarousel from 'pages/Trade/components/BannerCarousel';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { BoldText, FlexDivCentered, FlexDivStart } from 'styles/common';
import { getCurrencyPriority } from 'utils/currency';
import { getCurrentPrices, getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import SelectBuyin from './components/SelectBuyin';
import SelectPosition from './components/SelectPosition';
import SelectTime from './components/SelectTime';
import AmmSpeedTrading from './components/AmmSpeedTrading';
import useAmmSpeedMarketsLimitsQuery from 'queries/options/speedMarkets/useAmmSpeedMarketsLimitsQuery';
import { getIsAppReady } from 'redux/modules/app';
import OpenPositions from 'pages/Trade/components/OpenPositions';
import PriceChart from 'pages/Trade/components/PriceChart/PriceChart';
import { getSupportedNetworksByRoute } from 'utils/network';
import { RouteComponentProps } from 'react-router-dom';
import { secondsToMilliseconds } from 'date-fns';

const supportedAssets = [CRYPTO_CURRENCY_MAP.BTC, CRYPTO_CURRENCY_MAP.ETH].sort(
    (a, b) => getCurrencyPriority(a) - getCurrencyPriority(b)
);

const SpeedMarkets: React.FC<RouteComponentProps> = (props) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [currentPrices, setCurrentPrices] = useState<{ [key: string]: number }>({
        [CRYPTO_CURRENCY_MAP.BTC]: 0,
        [CRYPTO_CURRENCY_MAP.ETH]: 0,
    });
    const [currencyKey, setCurrencyKey] = useState(supportedAssets[0]);
    const [positionType, setPositionType] = useState<Positions.UP | Positions.DOWN | undefined>(undefined);
    const [deltaTimeSec, setDeltaTimeSec] = useState(0);
    const [strikeTimeSec, setStrikeTimeSec] = useState(0);
    const [buyinAmount, setBuyinAmount] = useState(0);
    const [isResetTriggered, setIsResetTriggered] = useState(false);

    const ammSpeedMarketsLimitsQuery = useAmmSpeedMarketsLimitsQuery(networkId, {
        enabled: isAppReady,
    });

    const ammSpeedMarketsLimitsData = useMemo(() => {
        return ammSpeedMarketsLimitsQuery.isSuccess ? ammSpeedMarketsLimitsQuery.data : null;
    }, [ammSpeedMarketsLimitsQuery]);

    const priceConnection = useMemo(() => {
        return new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), { timeout: CONNECTION_TIMEOUT_MS });
    }, [networkId]);

    const fetchCurrentPrice = useCallback(async () => {
        const priceIds = supportedAssets.map((asset) => getPriceId(networkId, asset));
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

    const prevPrice = useRef(0);
    // Update current price latest on every minute
    useInterval(async () => {
        fetchCurrentPrice();
    }, secondsToMilliseconds(5));

    // Reset inputs
    useEffect(() => {
        if (!isWalletConnected) {
            setCurrencyKey(supportedAssets[0]);
            setPositionType(undefined);
            setDeltaTimeSec(0);
            setStrikeTimeSec(0);
            setBuyinAmount(0);
        }
    }, [isWalletConnected]);

    const getStepLabel = (sn: number, name: string) => {
        return (
            <Step>
                <StepNumber>{sn}</StepNumber>
                <StepName>{name}</StepName>
            </Step>
        );
    };

    const resetData = () => {
        setIsResetTriggered(true);
        setCurrencyKey(supportedAssets[0]);
        setPositionType(undefined);
        setDeltaTimeSec(0);
        setStrikeTimeSec(0);
        setBuyinAmount(0);
        setIsResetTriggered(false);
    };

    const supportedNetworks = getSupportedNetworksByRoute(props.location?.pathname);

    return (
        <>
            {supportedNetworks.includes(networkId) ? (
                <Container>
                    <BannerCarousel />
                    <FlexDivCentered>
                        <Icon className="icon icon--thunder" />
                        <Title>{t('speed-markets.title')}</Title>
                        <Icon className="icon icon--thunder" />
                    </FlexDivCentered>
                    <Info>
                        <Trans
                            i18nKey="speed-markets.info"
                            components={{
                                bold: <BoldText />,
                            }}
                        />
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
                            ></PriceChart>
                        </LeftSide>
                        <RightSide>
                            {getStepLabel(1, t('speed-markets.steps.choose-asset'))}
                            <AssetDropdown
                                asset={currencyKey}
                                setAsset={setCurrencyKey}
                                allAssets={supportedAssets}
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
                                value={buyinAmount}
                                onChange={setBuyinAmount}
                                ammSpeedMarketsLimits={ammSpeedMarketsLimitsData}
                            />
                        </RightSide>
                    </ContentWrapper>

                    <AmmSpeedTrading
                        currencyKey={currencyKey}
                        positionType={positionType}
                        strikeTimeSec={strikeTimeSec}
                        deltaTimeSec={deltaTimeSec}
                        buyinAmount={buyinAmount}
                        setBuyinAmount={setBuyinAmount}
                        ammSpeedMarketsLimits={ammSpeedMarketsLimitsData}
                        currentPrice={currentPrices[currencyKey]}
                        resetData={resetData}
                    />
                    {isWalletConnected && (
                        <OpenPositions
                            isSpeedMarkets
                            maxPriceDelaySec={ammSpeedMarketsLimitsData?.maxPriceDelaySec}
                            currentPrices={currentPrices}
                        />
                    )}
                </Container>
            ) : (
                <UnsupportedNetworkWrapper>
                    <UnsupportedNetwork supportedNetworks={supportedNetworks} />
                </UnsupportedNetworkWrapper>
            )}
        </>
    );
};

const Container = styled.div`
    width: 100%;
    max-width: 974px;
`;

const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 15px;
    justify-content: space-between;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        gap: 10px;
    }
`;

const LeftSide = styled.div`
    height: 100%;
    width: 100%;
    max-width: 600px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-width: initial;
        height: 60px;
    }
`;
const RightSide = styled.div`
    width: 100%;
    height: 100%;
    max-width: 350px;
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

const Title = styled.span`
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    line-height: 200%;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: uppercase;
`;

const Info = styled.span`
    text-align: justify;
    font-size: 18px;
    font-weight: 300;
    line-height: 110%;
    color: ${(props) => props.theme.textColor.primary};
`;

const UnsupportedNetworkWrapper = styled.div`
    margin: 90px 0;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin: 0;
    }
`;

const Icon = styled.i`
    font-size: 22px;
    line-height: 200%;
    color: ${(props) => props.theme.warning.textColor.primary};
    padding: 0 5px;
`;

export default SpeedMarkets;
