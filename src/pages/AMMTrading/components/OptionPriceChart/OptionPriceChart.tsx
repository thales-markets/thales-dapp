import { isNumber } from 'lodash';
import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, XAxis, Tooltip } from 'recharts';
import format from 'date-fns/format';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { MarketType } from 'types/options';
import { MARKET_TYPE } from 'constants/options';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';

type OptionPriceChartProps = {
    data:
        | Array<{ timestamp: number; firstPositionPrice: number | undefined; secondPositionPrice: number | undefined }>
        | [];
    marketType: MarketType;
};

const OptionPriceChart: React.FC<OptionPriceChartProps> = ({ data, marketType }) => {
    const theme: ThemeInterface = useTheme();

    return (
        <ResponsiveContainer width={'100%'} height={'100%'}>
            <LineChart data={data} margin={chartMargin}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <YAxis
                    domain={[0, 1]}
                    type={'number'}
                    tickLine={false}
                    axisLine={false}
                    orientation={'right'}
                    tick={{ fill: theme.textColor.primary }}
                />
                <XAxis
                    dataKey={'timestamp'}
                    dy={10}
                    tickFormatter={(val: any) => {
                        if (!isNumber(val)) {
                            return '';
                        }
                        return format(val, 'dd MMM');
                    }}
                    tick={{ fill: theme.textColor.primary }}
                    interval="preserveStartEnd"
                />
                {data && (
                    <Tooltip
                        // @ts-ignore
                        cursor={{ strokeWidth: 2, stroke: theme.textColor.primary }}
                        contentStyle={{ ...tooltipContentStyle, background: theme.background.secondary }}
                        itemStyle={tooltipItemStyle}
                        labelStyle={{ ...tooltipLabelStyle, color: theme.textColor.primary }}
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
                    strokeWidth={2}
                    stroke={marketType == MARKET_TYPE[0] ? theme.positionColor.down : theme.positionColor.out}
                    dot={{ strokeWidth: 3 }}
                />
                <Line
                    type="linear"
                    dataKey="firstPositionPrice"
                    strokeWidth={2}
                    name={marketType == MARKET_TYPE[0] ? 'UP' : 'IN'}
                    stroke={marketType == MARKET_TYPE[0] ? theme.positionColor.up : theme.positionColor.in}
                    dot={{ strokeWidth: 3 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

const chartMargin = { top: 10, bottom: 10, left: 10, right: -10 };

const tooltipContentStyle = {
    border: 'none',
    borderRadius: 10,
};

const tooltipItemStyle = {
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: 0.4,
};

const tooltipLabelStyle = {
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 1.8,
    letterSpacing: 1,
};

export default OptionPriceChart;
