import React, { useEffect, useMemo, useState } from 'react';
import { CoinGeckoClient } from 'coingecko-api-v3';
import { XAxis, YAxis, Area, AreaChart, ResponsiveContainer, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { USD_SIGN, currencyKeyToCoinGeckoIndexMap } from 'constants/currency';
import styled from 'styled-components';
import { format } from 'date-fns';
import Toggle from './components/DateToggle/Toggle';
import {
    calculatePercentageChange,
    formatCurrencyWithSign,
    formatPricePercentageGrowth,
} from 'utils/formatters/number';
import usePriceDataQuery from 'queries/price/usePriceDataQuery';
import { FlexDivSpaceBetween } from 'theme/common';
import { useSelector } from 'react-redux';
import { getTheme } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';
import { ThemeMap } from 'constants/ui';

type PriceChartProps = {
    asset: string;
    selectedPrice: number | undefined;
    selectedRightPrice?: number;
};

const coinGeckoClient = new CoinGeckoClient({
    timeout: 10000,
    autoRetry: true,
});

const ToggleButtons = [
    { label: '1D', value: 1 },
    { label: '1W', value: 7 },
    { label: '2W', value: 14 },
    { label: '1M', value: 30 },
    { label: '6M', value: 182 },
    { label: '1Y', value: 365 },
];

const PriceChart: React.FC<PriceChartProps> = ({ asset, selectedPrice, selectedRightPrice }) => {
    const theme = useSelector((state: RootState) => getTheme(state));
    const [data, setData] = useState<{ date: string; price: number }[]>();
    const [dateRange, setDateRange] = useState(14); // default date range

    const [ticks, setTicks] = useState<number[]>();

    const priceData = usePriceDataQuery({ currencyKey: asset, currencyVs: '', days: 1 }, { refetchInterval: false });

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
            try {
                const result = await coinGeckoClient.coinIdMarketChart({
                    id: currencyKeyToCoinGeckoIndexMap[asset],
                    vs_currency: 'usd',
                    days: dateRange,
                });
                const priceData = result.prices.map((price) => ({
                    date: format(new Date(price[0]), 'MM/dd'),
                    price: Number(price[1].toFixed(2)),
                }));

                setData(priceData);

                setTicks(getTicks(priceData[priceData.length - 1].price));
            } catch (e) {
                console.log('COINGECKO error: ', e);
            }
        };
        fetchData();
    }, [asset, dateRange]);

    return (
        <Wrapper>
            <FlexDivSpaceBetween style={{ margin: '15px 0px' }}>
                <IconPriceWrapper>
                    <Icon className={`currency-icon currency-icon--${asset.toLowerCase()}`} />
                    <Price>{data ? formatCurrencyWithSign(USD_SIGN, data[data?.length - 1].price) : 'N/A'}</Price>
                </IconPriceWrapper>
                <PriceChange up={processedPriceData > 0}>{formatPricePercentageGrowth(processedPriceData)}</PriceChange>
            </FlexDivSpaceBetween>
            {data && (
                <ResponsiveContainer width="100%" height={266}>
                    <AreaChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                        <CartesianGrid stroke="#2B3139" strokeDasharray="1" />
                        <XAxis
                            tick={{ fontSize: '10px', fontFamily: 'Inter', fill: ThemeMap[theme].textColor.secondary }}
                            tickLine={false}
                            axisLine={false}
                            dataKey="date"
                            domain={['auto', 'auto']}
                            padding={{ right: 45 }}
                        />
                        <YAxis
                            domain={[ticks ? ticks[0] : 0, ticks ? ticks[ticks.length - 1] : 0]}
                            tick={{
                                fontSize: '10px',
                                fontFamily: 'Inter',
                                fill: ThemeMap[theme].textColor.secondary,
                                width: 100,
                            }}
                            tickLine={false}
                            axisLine={false}
                            tickCount={8}
                            orientation="right"
                            tickFormatter={(value) => formatYAxisTick(value)}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-tertiary)',
                                color: 'var(--color-white)',
                                border: 'none',
                                fontFamily: 'Roboto',
                                fontSize: 14,
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#F7B91A"
                            strokeWidth={2}
                            fill="var(--color-primary)"
                        />

                        <ReferenceLine
                            y={data[data?.length - 1].price}
                            stroke="#F7B91A"
                            strokeDasharray="3 3"
                            label={<CustomLabel price={data[data?.length - 1].price} />}
                        />

                        {selectedPrice && (
                            <ReferenceLine
                                y={selectedPrice}
                                stroke="#F7B91A"
                                strokeDasharray="3 3"
                                label={<CustomLabel price={selectedPrice} />}
                            />
                        )}

                        {selectedRightPrice && (
                            <ReferenceLine
                                y={selectedRightPrice}
                                stroke="var(--color-highlight)"
                                strokeDasharray="3 3"
                                label={{
                                    value: `Strike price: $${selectedRightPrice}`,
                                    fill: 'var(--color-highlight)',
                                    fontFamily: 'Roboto',
                                    fontSize: '14px',
                                    position: 'insideRight',
                                    dy: -10,
                                }}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            )}
            <Toggle options={ToggleButtons} defaultSelectedIndex={2} onChange={handleDateRangeChange} />
        </Wrapper>
    );
};

