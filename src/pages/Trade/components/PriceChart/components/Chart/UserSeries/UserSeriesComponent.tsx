import { Positions } from 'enums/options';
import { ISeriesApi } from 'lightweight-charts';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import { useContext, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Colors } from 'styles/common';
import { ChartContext } from '../ChartContext';

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
