import TooltipInfo from 'components/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { LINKS } from 'constants/links';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';

import usePythCandlestickQuery from 'queries/prices/usePythCandlestickQuery';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled from 'styled-components';
import { FlexDiv, FlexDivRowCentered, FlexDivSpaceBetween } from 'styles/common';
import { bigNumberFormatter, bytesFormatter, formatCurrencyWithSign } from 'thales-utils';
import { Risk, RiskPerAsset, RiskPerAssetAndPosition } from 'types/options';

import { calculatePercentageChange, formatPricePercentageGrowth } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';
import CurrentPrice from './components/CurrentPrice';
import Toggle from './components/DateToggle';
import { ChartComponent } from './components/Chart/ChartContext';
import SimpleLoader from 'components/SimpleLoader';
import { hoursToSeconds, minutesToSeconds, subDays } from 'date-fns';

const now = new Date();

type LightweightChartProps = {
    asset: string;
    position: Positions | undefined;
    isSpeedMarkets: boolean;
    selectedPrice?: number;
    selectedDate?: number;
    selectedRightPrice?: number;
    explicitCurrentPrice?: number;
    prevExplicitPrice?: number;
    chainedRisk?: Risk;
    risksPerAsset?: RiskPerAsset[];
    deltaTimeSec?: number;
    risksPerAssetAndDirection?: RiskPerAssetAndPosition[];
};

const ToggleButtons = [
    { label: '15m', resolution: '15', value: 2, startDate: Number(subDays(now, 2)) },
    { label: '30m', resolution: '30', value: 4, startDate: Number(subDays(now, 4)) },
    { label: '1H', resolution: '60', value: 14, startDate: Number(subDays(now, 14)) },
    { label: '4H', resolution: '240', value: 28, startDate: Number(subDays(now, 28)) },
    { label: '1D', resolution: '1D', value: 120, startDate: Number(subDays(now, 120)) },
    { label: '1W', resolution: '1W', value: 730, startDate: Number(subDays(now, 730)) },
];

const SpeedMarketsToggleButtons = [
    { label: '1m', resolution: '1', value: 1, startDate: Number(subDays(now, 1)) },
    { label: '5m', resolution: '5', value: 1, startDate: Number(subDays(now, 1)) },
    { label: '15m', resolution: '15', value: 2, startDate: Number(subDays(now, 2)) },
    { label: '30m', resolution: '30', value: 4, startDate: Number(subDays(now, 4)) },
    { label: '1H', resolution: '60', value: 30, startDate: Number(subDays(now, 30)) },
    { label: '1D', resolution: '1D', value: 365, startDate: Number(subDays(now, 365)) },
];
const DEFAULT_TOGGLE_BUTTON_INDEX = 2;
const SPEED_DEFAULT_TOGGLE_BUTTON_INDEX = 0;