const CustomLabel = (props: any) => {
    return (
        <SVGBorder y={props.viewBox.y - 10} x={props.viewBox.width - 50}>
            <Rectangle rx={10} y={3}></Rectangle>
            <Text x={8} y={14}>
                {formatCurrencyWithSign(USD_SIGN, props.price, 2)}
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
    stroke: ${(props) => props.theme.borderColor.secondary};
    fill: ${(props) => props.theme.background.primary};
`;

const Text = styled.text`
    fill: ${(props) => props.theme.borderColor.secondary};
    font-size: 10px;
    font-family: Inter !important;
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    max-height: 300px;
`;

const IconPriceWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
`;

const Icon = styled.i`
    font-size: 32px;
`;

const Price = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    padding:
    /* or 22px */

    text-transform: capitalize;
    color: ${(props) => props.theme.textColor.primary};
`;

const PriceChange = styled.span<{ up: boolean }>`
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    padding:
    /* or 22px */

    text-transform: capitalize;
    color: ${(props) => (props.up ? props.theme.textColor.quaternary : props.theme.textColor.tertiary)};
`;

const formatYAxisTick = (value: number) => {
    let stepSize;

    if (value < 1) {
        stepSize = 0.05;
    } else if (value < 10) {
        stepSize = 0.2;
    } else if (value < 100) {
        stepSize = 0.5;
    } else if (value < 1000) {
        stepSize = 50;
    } else {
        stepSize = Math.pow(10, Math.floor(Math.log10(value)) - 1);
    }

    const ticks = [];
    for (let tick = stepSize; tick <= value; tick += stepSize) {
        ticks.push(tick);
    }

    return ticks.length ? formatCurrencyWithSign(USD_SIGN, ticks[ticks.length - 1]) : '';
};

const getTicks = (value: number) => {
    let stepSize;
    const tickCount = 5;

    if (value < 1) {
        stepSize = 0.05;
    } else if (value < 10) {
        stepSize = 0.2;
    } else if (value < 100) {
        stepSize = 0.5;
    } else if (value < 1000) {
        stepSize = 50;
    } else {
        stepSize = Math.pow(10, Math.floor(Math.log10(value)) - 1);
    }

    const centerTick = Math.round(value / stepSize) * stepSize;
    const startTick = centerTick - tickCount * stepSize;
    const endTick = centerTick + tickCount * stepSize;
    const ticks = [];

    for (let tick = startTick; tick <= endTick; tick += stepSize) {
        ticks.push(tick);
    }

    return ticks;
};

export default PriceChart;
