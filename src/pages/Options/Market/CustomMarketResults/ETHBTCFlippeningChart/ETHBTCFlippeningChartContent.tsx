import React, { useMemo } from 'react';
import { LineChart, XAxis, YAxis, Line, Tooltip, ResponsiveContainer } from 'recharts';
import format from 'date-fns/format';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from 'utils/formatters/number';
import SimpleLoader from 'components/SimpleLoader';
import styled from 'styled-components';
import { GridDivCenteredRow } from 'theme/common';
import useETHBTCMarketCapRatioQuery from 'queries/options/useETHBTCMarketCapRatioQuery';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';

const ETHBTCFlippeningChartContent: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const ethBtcMarketCapRatioQuery = useETHBTCMarketCapRatioQuery({ enabled: isAppReady });

    const chartData = useMemo(
        () =>
            ethBtcMarketCapRatioQuery.data && ethBtcMarketCapRatioQuery.isSuccess ? ethBtcMarketCapRatioQuery.data : [],
        [ethBtcMarketCapRatioQuery.data, ethBtcMarketCapRatioQuery.isSuccess]
    );

    const isLoading = ethBtcMarketCapRatioQuery.isLoading;
    const noChartData = ethBtcMarketCapRatioQuery.isSuccess && chartData.length < 1;

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
                                    return format(val, 'MMM yy');
                                }}
                            />
                            <YAxis
                                type="number"
                                domain={[0, 1]}
                                orientation="right"
                                tick={yAxisFontStyle}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val: any) => t(`${val}`)}
                            />
                            <Line
                                type="linear"
                                name={t('options.common.ratio')}
                                dataKey="ratio"
                                stroke={'#01b977'}
                                strokeWidth={1.5}
                                isAnimationActive={false}
                                dot={false}
                            />
                            {!noChartData && (
                                <Tooltip
                                    // @ts-ignore
                                    cursor={{ strokeWidth: 2, stroke: '#F6F6FE' }}
                                    contentStyle={tooltipContentStyle}
                                    itemStyle={tooltipItemStyle}
                                    labelStyle={tooltipLabelStyle}
                                    formatter={(val: string | number) => formatCurrency(val)}
                                    labelFormatter={(label: any) => {
                                        if (!isNumber(label)) {
                                            return '';
                                        }
                                        return format(label, 'do MMM yy');
                                    }}
                                />
                            )}
                        </LineChart>
                    </ChartResponsiveContainer>
                    {isLoading && (
                        <LoaderContainer>
                            <SimpleLoader />
                        </LoaderContainer>
                    )}
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
    @media (max-width: 512px) {
        padding-left: 10px;
        height: 240px;
    }
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
    left: 45%;
    top: 45%;
    transform: translate(-50%, -50%);
`;

const LoaderContainer = styled(GridDivCenteredRow)`
    grid-gap: 10px;
    position: absolute;
    left: 45%;
    top: 45%;
    transform: translate(-50%, -50%);
`;

export default ETHBTCFlippeningChartContent;
