import { ChartContext } from 'constants/chart';
import { ISeriesApi } from 'lightweight-charts';
import { useContext, useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { Colors } from 'styles/common';
import { ThemeInterface } from 'types/ui';
import { timeToLocal } from 'utils/formatters/date';

export const CandlestickComponent: React.FC<{ data: any; asset: string }> = ({ data, asset }) => {
    const theme: ThemeInterface = useTheme();
    const chart = useContext(ChartContext);
    const [series, setSeries] = useState<ISeriesApi<'Candlestick'> | undefined>();

    useEffect(() => {
        const series = chart?.addCandlestickSeries({
            upColor: Colors.GREEN,
            downColor: Colors.RED,
            wickVisible: true,
            wickUpColor: Colors.GREEN,
            wickDownColor: Colors.RED,
            priceLineColor: theme.borderColor.tertiary,
            priceLineWidth: 1,
            lastValueVisible: true,
        });
        setSeries(series);
    }, [theme, chart]);

    useEffect(() => {
        if (series && data) {
            const dataWithLocalTime = data.map((point: any) => {
                return {
                    ...point,
                    time: timeToLocal(point.time),
                };
            });
            series.setData(dataWithLocalTime);
        }
    }, [data, series]);

    useEffect(() => {
        series?.priceScale().applyOptions({
            autoScale: true,
        });
    }, [asset, series]);

    return <></>;
};
