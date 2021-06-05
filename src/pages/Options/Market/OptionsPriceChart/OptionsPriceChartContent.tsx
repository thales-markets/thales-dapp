import React, { useMemo } from 'react';
import { LineChart, XAxis, YAxis, Line, Tooltip, ResponsiveContainer } from 'recharts';
import format from 'date-fns/format';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { Loader } from 'semantic-ui-react';
import { OptionsMarketInfo, OptionsTransactions } from 'types/options';
import styled from 'styled-components';
import { GridDivCenteredRow } from 'theme/common';
import useBinaryOptionsTradesQuery from 'queries/options/useBinaryOptionsTradesQuery';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { orderBy, maxBy } from 'lodash';

type OptionsPriceChartContentProps = {
    optionsMarket: OptionsMarketInfo;
};

const OptionsPriceChartContent: React.FC<OptionsPriceChartContentProps> = ({ optionsMarket }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const tradesQuery = useBinaryOptionsTradesQuery(
        optionsMarket.address,
        optionsMarket.longAddress,
        optionsMarket.shortAddress,
        networkId,
        { enabled: isAppReady }
    );

    const getLastPrice = (data: OptionsTransactions, side: string, timestamp: number) => {
        const lastTrade = maxBy(
            data.filter((trade) => trade.timestamp < timestamp && trade.side === side),
            'timestamp'
        );
        return lastTrade ? lastTrade.price : 0;
    };

    const chartData = useMemo(() => {
        const data = orderBy(
            tradesQuery.data
                ? tradesQuery.data.map((trade) => ({
                      ...trade,
                      longPrice:
                          trade.side === 'long' ? trade.price : getLastPrice(tradesQuery.data, 'long', trade.timestamp),
                      shortPrice:
                          trade.side === 'short'
                              ? trade.price
                              : getLastPrice(tradesQuery.data, 'short', trade.timestamp),
                  }))
                : [],
            'timestamp',
            'desc'
        );
        if (data.length) {
            return [...data].reverse();
        }
        return [];
    }, [tradesQuery.data]);

    const isLoading = tradesQuery.isLoading;
    const noChartData = tradesQuery.isSuccess && chartData.length < 1;

    console.log(chartData);
    return (
        <Container>
            <InnerContainerRelative>
                <InnerContainerAbsolute>
                    <ChartResponsiveContainer>
                        <LineChart data={noChartData ? [] : chartData}>
                            <XAxis
                                dataKey="timestamp"
                                tick={xAxisFontStyle}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val: any) => {
                                    if (!isNumber(val)) {
                                        return '';
                                    }
                                    return format(val, 'dd MMM');
                                }}
                            />
                            <YAxis
                                type="number"
                                domain={[0, 1]}
                                orientation="right"
                                tick={yAxisFontStyle}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val: any) => t(`$${val}`)}
                            />
                            <Line
                                type="linear"
                                name={t('options.common.long-price')}
                                dataKey="longPrice"
                                stroke="#4FBF67"
                                strokeWidth={1.5}
                                isAnimationActive={false}
                            />
                            <Line
                                type="linear"
                                name={t('options.common.short-price')}
                                dataKey="shortPrice"
                                stroke="#FF7A68"
                                strokeWidth={1.5}
                                isAnimationActive={false}
                            />
                            {!noChartData && (
                                <Tooltip
                                    // @ts-ignore
                                    cursor={{ strokeWidth: 2, stroke: '#F6F6FE' }}
                                    contentStyle={tooltipContentStyle}
                                    itemStyle={tooltipItemStyle}
                                    labelStyle={tooltipLabelStyle}
                                    formatter={(val: string | number) => formatCurrencyWithSign(USD_SIGN, val)}
                                    labelFormatter={(label: any) => {
                                        if (!isNumber(label)) {
                                            return '';
                                        }
                                        return format(label, 'do MMM yy | HH:mm');
                                    }}
                                />
                            )}
                        </LineChart>
                    </ChartResponsiveContainer>
                    {isLoading && <Loader active />}
                    {noChartData && (
                        <NoCharDataContainer>{t('options.market.chart-card.no-chart-data')}</NoCharDataContainer>
                    )}
                </InnerContainerAbsolute>
            </InnerContainerRelative>
        </Container>
    );
};

const Container = styled.div`
    height: 300px;
    padding-left: 30px;
`;

const InnerContainerRelative = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const InnerContainerAbsolute = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
`;

const ChartResponsiveContainer = styled(ResponsiveContainer)`
    width: 100%;
    height: 100%;
`;

const xAxisFontStyle = {
    fontWeight: 'bold',
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1,
    fill: '#F6F6FE',
};

const yAxisFontStyle = {
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 24,
    letterSpacing: 0.4,
    fill: '#F6F6FE',
};

const tooltipContentStyle = {
    background: '#F6F6FE',
    border: '1px solid #44E1E2',
    borderRadius: 10,
};

const tooltipItemStyle = {
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: 0.4,
    fill: '#04045A',
};

const tooltipLabelStyle = {
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 1.8,
    letterSpacing: 1,
    color: '#04045A',
};

const NoCharDataContainer = styled(GridDivCenteredRow)`
    grid-gap: 10px;
    color: #f6f6fe;
    padding: 20px;
    justify-items: center;
    font-weight: 600;
    font-size: 25px;
    line-height: 48px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export default OptionsPriceChartContent;
