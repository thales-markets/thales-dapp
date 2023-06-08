import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import usePriceDataQuery from 'queries/price/usePriceDataQuery';
import React, { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import {
    calculatePercentageChange,
    formatCurrencyWithSign,
    formatPricePercentageGrowth,
} from 'utils/formatters/number';
import { formatPriceChangeInterval } from 'utils/formatters/string';

type PriceChartProps = {
    currencyKey: string;
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
    const theme: ThemeInterface = useTheme();

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
                                    <stop offset="62%" stopColor={theme.textColor.quaternary} stopOpacity={0.5} />
                                    <stop offset="99.68%" stopColor={theme.textColor.secondary} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPriceBear" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="70%" stopColor={theme.textColor.tertiary} stopOpacity={0.5} />
                                    <stop offset="99.68%" stopColor={theme.textColor.secondary} stopOpacity={0} />
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
                                stroke={
                                    percentagePriceChange > 0 ? theme.textColor.quaternary : theme.textColor.tertiary
                                }
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
    const theme: ThemeInterface = useTheme();

    return (
        <g transform={`translate(${x - 20},${y})`}>
            <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="white" fillOpacity="0.6" />
            </svg>

            <text style={{ fontSize: 12, fontWeight: 700 }} x={-2} y={10} dy={12} fill={theme.textColor.primary}>
                {payload.value}
            </text>
        </g>
    );
};

const ChartWrapper = styled.div<{ flexOrder?: boolean }>`
    width: 100%;
    ${(props) => (props?.flexOrder ? 'display: flex;' : '')};
    ${(props) => (props?.flexOrder ? 'flex-direction: row;' : '')};
    ${(props) => (props?.flexOrder ? 'align-items: center;' : '')};
    text-align: center;
    margin: 0px 0px 0px 0px;
`;

const ChartHeader = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 10px;
    text-align: left;
`;

const CoinName = styled.p`
    line-height: 15px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
`;

const Price = styled.p`
    font-weight: bold;
    font-size: 15px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    margin-left: 5px;
`;

const ChartFooter = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const FooterInfo = styled.p`
    font-weight: normal;
    font-size: 15px;
    line-height: 102.6%;
    margin-top: 5px;
`;

const TimerangeChange = styled(FooterInfo)<{ fontSize?: string }>`
    color: ${(props) => props.theme.textColor.primary};
    text-align: left;
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '')};
`;

const PriceChange = styled(FooterInfo)<{ uptrend?: boolean; fontSize?: string }>`
    color: ${(props: any) => (props.uptrend ? props.theme.textColor.quaternary : props.theme.textColor.tertiary)};
    font-weight: bold;
    text-align: right;
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '')};
`;

const SidePercentageChange = styled.div<{ uptrend?: boolean }>`
    color: ${(props: any) => (props.uptrend ? props.theme.textColor.quaternary : props.theme.textColor.tertiary)};
    font-weight: bold;
    font-size: 15px;
    margin-left: 30px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-left: 5px;
    }
`;

export default PriceChart;
