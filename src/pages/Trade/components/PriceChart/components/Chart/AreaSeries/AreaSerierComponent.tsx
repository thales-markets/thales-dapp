import { Positions } from 'enums/options';
import { ISeriesApi } from 'lightweight-charts';
import { useContext, useState, useEffect } from 'react';
import { Colors } from 'styles/common';
import { ChartContext } from '../ChartContext';
import { millisecondsToSeconds } from 'date-fns';

export const AreaSeriesComponent: React.FC<{
    data: any;
    position?: Positions;
    selectedPrice?: number;
    selectedDate?: number;
    isSpeedMarkets: boolean;
}> = ({ data, position, selectedPrice, isSpeedMarkets, selectedDate }) => {
    const chart = useContext(ChartContext);
    const [series, setSeries] = useState<ISeriesApi<'Area'> | undefined>();
    const [dataSeries, setDataSeries] = useState<any>([]);

    useEffect(() => {
        if (series) {
            series.setMarkers([]);
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
    }, [position, isSpeedMarkets, selectedPrice, selectedDate]);

    // useEffect for calculating data for selected position.
    useEffect(() => {
        if (series && selectedPrice && selectedDate && position && data) {
            const lineDataSelected = data.map((datapoint: any) => ({
                time: datapoint.time,
                value: selectedPrice,
            }));
            const deltaTime = data[1].time - data[0].time; // delta time between candles
            const lastDate = lineDataSelected[lineDataSelected.length - 1].time; // time of last candle
            let iterator = 1;
            // we need to add every tick on the x axis between selected position and last candle
            while (lastDate + iterator * deltaTime < millisecondsToSeconds(selectedDate)) {
                lineDataSelected.push({
                    time: lastDate + iterator * deltaTime,
                    value: selectedPrice,
                });
                iterator++;
            }
            // Adding selected position that is being drawn to data
            // logically it should be done like this:
            // lineDataSelected.push({
            //     time: millisecondsToSeconds(selectedDate),
            //     value: selectedPrice,
            // });
            // but this is pushing the chart constantly to the left on position toggling
            // therefore we need to use the delta time that was used for candles to draw the selected position
            lineDataSelected.push({
                time: lineDataSelected[lineDataSelected.length - 1].time + deltaTime,
                value: selectedPrice,
            });
            setDataSeries(lineDataSelected);
        }
    }, [series, selectedPrice, selectedDate, position, data]);

    useEffect(() => {
        if (series) {
            if (dataSeries.length) {
                series.setMarkers([]);
                series.setData(dataSeries);
                series?.setMarkers([
                    {
                        time: dataSeries[dataSeries.length - 1].time,
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
    }, [series, dataSeries, position]);

    return <></>;
};
