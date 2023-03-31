import React, { useEffect, useState } from 'react';
import { CoinGeckoClient } from 'coingecko-api-v3';
import { XAxis, YAxis, Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { currencyKeyToCoinGeckoIndexMap } from 'constants/currency';
import styled from 'styled-components';
import { format } from 'date-fns';

type PriceChartProps = {
    asset: string;
};

const coinGeckoClient = new CoinGeckoClient({
    timeout: 10000,
    autoRetry: true,
});

const PriceChart: React.FC<PriceChartProps> = ({ asset }) => {
    const [data, setData] = useState<{ date: string; price: number }[]>();
    const [maxPrice, setMaxPrice] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await coinGeckoClient.coinIdMarketChart({
                    id: currencyKeyToCoinGeckoIndexMap[asset],
                    vs_currency: 'usd',
                    days: 30,
                });
                const priceData = result.prices.map((price) => ({
                    date: format(new Date(price[0]), 'MM/dd'),
                    price: Number(price[1].toFixed(0)),
                }));
                const maxPrice = Math.max(...priceData.map((d) => d.price));

                // Math.round(maxPrice / 10)

                setData(priceData);
                setMaxPrice(Number(maxPrice.toFixed(0)));
            } catch (e) {
                console.log('COINGECKO error: ', e);
            }
        };
        fetchData();
    }, [asset]);

    console.log('maxPrice: ', maxPrice);

    return (
        <Wrapper>
            {data && (
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <XAxis
                            tick={{ fontSize: '12px', fill: 'var(--color-white)' }}
                            tickLine={{ stroke: 'var(--color-white)' }}
                            axisLine={{ stroke: 'var(--color-white)' }}
                            dataKey="date"
                            interval={100}
                        />
                        <YAxis
                            domain={[0, maxPrice]}
                            tick={{ fontSize: '12px', fill: 'var(--color-white)' }}
                            tickLine={{ stroke: 'var(--color-white)' }}
                            axisLine={{ stroke: 'var(--color-white)' }}
                            tickCount={8}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="var(--color-white)"
                            fill="var(--color-tertiary)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    max-height: 300px;
`;

export default PriceChart;
