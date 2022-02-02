import React, { CSSProperties, useMemo } from 'react';

import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';
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
    showFooter?: boolean;
    showPercentageChangeOnSide?: boolean;
    containerStyle?: CSSProperties;
    footerStyle?: CSSProperties;
};

const PriceChart: React.FC<PriceChartProps> = ({
    currencyKey,
    currencyVs,
    days,
    width,
    height,
    showHeading,
    showFooter,
    showPercentageChangeOnSide,
    containerStyle,
    footerStyle,
}) => {
    const { t } = useTranslation();

    const priceData = usePriceDataQuery({ currencyKey, currencyVs, days }, { refetchInterval: false });
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
                                // isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                    {showFooter !== false && showPercentageChangeOnSide !== true && (
                        <ChartFooter style={{ ...footerStyle }}>
                            <TimerangeChange style={{ ...footerStyle }}>
                                {formatPriceChangeInterval(days, t('common.user-info-card.change'))}
                            </TimerangeChange>
                            <PriceChange uptrend={percentagePriceChange > 0 ? true : false} style={{ ...footerStyle }}>
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

const ChartWrapper = styled.div<{ flexOrder?: boolean }>`
    width: 100%;
    ${(_props) => (_props?.flexOrder ? 'display: flex;' : '')};
    ${(_props) => (_props?.flexOrder ? 'flex-direction: row;' : '')};
    ${(_props) => (_props?.flexOrder ? 'align-items: center;' : '')};
    text-align: center;
    margin: 0px 0px 0px 0px;
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

const SidePercentageChange = styled.div<{ uptrend?: boolean }>`
    font-family: Titillium Regular !important;
    color: ${(props: any) => (props.uptrend ? '#50CE99' : '#C04119')};
    font-weight: bold;
    font-size: 15px;
    margin-left: 30px;
`;

export default PriceChart;
