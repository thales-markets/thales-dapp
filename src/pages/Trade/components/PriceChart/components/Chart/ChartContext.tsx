import Button from 'components/Button';
import { ChartContext } from 'constants/chart';
import { Positions } from 'enums/options';
import { ColorType, IChartApi, createChart } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { AreaSeriesComponent } from './AreaSeries/AreaSerierComponent';
import { CandlestickComponent } from './CandlestickSeries/CandlestickComponent';
import { UserPositionAreaSeries } from './UserSeries/UserSeriesComponent';

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
    selectedRightPrice?: number;
    selectedDate?: number;
    resolution?: string;
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
    selectedRightPrice,
    selectedDate,
    resolution,
}) => {
    const theme: ThemeInterface = useTheme();
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chart, setChart] = useState<IChartApi | undefined>();
    const [displayPositions, setDisplayPositions] = useState(false);

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
                barSpacing: 7.5,
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

    useEffect(() => {
        setDisplayPositions(Number(resolution) === 1 && isSpeedMarkets);
    }, [resolution, isSpeedMarkets]);

    return (
        <ChartContainer>
            <Chart ref={chartContainerRef}>
                {chart && (
                    <ChartProvider chart={chart}>
                        <CandlestickComponent data={data} asset={asset} />

                        <AreaSeriesComponent
                            asset={asset}
                            data={data}
                            isSpeedMarkets={isSpeedMarkets}
                            position={position}
                            selectedPrice={selectedPrice}
                            selectedRightPrice={selectedRightPrice}
                            selectedDate={selectedDate}
                        />

                        {displayPositions && (
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
