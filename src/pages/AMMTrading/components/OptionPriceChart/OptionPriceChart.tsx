import { isNumber } from 'lodash';
import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, XAxis, Tooltip } from 'recharts';
import format from 'date-fns/format';
import { tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from './styles/Tooltip';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { MarketType } from 'types/options';
import { MARKET_TYPE } from 'constants/options';
import { UI_COLORS } from 'constants/ui';

type OptionPriceChartProps = {
    data:
        | Array<{ timestamp: number; firstPositionPrice: number | undefined; secondPositionPrice: number | undefined }>
        | [];
    marketType: MarketType;
};

const OptionPriceChart: React.FC<OptionPriceChartProps> = ({ data, marketType }) => {
    return (
        <ResponsiveContainer width={'100%'} height={'100%'}>
            <LineChart data={data} margin={{ top: 10, bottom: 10, left: 10, right: -10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <YAxis
                    domain={[0, 1]}
                    type={'number'}
                    tickLine={false}
                    axisLine={false}
                    orientation={'right'}
                    tick={{ fill: 'var(--color-white)' }}
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
                    tick={{ fill: 'var(--color-white)' }}
                    interval="preserveStartEnd"
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
                            return format(label, 'do MMM yyyy');
                        }}
                    />
                )}
                <Line
                    type="linear"
                    dataKey="secondPositionPrice"
                    name={marketType == MARKET_TYPE[0] ? 'DOWN' : 'OUT'}
                    strokeWidth={3}
                    stroke={marketType == MARKET_TYPE[0] ? UI_COLORS.RED : UI_COLORS.OUT_COLOR}
                    dot={{ strokeWidth: 8 }}
                />
                <Line
                    type="linear"
                    dataKey="firstPositionPrice"
                    strokeWidth={3}
                    name={marketType == MARKET_TYPE[0] ? 'UP' : 'IN'}
                    stroke={marketType == MARKET_TYPE[0] ? UI_COLORS.GREEN : UI_COLORS.IN_COLOR}
                    dot={{ strokeWidth: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default OptionPriceChart;
