import Button from 'components/Button';
import { Positions } from 'enums/options';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import React, { createContext, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { CandlestickComponent } from './CandlestickSeries/CandlestickComponent';
import { AreaSeriesComponent } from './AreaSeries/AreaSerierComponent';
import { UserPositionAreaSeries } from './UserSeries/UserSeriesComponent';
import { millisecondsToSeconds } from 'date-fns';

export const ChartContext = createContext<IChartApi | null>(null);

type ChartContextProps = {
    children: React.ReactNode;
    chart: IChartApi | null;
};

type ChartProps = {
    data: any;
    position: Positions | undefined;
    asset: string;
    isSpeedMarkets: boolean;
    selectedPrice?: number;
    selectedDate?: number;
};

const ChartProvider: React.FC<ChartContextProps> = ({ children, chart }) => (
    <ChartContext.Provider value={chart}>{children}</ChartContext.Provider>
);

export const ChartComponent: React.FC<ChartProps> = ({
    data,
    position,
    asset,
    isSpeedMarkets,
    selectedPrice,
    selectedDate,
}) => {
    const theme: ThemeInterface = useTheme();
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chart, setChart] = useState<IChartApi | undefined>();
    const [areaData, setAreaData] = useState();

    // useEffect for calculating data for selected position.
    useEffect(() => {
        if (selectedPrice && selectedDate && position && data) {
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
            setAreaData(lineDataSelected);
        }
    }, [selectedPrice, selectedDate, position, data]);

    useEffect(() => {
        const chart = createChart(chartContainerRef.current ?? '', {
            layout: {
                background: { type: ColorType.Solid, color: theme.background.primary },
                textColor: theme.textColor.secondary,
            },
            height: 285,
            grid: {
                vertLines: {
                    visible: true,
                    color: theme.borderColor.primary,
                },
                horzLines: {
                    visible: true,
                    color: theme.borderColor.primary,
                },
            },
            timeScale: {
                rightOffset: 1,
                timeVisible: true,
                fixLeftEdge: true,
                barSpacing: 15,
            },
        });
        setChart(chart);
        return () => {
            chart.remove();
        };
    }, [theme]);

    useEffect(() => {
        if (!isSpeedMarkets) chart?.timeScale().fitContent();
    }, [isSpeedMarkets, selectedPrice, chart]);

    return (
        <ChartContainer>
            <Chart ref={chartContainerRef}>
                {chart && (
                    <ChartProvider chart={chart}>
                        <CandlestickComponent data={data} asset={asset} />
                        {areaData && (
                            <AreaSeriesComponent
                                data={areaData}
                                isSpeedMarkets={isSpeedMarkets}
                                position={position}
                                selectedPrice={selectedPrice}
                            />
                        )}
                        {isSpeedMarkets && (
                            <UserPositionAreaSeries
                                candlestickData={data}
                                asset={asset}
                                isSpeedMarkets={isSpeedMarkets}
                            />
                        )}
                    </ChartProvider>
                )}
            </Chart>
            <ResetButton>
                <Button
                    width="35px"
                    height="31px"
                    textColor={theme.button.textColor.tertiary}
                    backgroundColor={theme.button.background.secondary}
                    borderColor={theme.button.borderColor.tertiary}
                    fontSize="13px"
                    padding="0"
                    additionalStyles={{
                        borderRadius: '8px',
                        transition: 'all 0.2s ease-in-out',
                        textTransform: 'none',
                    }}
                    onClick={() => {
                        chart?.timeScale().resetTimeScale();
                        chart?.applyOptions({
                            rightPriceScale: {
                                autoScale: true,
                            },
                        });
                    }}
                >
                    <i className="icon icon--reload" />
                </Button>
            </ResetButton>
        </ChartContainer>
    );
};

const ChartContainer = styled.div`
    height: 284px;
    position: relative;
`;

const ResetButton = styled.div`
    position: absolute;
    width: 35px;
    left: 0;
    bottom: -31px;
    i {
        font-size: 16px;
    }
`;

const Chart = styled.div``;
