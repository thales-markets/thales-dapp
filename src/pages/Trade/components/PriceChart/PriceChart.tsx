import { CoinGeckoClient } from 'coingecko-api-v3';
import { USD_SIGN, currencyKeyToCoinGeckoIndexMap } from 'constants/currency';
import { format } from 'date-fns';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import usePriceDataQuery from 'queries/price/usePriceDataQuery';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceArea,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styled, { useTheme } from 'styled-components';
import { FlexDiv, FlexDivRowCentered, FlexDivSpaceBetween } from 'styles/common';
import { ThemeInterface } from 'types/ui';
import {
    calculatePercentageChange,
    formatCurrencyWithPrecision,
    formatCurrencyWithSign,
    formatPricePercentageGrowth,
} from 'utils/formatters/number';
import Toggle from './components/DateToggle';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter, bytesFormatter } from 'utils/formatters/ethers';
import TooltipInfo from 'components/Tooltip';
import { useTranslation } from 'react-i18next';
import CurrentPrice from './components/CurrentPrice';
import { RiskPerAsset } from 'types/options';

type PriceChartProps = {
    asset: string;
    selectedPrice: number | undefined;
    selectedRightPrice?: number;
    position: Positions | undefined;
    isSpeedMarkets?: boolean;
    explicitCurrentPrice?: number;
    prevExplicitPrice?: number;
    risksPerAsset?: RiskPerAsset[];
};

const coinGeckoClientPublic = new CoinGeckoClient({
    timeout: 10000,
    autoRetry: true,
});

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

const SpeedMarketsToggleButtons = [
    { label: '1H', value: 0.05 },
    { label: '12H', value: 0.5 },
    { label: '1D', value: 1 },
    { label: '1W', value: 7 },
    { label: '2W', value: 14 },
    { label: '1M', value: 30 },
];

