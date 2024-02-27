import { Positions } from 'enums/options';
import { ISeriesApi } from 'lightweight-charts';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Colors } from 'styles/common';
import { ChartContext } from '../ChartContext';
import { millisecondsToSeconds } from 'date-fns';
import { timeToLocal } from 'utils/formatters/date';

export const UserPositionAreaSeries: React.FC<{
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
    const [userData, setUserData] = useState<any>([]);

    const userActiveSpeedMarketsDataQuery = useUserActiveSpeedMarketsDataQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected && isSpeedMarkets,
        refetchInterval: 30 * 1000,
    });

    useEffect(() => {
        if (userActiveSpeedMarketsDataQuery.isSuccess && candlestickData && candlestickData.length) {
            const result: Array<{
                time: number;
                value?: number;
                position: any;
                hide: boolean;
            }> = [];

            userActiveSpeedMarketsDataQuery.data
                .filter((position) => {
                    return position.currencyKey === asset;
                })
                .map((position) => {
                    const lastCandleTime = candlestickData[candlestickData.length - 1].time;
                    const deltaTime = candlestickData[1].time - candlestickData[0].time;
                    // if user position is in the future we need to draw every tick o the x axis using candle delta time
                    if (millisecondsToSeconds(Number(position.maturityDate)) > lastCandleTime) {
                        let iterator = 1;

                        while (
                            lastCandleTime + iterator * deltaTime <
                            millisecondsToSeconds(Number(position.maturityDate))
                        ) {
                            // we are adding every tick on the x axis but are hiding the data from being drawn by setting hide: true
                            result.push({
                                time: lastCandleTime + iterator * deltaTime,
                                value: position.strikePriceNum,
                                position,
                                hide: true,
                            });
                            iterator++;
                        }
                        // finally we can push the position that should be drawn and are passing hide:false to tell the chart to draw marker for this position
                        result.push({
                            time: millisecondsToSeconds(Number(position.maturityDate)),
                            value: position.strikePriceNum,
                            position,
                            hide: false,
                        });
                    } else {
                        // if user position is in the past we need to find the right candle where we should paint the position
                        // Checking if the position is present on the chart
                        if (millisecondsToSeconds(Number(position.maturityDate)) >= candlestickData[0].time) {
                            let it = 0;
                            while (
                                it <= candlestickData.length &&
                                candlestickData[it].time < millisecondsToSeconds(Number(position.maturityDate))
                            ) {
                                it++;
                            }
                            // checking if we found the position to be drawn
                            if (it < candlestickData.length)
                                result.push({
                                    time: candlestickData[it - 1].time,
                                    value: position.strikePriceNum,
                                    position,
                                    hide: false,
                                });
                        }
                    }
                });
            setUserData(result.sort((a, b) => a.time - b.time));
        } else {
            setUserData([]);
        }

        // eslint-disable-next-line
    }, [userActiveSpeedMarketsDataQuery.data, asset]);

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
            const userDataWithLocalTime = userData.map((data: any) => {
                return {
                    ...data,
                    time: timeToLocal(data.time),
                };
            });
            series.setData(userDataWithLocalTime as any);

            const markers = userDataWithLocalTime
                .filter((value: any) => !value.hide)
                .map((value: any) => {
                    return {
                        time: value.time,
                        position: 'inBar',
                        size: 1,
                        color: value.position.side === Positions.UP ? Colors.GREEN : Colors.RED,
                        shape: 'circle',
                        text: value.position.side,
                    };
                });
            series?.setMarkers(markers as any);
        } else {
            series?.setMarkers([]);
            series?.setData([]);
        }
    }, [userData, series]);

    return <></>;
};
