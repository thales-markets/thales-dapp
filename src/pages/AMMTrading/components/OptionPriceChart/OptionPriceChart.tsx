import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid } from 'recharts';

const OptionPriceChart: React.FC = () => {
    const data = [
        {
            short: 0.2,
            long: 0.4,
        },
        {
            short: 0.3,
            long: 0.6,
        },
        {
            short: 0.9,
            long: 1,
        },
        {
            short: 0.1,
            long: 0.7,
        },
        {
            short: 0.2,
            long: 0,
        },
        {
            short: 0.5,
            long: 0.5,
        },
        {
            short: 0.2,
            long: 0.4,
        },
        {
            short: 1,
            long: 0.8,
        },
    ];

    return (
        <ResponsiveContainer width={'100%'} height={'100%'}>
            <LineChart data={data} margin={{ top: 10, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <YAxis type={'number'} tickLine={false} axisLine={false} orientation={'right'} />
                <Line type="linear" dataKey="short" strokeWidth={5} stroke="#C3244A" dot={{ strokeWidth: 13 }} />
                <Line type="linear" dataKey="long" strokeWidth={5} stroke="#50CE99" dot={{ strokeWidth: 13 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default OptionPriceChart;
