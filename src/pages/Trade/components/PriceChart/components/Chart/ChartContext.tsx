import Button from 'components/Button';
import { ChartContext } from 'constants/chart';
import { Positions } from 'enums/options';
import { ColorType, IChartApi, createChart } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { AreaSeriesComponent } from './AreaSeries/AreaSerierComponent';
import { CandlestickComponent } from './CandlestickSeries/CandlestickComponent';

type ChartContextProps = {
    children: React.ReactNode;
    chart: IChartApi | null;
};

type ChartProps = {
    data: any;
    position: Positions | undefined;
    asset: string;
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
    selectedPrice,
    selectedRightPrice,
    selectedDate,
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
                barSpacing: 7.5,
            },
        });
        setChart(chart);
        return () => {
            chart.remove();
        };
    }, [theme]);

    useEffect(() => {
        chart?.timeScale().fitContent();
    }, [selectedPrice, chart]);

    return (
        <ChartContainer>
            <Chart ref={chartContainerRef}>
                {chart && (
                    <ChartProvider chart={chart}>
                        <CandlestickComponent data={data} asset={asset} />

                        <AreaSeriesComponent
                            asset={asset}
                            data={data}
                            position={position}
                            selectedPrice={selectedPrice}
                            selectedRightPrice={selectedRightPrice}
                            selectedDate={selectedDate}
                        />
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
