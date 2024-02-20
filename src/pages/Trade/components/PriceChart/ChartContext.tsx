import Button from 'components/Button';
import { Positions } from 'enums/options';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
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
                        <AreaSeriesComponent
                            data={areaData}
                            isSpeedMarkets={isSpeedMarkets}
                            position={position}
                            selectedPrice={selectedPrice}
                        />
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

const AreaSeriesComponent: React.FC<{
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
        if (series && data) {
            series.setData(data);

            if (isSpeedMarkets) {
                series?.setMarkers([
                    {
                        time: data[data.length - 1].time,
                        position: position === Positions.UP ? 'aboveBar' : 'belowBar',
                        size: 2,
                        color: position === Positions.UP ? Colors.GREEN : Colors.RED,
                        shape: position === Positions.UP ? 'arrowUp' : 'arrowDown',
                    },
                ]);
            }
        }
    }, [data, series, isSpeedMarkets, position]);

    return <></>;
};

const UserPositionAreaSeries: React.FC<{
    isSpeedMarkets: boolean;
    asset: string;
    candlestickData: any;
}> = ({ isSpeedMarkets, asset, candlestickData }) => {
    const chart = useContext(ChartContext);
    const [series, setSeries] = useState<ISeriesApi<'Area'> | undefined>();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const userActiveSpeedMarketsDataQuery = useUserActiveSpeedMarketsDataQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected && isSpeedMarkets,
    });

    const userData = useMemo(() => {
        if (userActiveSpeedMarketsDataQuery.isSuccess) {
            const result: Array<{
                time: number;
                value?: number;
                position: any;
                hide: boolean;
            }> = [];
            let iterator = 1;
            userActiveSpeedMarketsDataQuery.data
                .filter((position) => {
                    return position.currencyKey === asset;
                })
                .map((position) => {
                    if (Math.floor(position.maturityDate / 1000) > candlestickData[candlestickData.length - 1].time) {
                        const deltaTime = candlestickData[1].time - candlestickData[0].time;
                        while (
                            candlestickData[candlestickData.length - 1].time + iterator * deltaTime <
                            Math.floor(position.maturityDate / 1000)
                        ) {
                            result.push({
                                time: candlestickData[candlestickData.length - 1].time + iterator * deltaTime,
                                value: position.strikePriceNum,
                                position,
                                hide: true,
                            });
                            iterator++;
                        }
                        result.push({
                            time: Math.floor(position.maturityDate / 1000),
                            value: position.strikePriceNum,
                            position,
                            hide: false,
                        });
                    } else {
                        let it = 1;
                        while (
                            candlestickData[candlestickData.length - it].time > Math.floor(position.maturityDate / 1000)
                        ) {
                            it++;
                        }
                        result.push({
                            time: candlestickData[candlestickData.length - it + 1].time,
                            value: position.strikePriceNum,
                            position,
                            hide: false,
                        });
                    }
                });
            return result;
        }
        return [];
    }, [userActiveSpeedMarketsDataQuery, asset, candlestickData]);

    useEffect(() => {
        if (series) {
            chart?.removeSeries(series);
            setSeries(undefined);
        }

        const localSeries = chart?.addAreaSeries({
            crosshairMarkerVisible: false,
            lineVisible: false,
            priceLineVisible: false,
            pointMarkersVisible: false,
            topColor: 'transparent',
            bottomColor: 'transparent',
            lastValueVisible: false,
        });

        setSeries(localSeries);

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (series && userData.length > 0) {
            series.setData(userData as any);
            const markers = userData
                .filter((value: any) => !value.hide)
                .map((value: any) => {
                    return {
                        time: Math.floor(value.position.maturityDate / 1000),
                        position: 'inBar',
                        size: 0.1,
                        color: value.position.side === Positions.UP ? Colors.GREEN : Colors.RED,
                        shape: 'circle',
                        text: value.position.side === Positions.UP ? `UP` : `DOWN`,
                    };
                });
            series?.setMarkers(markers as any);
        }
    }, [userData, series, candlestickData]);

    return <></>;
};

const ChartContainer = styled.div`
    height: 284px;
    position: 'relative';
`;

const ResetButton = styled.div`
    position: 'absolute';
    right: 0;
    bottom: 0;
    i {
        font-size: 16px;
    }
`;

const Chart = styled.div``;
