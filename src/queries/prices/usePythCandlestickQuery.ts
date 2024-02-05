import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { UseQueryOptions, useQuery } from 'react-query';

type CandlestickData = {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
};

const usePythCandlestickQuery = (
    asset: string,
    dateRange: number,
    resolution: string,
    options?: UseQueryOptions<CandlestickData[]>
) => {
    return useQuery<CandlestickData[]>(
        QUERY_KEYS.Prices.PythCandlestickData(asset, dateRange, resolution),
        async () => {
            const now = new Date();
            now.setDate(now.getDate() - dateRange);
            const response = await fetch(
                `${generalConfig.PYTH_BENCHMARKS_TRADINGVIEW_HISTORY}?symbol=${getAssetSymbol(
                    asset
                )}/USD&resolution=${resolution}&from=${Math.floor(Number(now) / 1000)}&to=${Math.floor(
                    Number(Date.now()) / 1000
                )}`
            );
            const pythCandlestickData = await response.json();

            const candleStickData = pythCandlestickData.t.map((time: number, index: number) => {
                return {
                    open: pythCandlestickData.o[index],
                    high: pythCandlestickData.h[index],
                    low: pythCandlestickData.l[index],
                    close: pythCandlestickData.c[index],
                    time: time,
                };
            });

            return candleStickData;
        },
        options
    );
};

const getAssetSymbol = (asset: string) => {
    if (asset === 'XAU') {
        return 'Crypto.XAUT';
    }
    if (asset === 'XAG') {
        return 'Metal.XAG';
    }

    return `Crypto.${asset}`;
};

export default usePythCandlestickQuery;
