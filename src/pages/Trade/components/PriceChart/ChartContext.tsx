import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Colors } from 'styles/common';
import { ThemeInterface } from 'types/ui';

const ChartContext = createContext<IChartApi | null>(null);

type ChartContextProps = {
    children: React.ReactNode;
    chart: IChartApi | null;
};

type ChartProps = {
    data: any;
    areaData: any;
    position: Positions | undefined;
    asset: string;
    isSpeedMarkets: boolean;
    selectedPrice?: number;
};

const ChartProvider: React.FC<ChartContextProps> = ({ children, chart }) => (
    <ChartContext.Provider value={chart}>{children}</ChartContext.Provider>
);

export const ChartComponent: React.FC<ChartProps> = ({
    data,
    areaData,
    position,
    asset,
    isSpeedMarkets,
    selectedPrice,
}) => {
    const theme: ThemeInterface = useTheme();
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chart, setChart] = useState<IChartApi | undefined>();

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
                        {position && <AreaSeriesComponent data={areaData} position={position} />}
                    </ChartProvider>
                )}
            </Chart>
        </ChartContainer>
    );
};

const CandlestickComponent: React.FC<{ data: any; asset: string }> = ({ data, asset }) => {
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
        if (series && data) series.setData(data);
    }, [data, series]);

    useEffect(() => {
        series?.priceScale().applyOptions({
            autoScale: true,
        });
    }, [asset, series]);

    return <></>;
};

const AreaSeriesComponent: React.FC<{ data: any; position: Positions }> = ({ data, position }) => {
    const chart = useContext(ChartContext);
    const [series, setSeries] = useState<any>();

    useEffect(() => {
        if (series) {
            chart?.removeSeries(series);
        }
        if (position) {
            const series = chart?.addAreaSeries({
                crosshairMarkerVisible: false,
                lineColor: Colors.BLUE_MIDNIGHT_LIGHT,
                lineWidth: 1,
                topColor: position === Positions.UP ? Colors.GREEN_DARK_END : Colors.GREEN_DARK_START,
                bottomColor: position === Positions.UP ? Colors.GREEN_DARK_START : Colors.GREEN_DARK_END,
                invertFilledArea: position === Positions.UP,
            });
            setSeries(series);
        }
        // eslint-disable-next-line
    }, [position]);

    useEffect(() => {
        if (series && data) series.setData(data);
    }, [data, series]);

    return <></>;
};

const ChartContainer = styled.div`
    height: 284px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const Chart = styled.div``;
