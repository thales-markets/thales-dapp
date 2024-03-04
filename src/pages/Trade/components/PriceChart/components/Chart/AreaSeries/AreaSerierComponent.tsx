import { ChartContext } from 'constants/chart';
import { millisecondsToSeconds } from 'date-fns';
import { Positions } from 'enums/options';
import { ISeriesApi } from 'lightweight-charts';
import { useContext, useEffect, useState } from 'react';
import { Colors } from 'styles/common';
import { timeToLocal } from 'utils/formatters/date';

export const AreaSeriesComponent: React.FC<{
    asset: string;
    data: any;
    position?: Positions;
    selectedPrice?: number;
    selectedRightPrice?: number;
    selectedDate?: number;
    isSpeedMarkets: boolean;
}> = ({ data, position, selectedPrice, isSpeedMarkets, selectedDate, asset, selectedRightPrice }) => {
    const chart = useContext(ChartContext);
    const [series, setSeries] = useState<ISeriesApi<'Area'> | undefined>();
    const [rangeSeries, setRangeSeries] = useState<ISeriesApi<'Area'> | undefined>();
    const [dataSeries, setDataSeries] = useState<any>([]);
    const [rangeDataSeries, setRangeDataSeries] = useState<any>([]);

    useEffect(() => {
        if (series) {
            series.setMarkers([]);
            chart?.removeSeries(series);
            setSeries(undefined);
        }

        if (rangeSeries) {
            rangeSeries.setMarkers([]);
            chart?.removeSeries(rangeSeries);
            setRangeSeries(undefined);
        }

        const localSeries = chart?.addAreaSeries({
            crosshairMarkerVisible: false,
            lineColor: Colors.BLUE_MIDNIGHT_LIGHT,
            lineWidth: 1,
            lastValueVisible: !isSpeedMarkets,
        });
        const localRangeSeries = chart?.addAreaSeries({
            crosshairMarkerVisible: false,
            lineColor: Colors.BLUE_MIDNIGHT_LIGHT,
            lineWidth: 1,
            lastValueVisible: !isSpeedMarkets,
        });

        setSeries(localSeries);
        setRangeSeries(localRangeSeries);

        // eslint-disable-next-line
    }, []);

    // useEffect for calculating data for selected position.
    useEffect(() => {
        if (selectedPrice && selectedDate && position && data) {
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
            if (selectedRightPrice) {
                const rangeSeriesLocal = lineDataSelected.map((singleData: any) => {
                    return {
                        ...singleData,
                        value: selectedRightPrice,
                    };
                });
                setRangeDataSeries(rangeSeriesLocal);
            } else {
                setRangeDataSeries([]);
            }
        } else {
            setDataSeries([]);
            setRangeDataSeries([]);
        }
    }, [selectedPrice, selectedDate, position, data, asset, selectedRightPrice]);

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
                        color: position === Positions.DOWN ? Colors.RED : Colors.GREEN,
                        shape: 'circle',
                    },
                ]);
                if (position === Positions.UP || position === Positions.DOWN) {
                    series.applyOptions({
                        topColor: position === Positions.UP ? Colors.GREEN_DARK_END : Colors.RED_START,
                        bottomColor: position === Positions.UP ? Colors.GREEN_DARK_START : Colors.RED_END,
                        invertFilledArea: position === Positions.UP,
                    });
                } else {
                    series.applyOptions({
                        topColor: position === Positions.OUT ? Colors.GREEN_DARK_START : Colors.GREEN_IN_END,
                        bottomColor: position === Positions.OUT ? Colors.GREEN_DARK_END : Colors.GREEN_IN_START,
                        invertFilledArea: position === Positions.IN,
                    });
                }
            } else {
                series.setData([]);
            }
        }
        if (rangeSeries) {
            if (rangeDataSeries.length) {
                rangeSeries.setMarkers([]);
                const dataInLocalTime = rangeDataSeries.map((data: any) => {
                    return {
                        ...data,
                        time: timeToLocal(data.time),
                    };
                });
                rangeSeries.setData(dataInLocalTime);
                rangeSeries?.setMarkers([
                    {
                        time: dataInLocalTime[dataInLocalTime.length - 1].time,
                        position: 'inBar',
                        size: 0.1,
                        color: Colors.GREEN,
                        shape: 'circle',
                    },
                ]);
                rangeSeries.applyOptions({
                    topColor: position === Positions.OUT ? Colors.GREEN_DARK_END : Colors.GREEN_IN_START,
                    bottomColor: position === Positions.OUT ? Colors.GREEN_DARK_START : Colors.GREEN_IN_END,
                    invertFilledArea: position === Positions.OUT,
                });
            } else {
                rangeSeries.setData([]);
            }
        }
        // eslint-disable-next-line
    }, [series, dataSeries, rangeSeries]);

    return <></>;
};
