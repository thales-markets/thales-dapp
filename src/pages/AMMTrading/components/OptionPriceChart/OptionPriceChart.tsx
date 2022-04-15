import { isNumber } from 'lodash';
import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, XAxis, Tooltip } from 'recharts';
import format from 'date-fns/format';
import { tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from './styles/Tooltip';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';

type OptionPriceChartProps = {
    data: Array<{ timestamp: number; upPrice: number | undefined; downPrice: number | undefined }> | [];
};

const OptionPriceChart: React.FC<OptionPriceChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width={'100%'} height={'100%'}>
            <LineChart data={data} margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <YAxis
                    domain={[0, 1]}
                    type={'number'}
                    tickLine={false}
                    axisLine={false}
                    orientation={'right'}
                    tick={{ fill: 'var(--primary-color)' }}
                />
                <XAxis
                    dataKey={'timestamp'}
                    dy={15}
                    tickFormatter={(val: any) => {
                        if (!isNumber(val)) {
                            return '';
                        }
                        return format(val, 'dd MMM');
                    }}
                    tick={{ fill: 'var(--primary-color)' }}
                />
                {data && (
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
                <Line type="linear" dataKey="downPrice" strokeWidth={3} stroke="#C3244A" dot={{ strokeWidth: 8 }} />
                <Line type="linear" dataKey="upPrice" strokeWidth={3} stroke="#50CE99" dot={{ strokeWidth: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default OptionPriceChart;
