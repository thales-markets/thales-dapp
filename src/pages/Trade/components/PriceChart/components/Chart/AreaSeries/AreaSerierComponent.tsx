import { Positions } from 'enums/options';
import { ISeriesApi } from 'lightweight-charts';
import { useContext, useState, useEffect } from 'react';
import { Colors } from 'styles/common';
import { ChartContext } from '../ChartContext';
import { millisecondsToSeconds } from 'date-fns';
import { timeToLocal } from 'utils/formatters/date';

export const AreaSeriesComponent: React.FC<{
    asset: string;
    data: any;
    position?: Positions;
    selectedPrice?: number;
    selectedDate?: number;
    isSpeedMarkets: boolean;
}> = ({ data, position, selectedPrice, isSpeedMarkets, selectedDate, asset }) => {
    const chart = useContext(ChartContext);
    const [series, setSeries] = useState<ISeriesApi<'Area'> | undefined>();
    const [dataSeries, setDataSeries] = useState<any>([]);

    useEffect(() => {
        if (series) {
            series.setMarkers([]);
            chart?.removeSeries(series);
            setSeries(undefined);
        }

        const localSeries = chart?.addAreaSeries({
            crosshairMarkerVisible: false,
            lineColor: Colors.BLUE_MIDNIGHT_LIGHT,
            lineWidth: 1,
            lastValueVisible: !isSpeedMarkets,
        });

        setSeries(localSeries);

        // eslint-disable-next-line
    }, []);

    // useEffect for calculating data for selected position.
    useEffect(() => {
        if (series && selectedPrice && selectedDate && position && data) {
            const startDate = data[0].time;
            const lineDataSelected = [
                {
                    time: startDate,
                    value: selectedPrice,
                },
            ];
            const deltaTime = data[1].time - data[0].time; // delta time between candles
            let iterator = 1;
            // we need to add every tick on the x axis between selected position and last candle
            while (startDate + iterator * deltaTime < millisecondsToSeconds(selectedDate)) {
                lineDataSelected.push({
                    time: startDate + iterator * deltaTime,
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
                time: millisecondsToSeconds(selectedDate),
                value: selectedPrice,
            });
            setDataSeries(lineDataSelected);
        } else {
            setDataSeries([]);
        }
        // eslint-disable-next-line
    }, [selectedPrice, selectedDate, position, data, asset]);

    useEffect(() => {
        if (series) {
            if (dataSeries.length) {
                series.setMarkers([]);
                const dataInLocalTime = dataSeries.map((data: any) => {
                    return {
                        ...data,
                        time: timeToLocal(data.time),
                    };
                });
                series.setData(dataInLocalTime);
                series?.setMarkers([
                    {
                        time: dataInLocalTime[dataSeries.length - 1].time,
                        position: 'inBar',
                        size: 1,
                        color: position === Positions.UP ? Colors.GREEN : Colors.RED,
                        shape: 'circle',
                    },
                ]);
                series.applyOptions({
                    topColor: position === Positions.UP ? Colors.GREEN_DARK_END : Colors.RED_START,
                    bottomColor: position === Positions.UP ? Colors.GREEN_DARK_START : Colors.RED_END,
                    invertFilledArea: position === Positions.UP,
                });
            } else {
                series.setData([]);
            }
        }
        // eslint-disable-next-line
    }, [series, dataSeries]);

    return <></>;
};
