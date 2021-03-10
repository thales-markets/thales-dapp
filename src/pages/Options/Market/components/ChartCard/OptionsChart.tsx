import React, { useMemo } from 'react';
import { LineChart, XAxis, YAxis, Line, Tooltip, ResponsiveContainer } from 'recharts';
import format from 'date-fns/format';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ExclamationIcon } from 'assets/images/exclamation.svg';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters';
import { PeriodLabel, PERIOD_IN_HOURS } from 'constants/period';
import { Loader } from 'semantic-ui-react';
import { OptionsMarketInfo } from 'types/options';
import useBinaryOptionsHistoricalOptionPrice from 'queries/options/useBinaryOptionsHistoricalOptionPrice';

type OptionsChartProps = {
    selectedPeriod: PeriodLabel;
    optionsMarket: OptionsMarketInfo;
};

const OptionsChart: React.FC<OptionsChartProps> = ({ selectedPeriod, optionsMarket }) => {
    const { t } = useTranslation();

    const historicalOptionPriceQuery = useBinaryOptionsHistoricalOptionPrice(
        optionsMarket.address,
        selectedPeriod.period
    );

    const chartData = useMemo(() => {
        const data = historicalOptionPriceQuery.data || [];
        if (data.length) {
            return [...data].reverse();
        }
        return [];
    }, [historicalOptionPriceQuery.data]);

    const isLoading = historicalOptionPriceQuery.isLoading;
    const noChartData = historicalOptionPriceQuery.isSuccess && chartData.length < 2;

    return (
        <div style={{ height: 300 }}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={noChartData ? [] : chartData}>
                            <XAxis
                                dataKey="timestamp"
                                //tick={fontStyleMedium}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val: any) => {
                                    if (!isNumber(val)) {
                                        return '';
                                    }
                                    const periodOverOneDay =
                                        selectedPeriod != null && selectedPeriod.value > PERIOD_IN_HOURS.ONE_DAY;

                                    return format(val, periodOverOneDay ? 'dd MMM' : 'h:mma');
                                }}
                            />
                            <YAxis
                                type="number"
                                domain={[0, 1]}
                                orientation="right"
                                //tick={fontStyleMedium}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val: any) => t('common.val-in-cents', { val })}
                            />
                            <Line
                                type="linear"
                                name={t('options.common.long-price')}
                                dataKey="longPrice"
                                stroke="#10BA97"
                                strokeWidth={1.5}
                                isAnimationActive={false}
                            />
                            <Line
                                type="linear"
                                name={t('options.common.short-price')}
                                dataKey="shortPrice"
                                stroke="#D94454"
                                strokeWidth={1.5}
                                isAnimationActive={false}
                            />
                            {!noChartData && (
                                <Tooltip
                                    // @ts-ignore
                                    cursor={{ strokeWidth: 1, stroke: '#9492C4' }}
                                    contentStyle={{
                                        border: 'none',
                                        borderRadius: '4px',
                                        backgroundColor: '#F3F3FE',
                                    }}
                                    itemStyle={{
                                        //...fontStyle,
                                        textTransform: 'capitalize',
                                    }}
                                    //labelStyle={fontStyle}
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
                    </ResponsiveContainer>
                    {isLoading && <Loader active />}
                    {noChartData && (
                        <div
                            style={{
                                justifyItems: 'center',
                                left: '50%',
                                top: '50%',
                                position: 'absolute',
                                display: 'grid',
                            }}
                        >
                            <ExclamationIcon />
                            {t('options.market.chart-card.no-chart-data')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OptionsChart;
