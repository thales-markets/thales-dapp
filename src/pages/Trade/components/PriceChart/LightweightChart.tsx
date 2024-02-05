import TooltipInfo from 'components/Tooltip';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { Colors, FlexDiv, FlexDivRowCentered, FlexDivSpaceBetween } from 'styles/common';
import { bigNumberFormatter, bytesFormatter, formatCurrencyWithSign } from 'thales-utils';
import { ThemeInterface } from 'types/ui';
import { calculatePercentageChange, formatPricePercentageGrowth } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';
import CurrentPrice from './components/CurrentPrice';
import Toggle from './components/DateToggle';
import { createChart, ColorType } from 'lightweight-charts';
import usePythCandlestickQuery from 'queries/prices/usePythCandlestickQuery';
import { Risk, RiskPerAsset, RiskPerAssetAndPosition } from 'types/options';
import { USD_SIGN } from 'constants/currency';

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
    risksPerAssetAndDirection?: RiskPerAssetAndPosition[];
};

const ToggleButtons = [
    { label: '15', resolution: '15', value: 2 },
    { label: '30', resolution: '30', value: 4 },
    { label: '1H', resolution: '60', value: 14 },
    { label: '4H', resolution: '240', value: 28 },
    { label: '1D', resolution: '1D', value: 120 },
    { label: '1W', resolution: '1W', value: 730 },
];
const DEFAULT_TOGGLE_BUTTON_INDEX = 2;
const DEFAULT_TOGGLE_BUTTON_INDEX_SPEED_MARKETS = 0;

const LightweightChart: React.FC<LightweightChartProps> = ({
    asset,
    selectedPrice,
    position,
    selectedDate,
    isSpeedMarkets,
    explicitCurrentPrice,
    prevExplicitPrice,
    chainedRisk,
    risksPerAsset,
    risksPerAssetAndDirection,
}) => {
    const theme: ThemeInterface = useTheme();
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [processedPriceData, setProcessedPriceData] = useState<number>(0);
    const [dateRange, setDateRange] = useState(
        !isSpeedMarkets
            ? ToggleButtons[DEFAULT_TOGGLE_BUTTON_INDEX]
            : ToggleButtons[DEFAULT_TOGGLE_BUTTON_INDEX_SPEED_MARKETS]
    ); // default date range: ;

    const [iv, setIV] = useState(0);

    const chartContainerRef = useRef<HTMLDivElement>(null);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery(networkId, {
        enabled: isAppReady,
    });

    const pythQuery = usePythCandlestickQuery(asset, dateRange.value, dateRange.resolution, {
        enabled: isAppReady,
        refetchInterval: 5000,
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

    const handleDateRangeChange = (value: number) => {
        setDateRange(ToggleButtons[value]);
    };

    useEffect(() => {
        const chart = createChart(chartContainerRef.current ?? '', {
            layout: {
                background: { type: ColorType.Solid, color: theme.background.primary },
                textColor: theme.textColor.secondary,
            },
            height: 285,
            grid: {
                vertLines: {
                    visible: true,
                    color: theme.borderColor.primary,
                },
                horzLines: {
                    visible: true,
                    color: theme.borderColor.primary,
                },
            },
            timeScale: {
                rightOffset: 1,
                timeVisible: true,
                fixLeftEdge: true,
                barSpacing: 15,
            },
        });

        const createLightweightChart = async () => {
            if (chart && candleStickData) {
                // candleStickData[candleStickData.length - 1].close = currentPrice; // update last price with current one from chainlink

                const lineDataSelected = candleStickData.map((datapoint) => ({
                    time: datapoint.time,
                    value: selectedPrice,
                }));

                if (selectedPrice && selectedDate) {
                    const deltaTime = candleStickData[1].time - candleStickData[0].time;
                    while (lineDataSelected[lineDataSelected.length - 1].time + deltaTime < selectedDate / 1000) {
                        lineDataSelected.push({
                            time: lineDataSelected[lineDataSelected.length - 1].time + deltaTime,
                            value: selectedPrice,
                        });
                    }
                    lineDataSelected.push({
                        time: selectedDate / 1000,
                        value: selectedPrice,
                    });
                    const areaSeriesSelected = chart.addAreaSeries({
                        lastValueVisible: !isSpeedMarkets,
                        crosshairMarkerVisible: false,
                        lineColor: Colors.BLUE_MIDNIGHT_LIGHT,
                        lineWidth: 1,
                        topColor: position === Positions.UP ? Colors.BLUE_MIDNIGHT_LIGHT : Colors.GRAY_PURPLE_BLURED,
                        bottomColor: position === Positions.UP ? Colors.GRAY_PURPLE_BLURED : Colors.BLUE_MIDNIGHT_LIGHT,
                        invertFilledArea: position === Positions.UP,
                    });
                    areaSeriesSelected.setData(lineDataSelected as any);
                }

                const candlestickSeries = chart.addCandlestickSeries({
                    upColor: Colors.GREEN,
                    downColor: Colors.RED,
                    wickUpColor: Colors.GREEN,
                    wickDownColor: Colors.RED,
                    priceLineColor: theme.borderColor.tertiary,
                    priceLineWidth: 1,
                    lastValueVisible: true,
                });
                const cloneData = [...candleStickData];
                if (currentPrice) cloneData[cloneData.length - 1].close = currentPrice;
                candlestickSeries.setData(cloneData as any);
                if (!isSpeedMarkets) chart.timeScale().fitContent();

                setProcessedPriceData(
                    calculatePercentageChange(
                        candleStickData[candleStickData.length - 1].close,
                        candleStickData[0].close
                    )
                );
            }
        };
        createLightweightChart();
        return () => {
            chart.remove();
        };
    }, [asset, theme, selectedPrice, position, candleStickData, selectedDate, currentPrice, isSpeedMarkets]);

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
            <FlexDivSpaceBetween margin="15px 0px">
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
            <div ref={chartContainerRef} />

            <Toggle
                options={ToggleButtons}
                defaultSelectedIndex={
                    isSpeedMarkets ? DEFAULT_TOGGLE_BUTTON_INDEX_SPEED_MARKETS : DEFAULT_TOGGLE_BUTTON_INDEX
                }
                onChange={handleDateRangeChange}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
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
`;

const Value = styled.span<{ margin?: string }>`
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')};
`;

export default LightweightChart;