const PriceChart: React.FC<PriceChartProps> = ({
    asset,
    selectedPrice,
    selectedRightPrice,
    position,
    isSpeedMarkets,
    explicitCurrentPrice,
    prevExplicitPrice,
    risksPerAsset,
}) => {
    const theme: ThemeInterface = useTheme();
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [data, setData] = useState<{ date: string; price: number }[]>();
    const [dateRange, setDateRange] = useState(14); // default date range
    const [ticks, setTicks] = useState<number[]>();
    const [iv, setIV] = useState(0);

    const priceData = usePriceDataQuery({ currencyKey: asset, currencyVs: '', days: 1 }, { refetchInterval: false });

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
        if (priceData.isSuccess && priceData.data && priceData?.data?.prices) {
            if (priceData?.data?.prices?.length) {
                const processedPriceData = priceData.data.prices;
                return calculatePercentageChange(
                    processedPriceData[processedPriceData.length - 1][1],
                    processedPriceData[0][1]
                );
            }
        }

        return 0;
    }, [priceData]);

    const handleDateRangeChange = (value: number) => {
        setDateRange(value);
        // fetch data based on new date range here...
    };

    useEffect(() => {
        const fetchData = async () => {
            if (currentPrice) {
                let result;
                try {
                    result = await coinGeckoClientPublic.coinIdMarketChart({
                        id: currencyKeyToCoinGeckoIndexMap[asset],
                        vs_currency: 'usd',
                        days: dateRange,
                    });
                } catch (e) {
                    console.log('Switching to private: ', e);
                    try {
                        result = await coinGeckoClientPrivate.coinIdMarketChart({
                            id: currencyKeyToCoinGeckoIndexMap[asset],
                            vs_currency: 'usd',
                            days: dateRange,
                        });
                    } catch (e) {
                        console.log('Private failed: ', e);
                    }
                }
                if (result) {
                    const dateFormat = isSpeedMarkets ? 'dd/MM HH:mm' : 'dd/MM';
                    const priceData = result.prices.map((price) => ({
                        date: format(new Date(price[0]), dateFormat),
                        price: Number(price[1]),
                    }));

                    priceData.push({ date: format(new Date(), dateFormat), price: currentPrice });

                    setData(priceData);

                    setTicks(getTicks(priceData.map(({ price }) => price)));
                } else {
                    console.log('COINGECKO API failed');
                }
            }
        };
        fetchData();
    }, [asset, dateRange, currentPrice, isSpeedMarkets]);

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

    const riskPerAsset = risksPerAsset?.filter((riskPerAsset) => riskPerAsset.currency === asset)[0];
    const openInterest = riskPerAsset ? formatCurrencyWithSign(USD_SIGN, riskPerAsset.max - riskPerAsset.current) : 0;

    const getReferenceArea = (ticks: any) => {
        if (position === Positions.UP || position === Positions.DOWN) {
            if (selectedPrice) {
                return (
                    <ReferenceArea
                        xHeight={1}
                        y1={selectedPrice}
                        y2={ticks ? (position === Positions.UP ? ticks[ticks.length - 1] : ticks[0]) : 0}
                        fill="url(#referenceGradient)"
                        fillOpacity={0.2}
                    />
                );
            }
        } else {
            if (selectedRightPrice) {
                if (position === Positions.IN) {
                    return (
                        <ReferenceArea
                            xHeight={1}
                            y1={selectedPrice}
                            y2={selectedRightPrice}
                            fill="url(#referenceGradient)"
                            fillOpacity={0.2}
                        />
                    );
                } else {
                    return (
                        <>
                            <ReferenceArea
                                xHeight={1}
                                y1={selectedPrice}
                                y2={ticks ? ticks[0] : 0}
                                fill="url(#referenceGradient)"
                                fillOpacity={0.2}
                            />
                            <ReferenceArea
                                xHeight={1}
                                y1={selectedRightPrice}
                                y2={ticks ? ticks[ticks.length - 1] : 0}
                                fill="url(#referenceGradient)"
                                fillOpacity={0.2}
                            />
                        </>
                    );
                }
            }
        }
    };

    return (
        <Wrapper>
            <FlexDivSpaceBetween margin="15px 0px">
                <FlexDivRowCentered>
                    <CurrentPrice
                        asset={asset}
                        currentPrice={isSpeedMarkets ? currentPrice : data ? currentPrice : undefined}
                        animatePrice={isSpeedMarkets}
                        isPriceUp={isSpeedMarkets ? (explicitCurrentPrice || 0) > (prevExplicitPrice || 0) : undefined}
                    />
                    {!!iv && (
                        <FlexDiv>
                            <Value>{`IV ${iv}%`}</Value>
                            <TooltipInfo
                                overlay={t('markets.amm-trading.iv-tooltip')}
                                customIconStyling={{ marginTop: '1px' }}
                            />
                        </FlexDiv>
                    )}
                    {!!openInterest && (
                        <FlexDiv>
                            <Value>{`${t('common.liquidity')} ${openInterest}`}</Value>
                            <TooltipInfo
                                overlay={t('speed-markets.tooltips.liquidity')}
                                customIconStyling={{ marginTop: '1px' }}
                            />
                        </FlexDiv>
                    )}
                </FlexDivRowCentered>
                {!isSpeedMarkets && (
                    <PriceChange up={processedPriceData > 0}>
                        {formatPricePercentageGrowth(processedPriceData)}
                    </PriceChange>
                )}
            </FlexDivSpaceBetween>
            {data && (
                <ResponsiveContainer width="100%" height={isSpeedMarkets ? 323 : 266}>
                    <AreaChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                        {getReferenceArea(ticks)}
                        <defs xHeight={1}>
                            <linearGradient id="referenceGradient" x1="0" y1="0" x2="0" y2="1" xHeight={1}>
                                <stop
                                    offset="0%"
                                    stopColor={`${theme.textColor.quaternary}`}
                                    stopOpacity={position === Positions.UP ? 0 : 0.8}
                                />
                                <stop
                                    offset="90.62%"
                                    stopColor={`${theme.textColor.quaternary}`}
                                    stopOpacity={position === Positions.UP ? 0.8 : 0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke={theme.borderColor.primary} strokeDasharray="1" />
                        <XAxis
                            tick={{ fontSize: '10px', fill: theme.textColor.secondary }}
                            tickLine={false}
                            axisLine={false}
                            dataKey="date"
                            domain={['auto', 'auto']}
                            padding={{ right: 45 }}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            ticks={ticks}
                            tick={{
                                fontSize: '10px',
                                fill: theme.textColor.secondary,
                                width: 100,
                            }}
                            width={70}
                            tickCount={10}
                            tickLine={false}
                            axisLine={false}
                            orientation="right"
                            tickFormatter={(value) => formatYAxisTick(value)}
                        />
                        <Tooltip
                            formatter={(value) => formatCurrencyWithPrecision(Number(value))}
                            contentStyle={{
                                backgroundColor: theme.background.secondary,
                                color: theme.textColor.primary,
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: 14,
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={theme.borderColor.tertiary}
                            strokeWidth={2}
                            fill="transparent"
                            animationEasing="ease-in"
                            animationDuration={150}
                            xHeight={2}
                        />

                        <ReferenceLine
                            y={data[data?.length - 1].price}
                            stroke={theme.borderColor.tertiary}
                            strokeDasharray="3 3"
                            xHeight={2}
                            label={<CustomLabel price={data[data?.length - 1].price} />}
                        />

                        {selectedPrice && (
                            <ReferenceLine
                                y={selectedPrice}
                                stroke={theme.borderColor.quaternary}
                                label={<CustomLabel2 price={selectedPrice} />}
                            />
                        )}

                        {selectedRightPrice && (
                            <ReferenceLine
                                y={selectedRightPrice}
                                stroke={theme.borderColor.quaternary}
                                label={<CustomLabel2 price={selectedRightPrice} />}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            )}
            <Toggle
                options={isSpeedMarkets ? SpeedMarketsToggleButtons : ToggleButtons}
                defaultSelectedIndex={2}
                onChange={handleDateRangeChange}
            />
        </Wrapper>
    );
};

const formatYAxisTick = (value: number) => {
    if (value < 0.01) {
        return formatCurrencyWithSign(USD_SIGN, value);
    }
    return formatCurrencyWithSign(USD_SIGN, value, 2);
};

const getTicks = (prices: number[]) => {
    const tickCount = 6;
    let min = prices[0],
        max = prices[0];
    prices.map((price) => {
        if (price > max) max = price;
        if (price < min) min = price;
    });

    const roundedPow = Math.round(Math.log(prices[prices.length - 1]) / Math.log(10));
    const step = Math.pow(10, roundedPow - 1);
    const interval = (max - min) / tickCount;

    let final = interval;
    let stepChange = step;

    if (final < stepChange / 2) {
        while (final < stepChange / 2) {
            stepChange = stepChange / 2;
        }
        final = stepChange;
    } else if (final > stepChange * 1.5) {
        while (final > stepChange * 1.5) {
            stepChange = stepChange * 1.5;
        }
        final = stepChange;
    }

    // const stepFinal = Math.round(step / diff);
    // const log1 = Math.round(Math.log(stepFinal) / Math.log(10));
    // const stepFinal2 = (Math.round(stepFinal / Math.pow(10, log1)) * Math.pow(10, log1)) / multiplier;

    const startTick = Math.round(min / final) * final - 1 * final;
    const endTick = Math.round(max / final) * final + 1 * final;
    const ticks = [];

    for (let tick = startTick; tick <= endTick; tick += final) {
        ticks.push(tick);
    }

    if (ticks.length < 10) {
        let ticksLeft = 10 - ticks.length;
        while (ticksLeft > 0) {
            if (ticksLeft % 2 === 0) {
                ticks.push(ticks[ticks.length - 1] + final);
            } else {
                ticks.unshift(ticks[0] - final);
            }
            ticksLeft--;
        }
    }

    return ticks;
};

const CustomLabel = (props: any) => {
    return (
        <SVGBorder y={props.viewBox.y - 10} x={props.viewBox.width - 50}>
            <Rectangle rx={10} y={3}></Rectangle>
            <Text x={8} y={14}>
                {props.price < 0.01
                    ? formatCurrencyWithSign(USD_SIGN, props.price)
                    : formatCurrencyWithSign(USD_SIGN, props.price, 2)}
            </Text>
        </SVGBorder>
    );
};

const SVGBorder = styled.svg`
    width: 70px;
    height: 20px;
`;

const Rectangle = styled.rect`
    stroke-width: 1px;
    width: 70px;
    height: 16px;
    stroke: ${(props) => props.theme.borderColor.tertiary};
    fill: ${(props) => props.theme.background.primary};
`;

const Text = styled.text`
    fill: ${(props) => props.theme.borderColor.tertiary};
    font-size: 10px;
`;

const CustomLabel2 = (props: any) => {
    return (
        <SVGBorder y={props.viewBox.y - 10} x={props.viewBox.width - 50}>
            <Rectangle2 rx={10} y={3}></Rectangle2>
            <Text2 x={8} y={14}>
                {props.price < 0.01
                    ? formatCurrencyWithSign(USD_SIGN, props.price)
                    : formatCurrencyWithSign(USD_SIGN, props.price, 2)}
            </Text2>
        </SVGBorder>
    );
};

const Rectangle2 = styled.rect`
    stroke-width: 1px;
    width: 70px;
    height: 16px;
    stroke: ${(props) => props.theme.borderColor.quaternary};
    fill: ${(props) => props.theme.background.primary};
`;

const Text2 = styled.text`
    fill: ${(props) => props.theme.textColor.quaternary};
    font-size: 10px;
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    max-height: 300px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const PriceChange = styled.span<{ up: boolean }>`
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    color: ${(props) => (props.up ? props.theme.textColor.quaternary : props.theme.textColor.tertiary)};
`;

const Value = styled.span`
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    margin-left: 20px;
`;

export default PriceChart;
