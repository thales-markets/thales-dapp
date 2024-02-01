import { CoinGeckoClient } from 'coingecko-api-v3';
import TooltipInfo from 'components/Tooltip';
import { USD_SIGN, currencyKeyToCoinGeckoIndexMap } from 'constants/currency';
import { differenceInMinutes, format, parse } from 'date-fns';
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
import { FlexDiv, FlexDivRowCentered, FlexDivSpaceBetween } from 'styles/common';
import { bigNumberFormatter, bytesFormatter, formatCurrencyWithSign } from 'thales-utils';
import { Risk, RiskPerAsset, RiskPerAssetAndPosition } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { calculatePercentageChange, formatPricePercentageGrowth } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';
import CurrentPrice from './components/CurrentPrice';
import Toggle from './components/DateToggle';
import { LINKS } from 'constants/links';
import { createChart, ColorType } from 'lightweight-charts';
// import { createChart, ColorType } from 'lightweight-charts';

type LightweightChartProps = {
    asset: string;
    selectedPrice: number | undefined;
    selectedRightPrice?: number;
    position: Positions | undefined;
    isSpeedMarkets?: boolean;
    explicitCurrentPrice?: number;
    prevExplicitPrice?: number;
    chainedRisk?: Risk;
    risksPerAsset?: RiskPerAsset[];
    risksPerAssetAndDirection?: RiskPerAssetAndPosition[];
};

const coinGeckoClientPrivate = new CoinGeckoClient(
    {
        timeout: 10000,
        autoRetry: true,
    },
    process.env.REACT_APP_COINGECKO_API_KEY
);

const ToggleButtons = [
    { label: '1D', value: 1 },
    { label: '1W', value: 7 },
    { label: '2W', value: 14 },
    { label: '1M', value: 30 },
    { label: '6M', value: 182 },
    { label: '1Y', value: 365 },
];
const DEFAULT_TOGGLE_BUTTON_INDEX = 2;

const SpeedMarketsToggleButtons = [
    { label: '1H', value: 0.05 },
    { label: '12H', value: 0.5 },
    { label: '1D', value: 1 },
    { label: '1W', value: 7 },
    { label: '2W', value: 14 },
    { label: '1M', value: 30 },
];
const DEFAULT_SPEED_MARKETS_TOGGLE_BUTTON_INDEX = 0;

const DATE_FORMAT = 'dd/MM HH:mm';

const CHART_PRICES_TIMEFRAME_MINUTES = 5;

const LightweightChart: React.FC<LightweightChartProps> = ({
    asset,
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

    const [data, setData] = useState<{ date: string; price: number; asset: string }[]>();
    const [dateRange, setDateRange] = useState(
        isSpeedMarkets
            ? SpeedMarketsToggleButtons[DEFAULT_SPEED_MARKETS_TOGGLE_BUTTON_INDEX].value
            : ToggleButtons[DEFAULT_TOGGLE_BUTTON_INDEX].value
    ); // default date range

    const [iv, setIV] = useState(0);

    const chartContainerRef = useRef<HTMLDivElement>(null);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery(networkId, {
        enabled: isAppReady && !explicitCurrentPrice,
    });

    const currentPrice = useMemo(() => {
        if (explicitCurrentPrice) {
            return explicitCurrentPrice;
        } else if (exchangeRatesMarketDataQuery.isSuccess && exchangeRatesMarketDataQuery.data) {
            return exchangeRatesMarketDataQuery.data[asset];
        }
    }, [exchangeRatesMarketDataQuery.isSuccess, exchangeRatesMarketDataQuery.data, asset, explicitCurrentPrice]);

    const processedPriceData = useMemo(() => {
        if (data) {
            return calculatePercentageChange(data[data.length - 1].price, data[0].price);
        }
        return 0;
    }, [data]);

    const handleDateRangeChange = (value: number) => {
        setDateRange(value);
    };

    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
        };

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
        });

        coinGeckoClientPrivate
            .coinIdOHLC({
                id: currencyKeyToCoinGeckoIndexMap[asset],
                vs_currency: 'usd',
                days: dateRange,
            })
            .then((ohlc) => {
                const candleStickData = ohlc.map((ohlcData: any) => {
                    console.log(ohlcData[0]);
                    return {
                        open: ohlcData[1],
                        high: ohlcData[2],
                        low: ohlcData[3],
                        close: ohlcData[4],
                        time: ohlcData[0] / 1000,
                    };
                });

                const lineData = candleStickData.map((datapoint) => ({
                    time: datapoint.time,
                    value: (datapoint.close + datapoint.open) / 2,
                }));

                const areaSeries = chart.addAreaSeries({
                    lastValueVisible: false, // hide the last value marker for this series
                    crosshairMarkerVisible: false, // hide the crosshair marker for this series
                    lineColor: 'transparent', // hide the line
                    topColor: 'rgba(56, 33, 110,0.6)',
                    bottomColor: 'rgba(56, 33, 110, 0.1)',
                });
                // Set the data for the Area Series
                areaSeries.setData(lineData as any);
                const candlestickSeries = chart.addCandlestickSeries({
                    upColor: '#26a69a',
                    downColor: '#ef5350',
                    wickUpColor: '#26a69a',
                    wickDownColor: '#ef5350',
                });
                candlestickSeries.setData(candleStickData as any);

                chart.timeScale().fitContent();
            });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove();
        };
    }, [asset, dateRange, theme.background.primary, theme.textColor.primary]);

    // Add current prices to data (mostly for pyth prices on speed markets) on every 5 min and in the meantime refresh last price
    useEffect(() => {
        if (currentPrice) {
            setData((prevData) => {
                if (prevData && prevData[0].asset === asset) {
                    const priceData = [...prevData];
                    const beforeLastPriceTime = parse(prevData[prevData.length - 2].date, DATE_FORMAT, Date.now());
                    const date = format(Date.now(), DATE_FORMAT);
                    // on every 5min add new price, otherwise just update last one
                    if (differenceInMinutes(Date.now(), beforeLastPriceTime) >= CHART_PRICES_TIMEFRAME_MINUTES) {
                        // final update last price and add new current price
                        priceData[priceData.length - 1] = {
                            date,
                            price: currentPrice,
                            asset,
                        };
                        priceData.push({ date, price: currentPrice, asset });
                    } else {
                        // update last current price until it becomes final
                        priceData[priceData.length - 1] = {
                            date,
                            price: currentPrice,
                            asset,
                        };
                    }

                    // setTicks(getTicks(priceData.map(({ price }) => price)));
                    return priceData;
                }
                return prevData;
            });
        }
    }, [currentPrice, asset]);

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
                        currentPrice={isSpeedMarkets || data ? currentPrice : undefined}
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
                options={isSpeedMarkets ? SpeedMarketsToggleButtons : ToggleButtons}
                defaultSelectedIndex={
                    isSpeedMarkets ? DEFAULT_SPEED_MARKETS_TOGGLE_BUTTON_INDEX : DEFAULT_TOGGLE_BUTTON_INDEX
                }
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

