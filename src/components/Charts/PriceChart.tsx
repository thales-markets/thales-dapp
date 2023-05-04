import React, { CSSProperties, useMemo } from 'react';

import { ResponsiveContainer, AreaChart, Area, YAxis, XAxis, Tooltip } from 'recharts';
import { formatPricePercentageGrowth, calculatePercentageChange } from 'utils/formatters/number';

import usePriceDataQuery from 'queries/price/usePriceDataQuery';
import styled from 'styled-components';

import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatPriceChangeInterval } from 'utils/formatters/string';
import { CurrencyKey } from 'constants/currency';

import { useTranslation } from 'react-i18next';

type PriceChartProps = {
    currencyKey: CurrencyKey;
    currencyVs?: string;
    days?: number;
    width?: number;
    height?: number;
    showHeading?: boolean;
    showTooltip?: boolean;
    showFooter?: boolean;
    showPercentageChangeOnSide?: boolean;
    containerStyle?: CSSProperties;
    footerStyle?: CSSProperties;
    footerFontSize?: string;
    isAnimationActive?: boolean;
};

const PriceChart: React.FC<PriceChartProps> = ({
    currencyKey,
    currencyVs,
    days,
    width,
    height,
    showHeading,
    showFooter,
    showTooltip,
    showPercentageChangeOnSide,
    containerStyle,
    footerStyle,
    footerFontSize,
    isAnimationActive,
}) => {
    const { t } = useTranslation();

    const priceData = usePriceDataQuery({ currencyKey, currencyVs, days });
    const processedPriceData = useMemo(() => {
        let data: any = [];

        if (priceData.isSuccess && priceData.data && priceData?.data?.prices) {
            data = priceData?.data?.prices.map((item: Array<number>) => {
                return {
                    name: Number(item[0]),
                    price: Number(item[1]),
                };
            });
        }

        return data;
    }, [priceData]);

    const percentagePriceChange = useMemo(() => {
        if (processedPriceData?.length) {
            return calculatePercentageChange(
                processedPriceData[processedPriceData.length - 1].price,
                processedPriceData[0].price
            );
        }
        return 0;
    }, [processedPriceData]);

    const lastPrice = useMemo(() => {
        if (processedPriceData?.length) {
            return processedPriceData[processedPriceData?.length - 1]?.price;
        }
        return 0;
    }, [processedPriceData]);

    return (
        <>
            {processedPriceData?.length > 0 && (
                <ChartWrapper flexOrder={showPercentageChangeOnSide} style={{ ...containerStyle }}>
                    {processedPriceData && showHeading && (
                        <ChartHeader>
                            <CoinName>{currencyKey + ' price:'}</CoinName>
                            <Price>{formatCurrencyWithSign(USD_SIGN, lastPrice)}</Price>
                        </ChartHeader>
                    )}
                    <ResponsiveContainer height={height ? height : 50} width={width ? width : undefined}>
                        <AreaChart
                            data={processedPriceData ? processedPriceData : []}
                            margin={{ top: 10, left: 0, right: 0, bottom: 0 }}
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
                            {showTooltip && (
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    labelStyle={{ display: 'none' }}
                                    contentStyle={{
                                        backgroundColor: 'transparent !important',
                                        color: 'white',
                                        border: 'none',
                                    }}
                                    itemStyle={{
                                        fontFamily: 'Roboto !imporant',
                                        fontSize: '20px',
                                        fontWeight: 600,
                                        color: 'white',
                                    }}
                                />
                            )}
                            {showTooltip && <XAxis tick={<CustomizedAxisTick />} tickLine={false} axisLine={false} />}

                            <Area
                                type="monotone"
                                dataKey="price"
                                strokeWidth={1.5}
                                stroke={`${percentagePriceChange > 0 ? '#50CE99' : '#C04119'}`}
                                fill={`url(#${percentagePriceChange > 0 ? 'colorPriceBull' : 'colorPriceBear'})`}
                                isAnimationActive={isAnimationActive}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                    {showFooter !== false && showPercentageChangeOnSide !== true && (
                        <ChartFooter style={{ ...footerStyle }}>
                            <TimerangeChange style={{ ...footerStyle }} fontSize={footerFontSize}>
                                {formatPriceChangeInterval(days, t('common.user-info-card.change'))}
                            </TimerangeChange>
                            <PriceChange
                                uptrend={percentagePriceChange > 0 ? true : false}
                                style={{ ...footerStyle }}
                                fontSize={footerFontSize}
                            >
                                {formatPricePercentageGrowth(percentagePriceChange)}
                            </PriceChange>
                        </ChartFooter>
                    )}
                    {showPercentageChangeOnSide == true && (
                        <SidePercentageChange uptrend={percentagePriceChange > 0 ? true : false}>
                            {formatPricePercentageGrowth(percentagePriceChange)}
                        </SidePercentageChange>
                    )}
                </ChartWrapper>
            )}
        </>
    );
};

const CustomizedAxisTick: React.FC<any> = (props: any) => {
    const { x, y, payload } = props;

    return (
        <g transform={`translate(${x - 20},${y})`}>
            <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="white" fillOpacity="0.6" />
            </svg>

            <text style={{ fontSize: 12, fontWeight: 700 }} x={-2} y={10} dy={12} fill="var(--color-white)">
                {payload.value}
            </text>
        </g>
    );
};

const ChartWrapper = styled.div<{ flexOrder?: boolean }>`
    width: 100%;
    ${(_props) => (_props?.flexOrder ? 'display: flex;' : '')};
    ${(_props) => (_props?.flexOrder ? 'flex-direction: row;' : '')};
    ${(_props) => (_props?.flexOrder ? 'align-items: center;' : '')};
    text-align: center;
    margin: 0px 0px 0px 0px;
`;

const ChartHeader = styled.div`
    font-family: Roboto !important;
    width: 100%;
    margin-bottom: 10px;
    text-align: left;
`;

const CoinName = styled.p`
    line-height: 15px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: var(--color-highlight);
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
`;

const Price = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: var(--color-white);
`;

const ChartFooter = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const FooterInfo = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 102.6%;
    margin-top: 5px;
`;

const TimerangeChange = styled(FooterInfo)<{ fontSize?: string }>`
    color: var(--color-white);
    text-align: left;
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '')};
`;

const PriceChange = styled(FooterInfo)<{ uptrend?: boolean; fontSize?: string }>`
    color: ${(props: any) => (props.uptrend ? '#50CE99' : '#C04119')};
    font-weight: bold;
    text-align: right;
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '')};
`;

const SidePercentageChange = styled.div<{ uptrend?: boolean }>`
    font-family: Roboto !important;
    color: ${(props: any) => (props.uptrend ? '#50CE99' : '#C04119')};
    font-weight: bold;
    font-size: 15px;
    margin-left: 30px;
    @media (max-width: 768px) {
        margin-left: 5px;
    }
`;

export default PriceChart;