const LightweightChart: React.FC<LightweightChartProps> = ({
    asset,
    selectedPrice,
    selectedRightPrice,
    position,
    selectedDate,
    isSpeedMarkets,
    explicitCurrentPrice,
    deltaTimeSec,
    prevExplicitPrice,
    chainedRisk,
    risksPerAsset,
    risksPerAssetAndDirection,
}) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [processedPriceData, setProcessedPriceData] = useState<number>(0);
    const [dateRange, setDateRange] = useState(
        !isSpeedMarkets
            ? ToggleButtons[DEFAULT_TOGGLE_BUTTON_INDEX]
            : SpeedMarketsToggleButtons[SPEED_DEFAULT_TOGGLE_BUTTON_INDEX]
    );
    const [selectedToggleIndex, setToggleIndex] = useState(
        isSpeedMarkets ? SPEED_DEFAULT_TOGGLE_BUTTON_INDEX : DEFAULT_TOGGLE_BUTTON_INDEX
    );

    const [candleData, setCandleData] = useState<any>();

    const [iv, setIV] = useState(0);
    const [currentDeltaTimeSec, setCurrentDeltaTimeSec] = useState(deltaTimeSec);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery(networkId, {
        enabled: isAppReady,
    });

    const pythQuery = usePythCandlestickQuery(asset, dateRange.startDate, dateRange.resolution, {
        enabled: isAppReady,
        refetchInterval: 30 * 1000,
    });

    const candleStickData = useMemo(() => {
        if (pythQuery.isSuccess && pythQuery.data) {
            return pythQuery.data;
        }
    }, [pythQuery.isSuccess, pythQuery.data]);

    const currentPrice = useMemo(() => {
        if (explicitCurrentPrice) {
            return explicitCurrentPrice;
        } else if (exchangeRatesMarketDataQuery.isSuccess && exchangeRatesMarketDataQuery.data) {
            return exchangeRatesMarketDataQuery.data[asset];
        }
    }, [exchangeRatesMarketDataQuery.isSuccess, exchangeRatesMarketDataQuery.data, asset, explicitCurrentPrice]);

    useEffect(() => {
        if (currentPrice && candleStickData && candleStickData.length) {
            const cloneData = [...candleStickData];
            cloneData[cloneData.length - 1].close = currentPrice;
            setProcessedPriceData(
                calculatePercentageChange(candleStickData[candleStickData.length - 2].close, currentPrice)
            );
            setCandleData(cloneData);
        }
    }, [currentPrice, candleStickData]);

    useEffect(() => {
        const { ammContract } = snxJSConnector;
        const getImpliedVolatility = async () => {
            try {
                const impliedVolatility = await ammContract?.impliedVolatilityPerAsset(bytesFormatter(asset));
                setIV(bigNumberFormatter(impliedVolatility));
            } catch (e) {
                console.log(e);
            }
        };

        if (!isSpeedMarkets) {
            getImpliedVolatility();
        }
    }, [asset, isSpeedMarkets]);

    const handleDateRangeChange = useCallback(
        (value: number) => {
            setDateRange(isSpeedMarkets ? SpeedMarketsToggleButtons[value] : ToggleButtons[value]);
            setToggleIndex(value);
        },
        [isSpeedMarkets]
    );

    // save previous deltaTimeSec
    const prevDeltaTimeSecRef = useRef<number | undefined>(currentDeltaTimeSec);
    useEffect(() => {
        prevDeltaTimeSecRef.current = currentDeltaTimeSec;
        setCurrentDeltaTimeSec(deltaTimeSec);
    }, [deltaTimeSec, currentDeltaTimeSec]);

    // useEffect for changing the dateRange on chart when user clicks on speed markets buttons for time
    useEffect(() => {
        if (deltaTimeSec && deltaTimeSec !== prevDeltaTimeSecRef.current) {
            if (deltaTimeSec >= hoursToSeconds(10)) {
                if (dateRange.resolution !== SpeedMarketsToggleButtons[4].resolution) {
                    handleDateRangeChange(4);
                }
            } else {
                if (deltaTimeSec >= hoursToSeconds(4)) {
                    if (dateRange.resolution !== SpeedMarketsToggleButtons[3].resolution) {
                        handleDateRangeChange(3);
                    }
                } else {
                    if (deltaTimeSec >= hoursToSeconds(1)) {
                        if (dateRange.resolution !== SpeedMarketsToggleButtons[2].resolution) {
                            handleDateRangeChange(2);
                        }
                    } else {
                        if (deltaTimeSec >= minutesToSeconds(30)) {
                            if (dateRange.resolution !== SpeedMarketsToggleButtons[1].resolution) {
                                handleDateRangeChange(1);
                            }
                        }
                    }
                }
            }
        }
    }, [deltaTimeSec, dateRange.resolution, handleDateRangeChange]);

    const risk = chainedRisk
        ? chainedRisk
        : risksPerAsset?.filter((riskPerAsset) => riskPerAsset.currency === asset)[0];
    const liquidity = risk ? formatCurrencyWithSign(USD_SIGN, risk.max - risk.current) : 0;

    const riskPerDirectionUp = risksPerAssetAndDirection?.filter(
        (risk) => risk.currency === asset && risk.position === Positions.UP
    )[0];
    const liquidityPerUp = riskPerDirectionUp
        ? formatCurrencyWithSign(USD_SIGN, riskPerDirectionUp.max - riskPerDirectionUp.current)
        : 0;
    const riskPerDirectionDown = risksPerAssetAndDirection?.filter(
        (risk) => risk.currency === asset && risk.position === Positions.DOWN
    )[0];
    const liquidityPerDown = riskPerDirectionDown
        ? formatCurrencyWithSign(USD_SIGN, riskPerDirectionDown.max - riskPerDirectionDown.current)
        : 0;

    return (
        <Wrapper>
            <FlexDivSpaceBetween>
                <FlexDivRowCentered>
                    <CurrentPrice
                        asset={asset}
                        currentPrice={currentPrice}
                        animatePrice={isSpeedMarkets}
                        isPriceUp={isSpeedMarkets ? (explicitCurrentPrice || 0) > (prevExplicitPrice || 0) : undefined}
                    />
                    {isSpeedMarkets && (
                        <TooltipInfo
                            overlay={t('speed-markets.tooltips.current-price')}
                            customIconStyling={{ marginTop: '1px' }}
                        />
                    )}
                    {!!iv && (
                        <FlexDiv>
                            <Value margin="0 0 0 20px">{`IV ${iv}%`}</Value>
                            <TooltipInfo
                                overlay={t('markets.amm-trading.iv-tooltip')}
                                customIconStyling={{ marginTop: '1px' }}
                            />
                        </FlexDiv>
                    )}
                </FlexDivRowCentered>
                {isSpeedMarkets ? (
                    !!liquidity && (
                        <FlexDiv>
                            <Value>{`${t('common.liquidity')} ${liquidity}`}</Value>
                            <TooltipInfo
                                overlay={
                                    <Trans
                                        i18nKey={
                                            chainedRisk
                                                ? 'speed-markets.chained.tooltips.liquidity'
                                                : 'speed-markets.tooltips.liquidity'
                                        }
                                        components={{
                                            br: <br />,
                                        }}
                                        values={{
                                            liquidityPerUp,
                                            liquidityPerDown,
                                        }}
                                    />
                                }
                                customIconStyling={{ marginTop: '1px' }}
                            />
                        </FlexDiv>
                    )
                ) : (
                    <PriceChange up={processedPriceData > 0}>
                        {formatPricePercentageGrowth(processedPriceData)}
                    </PriceChange>
                )}
            </FlexDivSpaceBetween>
            <ChartContainer>
                {pythQuery.isLoading ? (
                    <SimpleLoader />
                ) : (
                    <ChartComponent
                        resolution={dateRange.resolution}
                        data={candleData}
                        position={position}
                        asset={asset}
                        selectedPrice={selectedPrice}
                        selectedRightPrice={selectedRightPrice}
                        isSpeedMarkets={isSpeedMarkets}
                        selectedDate={selectedDate}
                    />
                )}
            </ChartContainer>

            <Toggle
                options={isSpeedMarkets ? SpeedMarketsToggleButtons : ToggleButtons}
                selectedIndex={selectedToggleIndex}
                onChange={handleDateRangeChange}
            />
            {isSpeedMarkets && (
                <PythIconWrap>
                    <a target="_blank" rel="noreferrer" href={LINKS.Pyth}>
                        <i className="icon icon--pyth" />
                    </a>
                </PythIconWrap>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    margin-top: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: 352px;
    }
`;

const ChartContainer = styled.div`
    height: 284px;
    margin-top: 15px;
`;

const PriceChange = styled.span<{ up: boolean }>`
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    color: ${(props) => (props.up ? props.theme.textColor.quaternary : props.theme.textColor.tertiary)};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 18px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.EXTRA_SMALL}px) {
        font-size: 16px;
    }
`;

const Value = styled.span<{ margin?: string }>`
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 18px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.EXTRA_SMALL}px) {
        font-size: 16px;
    }
`;

const PythIconWrap = styled.div`
    position: absolute;
    height: 20px;
    right: 20px;
    bottom: 35px;
    z-index: 1;
    i {
        font-size: 40px;
        line-height: 10px;
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export default LightweightChart;
