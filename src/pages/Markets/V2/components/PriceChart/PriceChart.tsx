import React, { useEffect, useState } from 'react';
import { CoinGeckoClient } from 'coingecko-api-v3';
import { XAxis, YAxis, Area, AreaChart, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { currencyKeyToCoinGeckoIndexMap } from 'constants/currency';
import styled from 'styled-components';
import { format } from 'date-fns';
import Toggle from './components/DateToggle/Toggle';

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
    const [data, setData] = useState<{ date: string; price: number }[]>();
    const [maxPrice, setMaxPrice] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [dateRange, setDateRange] = useState(14); // default date range

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
                const maxPrice = Math.max(...priceData.map((d) => d.price));
                const minPrice = Math.min(...priceData.map((d) => d.price));

                setData(priceData);
                setMaxPrice(Number(maxPrice.toFixed(2)));
                setMinPrice(Number(minPrice.toFixed(2)));
            } catch (e) {
                console.log('COINGECKO error: ', e);
            }
        };
        fetchData();
    }, [asset, dateRange]);

    return (
        <Wrapper>
            {data && (
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                        <XAxis
                            tick={{ fontSize: '12px', fontFamily: 'Roboto', fill: 'var(--color-white)' }}
                            tickLine={{ stroke: 'var(--color-white)' }}
                            axisLine={{ stroke: 'var(--color-white)' }}
                            dataKey="date"
                            interval={100}
                        />
                        <YAxis
                            domain={[parseInt((minPrice / 1.5).toFixed(0)), parseInt((1.2 * maxPrice).toFixed(0))]}
                            tick={{ fontSize: '12px', fontFamily: 'Roboto', fill: 'var(--color-white)' }}
                            tickLine={{ stroke: 'var(--color-white)' }}
                            axisLine={{ stroke: 'var(--color-white)' }}
                            tickCount={8}
                            orientation="right"
                            width={60}
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
                        {selectedPrice && (
                            <ReferenceLine
                                y={selectedPrice}
                                stroke="var(--color-highlight)"
                                strokeDasharray="3 3"
                                label={{
                                    value: `Strike price: $${selectedPrice}`,
                                    fill: 'var(--color-highlight)',
                                    fontFamily: 'Roboto',
                                    fontSize: '14px',
                                    position: 'insideRight',
                                    dy: -10,
                                }}
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

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    max-height: 300px;
`;

export default PriceChart;
