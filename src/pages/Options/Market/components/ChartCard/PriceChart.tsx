import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, Label, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import isNumber from 'lodash/isNumber';
import get from 'lodash/get';
import { USD_SIGN } from 'constants/currency';
import { ReactComponent as ExclamationIcon } from 'assets/images/exclamation.svg';
import { formatCurrencyWithSign } from 'utils/formatters';
import { PeriodLabel, PERIOD_IN_HOURS } from 'constants/period';
import { Loader } from 'semantic-ui-react';
import { OptionsMarketInfo } from 'types/options';
import useHistoricalRatesQuery from 'queries/rates/useHistoricalRatesQuery';

type PriceChartProps = {
    selectedPeriod: PeriodLabel;
    optionsMarket: OptionsMarketInfo;
};

const PriceChart: React.FC<PriceChartProps> = ({ selectedPeriod, optionsMarket }) => {
    const { t } = useTranslation();

    const historicalRatesQuery = useHistoricalRatesQuery(optionsMarket.currencyKey, selectedPeriod.period);

    const chartData = get(historicalRatesQuery, 'data.rates', []);
    const isLoading = historicalRatesQuery.isLoading;
    const noChartData = historicalRatesQuery.isSuccess && chartData.length === 0;

    const chartColor = '#A08AFF';
    const linearGradientId = 'optionsMarketPriceChartArea';

    const minPriceDomain = optionsMarket.strikePrice * 0.95;
    const maxPriceDomain = optionsMarket.strikePrice * 1.05;

    return (
        <div style={{ height: 300 }}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id={linearGradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.5} />
                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
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
                                domain={[
                                    (d: number) => Math.min(d, minPriceDomain),
                                    (d: number) => Math.max(d, maxPriceDomain),
                                ]}
                                //tick={fontStyleMedium}
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                width={80}
                                tickFormatter={(val: any) => formatCurrencyWithSign(USD_SIGN, val)}
                            />
                            <Area
                                dataKey="rate"
                                stroke={chartColor}
                                fillOpacity={0.5}
                                fill={`url(#${linearGradientId})`}
                                isAnimationActive={false}
                            />
                            {!noChartData && (
                                <ReferenceLine y={optionsMarket.strikePrice} stroke="#6F6E98" strokeDasharray="5 2">
                                    <Label position="insideBottomRight">
                                        {formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)}
                                    </Label>
                                </ReferenceLine>
                            )}
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
                        </AreaChart>
                    </ResponsiveContainer>
                    {isLoading && <Loader active />}
                    {noChartData && (
                        <div>
                            <ExclamationIcon />
                            {t('options.market.chart-card.no-chart-data')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PriceChart;
