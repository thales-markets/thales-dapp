import React from 'react';

import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';
import { formatPricePercentageGrowth, calculatePercentageChange } from 'utils/formatters/number';

import usePriceDataQuery from 'queries/price/usePriceDataQuery';
import styled from 'styled-components';

import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatPriceChangeInterval } from 'utils/formatters/string';

import { useTranslation } from 'react-i18next';

type PriceChartProps = {
    coin: string;
    currencyVs?: string;
    days?: number;
    width?: number;
    height?: number;
    showHeading?: boolean;
};

const PriceChart: React.FC<PriceChartProps> = ({ coin, currencyVs, days, width, height, showHeading }) => {
    const { t } = useTranslation();

    const priceData = usePriceDataQuery({ coin, currencyVs, days }, { enabled: true });

    const processedPriceData: Array<{ name: number; price: number }> | null =
        priceData.isSuccess && priceData.data
            ? priceData?.data?.prices.map((item: Array<number>) => {
                  return {
                      name: Number(item[0]),
                      price: Number(item[1]),
                  };
              })
            : null;

    const percentagePriceChange = processedPriceData
        ? calculatePercentageChange(
              processedPriceData[processedPriceData.length - 1].price,
              processedPriceData[0].price
          )
        : 0;

    const lastPrice = processedPriceData ? processedPriceData[0].price : 0;

    return (
        <ChartWrapper>
            {processedPriceData && showHeading && (
                <ChartHeader>
                    <CoinName>{coin + ' price:'}</CoinName>
                    <Price>{formatCurrencyWithSign(USD_SIGN, lastPrice)}</Price>
                </ChartHeader>
            )}
            {percentagePriceChange && processedPriceData && (
                <>
                    <ResponsiveContainer height={height ? height : 50}>
                        <AreaChart
                            data={processedPriceData ? processedPriceData : []}
                            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                            width={width ? width : undefined}
                            height={height ? height : undefined}
                        >
                            <defs>
                                <linearGradient id="colorPriceBull" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="62%" stopColor="#50CE99" stopOpacity={0.5} />
                                    <stop offset="99.68%" stopColor="#C4C4C4" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPriceBear" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="70%" stopColor="#c04119" stopOpacity={0.5} />
                                    <stop offset="99.68%" stopColor="#C4C4C4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <YAxis hide={true} domain={['dataMin', 'dataMax']} />
                            <Area
                                type="monotone"
                                dataKey="price"
                                strokeWidth={1.5}
                                stroke={`${percentagePriceChange > 0 ? '#50CE99' : '#C04119'}`}
                                fill={`url(#${percentagePriceChange > 0 ? 'colorPriceBull' : 'colorPriceBear'})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                    <ChartFooter>
                        <TimerangeChange>
                            {formatPriceChangeInterval(days, t('common.user-info-card.change'))}
                        </TimerangeChange>
                        <PriceChange uptrend={percentagePriceChange > 0 ? true : false}>
                            {formatPricePercentageGrowth(percentagePriceChange)}
                        </PriceChange>
                    </ChartFooter>
                </>
            )}
        </ChartWrapper>
    );
};

const ChartWrapper = styled.div`
    width: 100%;
    text-align: center;
    margin: 18px 0px 18px 0px;
`;

const ChartHeader = styled.div`
    font-family: Titillium Regular !important;
    width: 100%;
    margin-bottom: 10px;
    text-align: left;
`;

const CoinName = styled.p`
    line-height: 15px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: #64d9fe;
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
`;

const Price = styled.p`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: var(--icon-color);
`;

const ChartFooter = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const FooterInfo = styled.p`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 102.6%;
    margin-top: 5px;
`;

const TimerangeChange = styled(FooterInfo)`
    color: var(--icon-color);
    text-align: left;
`;

const PriceChange = styled(FooterInfo)<{ uptrend?: boolean }>`
    color: ${(props: any) => (props.uptrend ? '#50CE99' : '#C04119')};
    font-weight: bold;
    text-align: right;
`;

export default PriceChart;
