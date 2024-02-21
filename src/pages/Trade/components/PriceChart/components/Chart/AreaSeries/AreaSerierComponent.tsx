import { Positions } from 'enums/options';
import { ISeriesApi } from 'lightweight-charts';
import { useContext, useState, useEffect } from 'react';
import { Colors } from 'styles/common';
import { ChartContext } from '../ChartContext';

export const AreaSeriesComponent: React.FC<{
    data: any;
    position?: Positions;
    selectedPrice?: number;
    isSpeedMarkets: boolean;
}> = ({ data, position, selectedPrice, isSpeedMarkets }) => {
    const chart = useContext(ChartContext);
    const [series, setSeries] = useState<ISeriesApi<'Area'> | undefined>();

    useEffect(() => {
        if (series) {
            chart?.removeSeries(series);
            setSeries(undefined);
        }
        if (position && selectedPrice) {
            const series = chart?.addAreaSeries({
                crosshairMarkerVisible: false,
                lineColor: Colors.BLUE_MIDNIGHT_LIGHT,
                lineWidth: 1,
                topColor: position === Positions.UP ? Colors.GREEN_DARK_END : Colors.RED_START,
                bottomColor: position === Positions.UP ? Colors.GREEN_DARK_START : Colors.RED_END,
                invertFilledArea: position === Positions.UP,
                lastValueVisible: !isSpeedMarkets,
            });

            setSeries(series);
        }
        // eslint-disable-next-line
    }, [position, isSpeedMarkets, selectedPrice]);

    useEffect(() => {
        if (series) {
            if (position) {
                series.setData(data);

                series?.setMarkers([
                    {
                        time: data[data.length - 1].time,
                        position: 'inBar',
                        size: 1,
                        color: position === Positions.UP ? Colors.GREEN : Colors.RED,
                        shape: 'circle',
                    },
                ]);
            } else {
                series.setData([]);
            }
        }
    }, [data, series, isSpeedMarkets, position]);

    return <></>;
};