// const formatYAxisTick = (value: number) => {
//     if (value < 0.01) {
//         return formatCurrencyWithSign(USD_SIGN, value);
//     }
//     return formatCurrencyWithSign(USD_SIGN, value, 2);
// };

// const getTicks = (prices: number[]) => {
//     const tickCount = 6;
//     let min = prices[0],
//         max = prices[0];
//     prices.map((price) => {
//         if (price > max) max = price;
//         if (price < min) min = price;
//     });

//     const roundedPow = Math.round(Math.log(prices[prices.length - 1]) / Math.log(10));
//     const step = Math.pow(10, roundedPow - 1);
//     const interval = (max - min) / tickCount;

//     let final = interval;
//     let stepChange = step;

//     if (final < stepChange / 2) {
//         while (final < stepChange / 2) {
//             stepChange = stepChange / 2;
//         }
//         final = stepChange;
//     } else if (final > stepChange * 1.5) {
//         while (final > stepChange * 1.5) {
//             stepChange = stepChange * 1.5;
//         }
//         final = stepChange;
//     }

//     // const stepFinal = Math.round(step / diff);
//     // const log1 = Math.round(Math.log(stepFinal) / Math.log(10));
//     // const stepFinal2 = (Math.round(stepFinal / Math.pow(10, log1)) * Math.pow(10, log1)) / multiplier;

//     const startTick = Math.round(min / final) * final - 1 * final;
//     const endTick = Math.round(max / final) * final + 1 * final;
//     const ticks = [];

//     for (let tick = startTick; tick <= endTick; tick += final) {
//         ticks.push(tick);
//     }

//     if (ticks.length < 10) {
//         let ticksLeft = 10 - ticks.length;
//         while (ticksLeft > 0) {
//             if (ticksLeft % 2 === 0) {
//                 ticks.push(ticks[ticks.length - 1] + final);
//             } else {
//                 ticks.unshift(ticks[0] - final);
//             }
//             ticksLeft--;
//         }
//     }

//     return ticks;
// };

// const CustomLabel = (props: any) => {
//     return (
//         <SVGBorder y={props.viewBox.y - 10} x={props.viewBox.width - 80}>
//             <Rectangle rx={10} y={3}></Rectangle>
//             <Text x={35} y={12}>
//                 {props.price < 0.01
//                     ? formatCurrencyWithSign(USD_SIGN, props.price)
//                     : formatCurrencyWithSign(USD_SIGN, props.price, 2)}
//             </Text>
//         </SVGBorder>
//     );
// };

// const SVGBorder = styled.svg`
//     width: 70px;
//     height: 20px;
// `;

// const Rectangle = styled.rect`
//     stroke-width: 1px;
//     width: 70px;
//     height: 16px;
//     stroke: ${(props) => props.theme.borderColor.tertiary};
//     fill: ${(props) => props.theme.background.primary};
// `;

// const Text = styled.text`
//     text-anchor: middle;
//     dominant-baseline: middle;
//     fill: ${(props) => props.theme.borderColor.tertiary};
//     font-size: 10px;
// `;

// const CustomLabel2 = (props: any) => {
//     return (
//         <SVGBorder y={props.viewBox.y - 10} x={props.viewBox.width - 80}>
//             <Rectangle2 rx={10} y={3}></Rectangle2>
//             <Text2 x={35} y={12}>
//                 {props.price < 0.01
//                     ? formatCurrencyWithSign(USD_SIGN, props.price)
//                     : formatCurrencyWithSign(USD_SIGN, props.price, 2)}
//             </Text2>
//         </SVGBorder>
//     );
// };

// const Rectangle2 = styled(Rectangle)`
//     stroke: ${(props) => props.theme.borderColor.quaternary};
//     fill: ${(props) => props.theme.background.primary};
// `;

// const Text2 = styled(Text)`
//     fill: ${(props) => props.theme.textColor.quaternary};
// `;

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

const PythIconWrap = styled.div`
    position: absolute;
    height: 20px;
    right: 70px;
    bottom: 38px;
    i {
        font-size: 40px;
        line-height: 10px;
        color: ${(props) => props.theme.textColor.primary};
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

export default LightweightChart;
