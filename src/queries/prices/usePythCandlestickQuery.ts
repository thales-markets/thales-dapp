import { generalConfig } from 'config/general';
import { COMMODITY_MAP } from 'constants/currency';
import QUERY_KEYS from 'constants/queryKeys';
import { millisecondsToSeconds } from 'date-fns';
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
    dateFrom: number,
    dateTo: number,
    resolution: string,
    options?: UseQueryOptions<CandlestickData[]>
) => {
    return useQuery<CandlestickData[]>(
        QUERY_KEYS.Prices.PythCandlestickData(asset, dateFrom, resolution),
        async () => {
            let candleStickData = [];

            try {
                const response = await fetch(
                    `${generalConfig.PYTH_BENCHMARKS_TRADINGVIEW_HISTORY}?symbol=${getAssetSymbol(
                        asset
                    )}/USD&resolution=${resolution}&from=${millisecondsToSeconds(dateFrom)}&to=${millisecondsToSeconds(
                        dateTo
                    )}`
                );
                const pythCandlestickData = await response.json();

                candleStickData = pythCandlestickData.t.map((time: number, index: number) => {
                    return {
                        open: pythCandlestickData.o[index],
                        high: pythCandlestickData.h[index],
                        low: pythCandlestickData.l[index],
                        close: pythCandlestickData.c[index],
                        time: time,
                    };
                });
            } catch (e) {
                console.log(e);
            }

            return candleStickData;
        },
        options
    );
};

const getAssetSymbol = (asset: string) => {
    if (asset === COMMODITY_MAP.XAU) {
        return 'Crypto.XAUT';
    }
    if (asset === COMMODITY_MAP.XAG) {
        return 'Metal.XAG';
    }

    return `Crypto.${asset}`;
};

export default usePythCandlestickQuery;
