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

const usePythCandlestickQuery = (asset: string, dateRange: number, options?: UseQueryOptions<CandlestickData[]>) => {
    return useQuery<CandlestickData[]>(
        QUERY_KEYS.Prices.CandlestickData(asset, dateRange),
        async () => {
            const now = new Date();

            now.setDate(now.getDate() - dateRange);
            const response = await fetch(
                `${
                    generalConfig.PYTH_BENCHMARKS_TRADINGVIEW_HISTORY
                }?symbol=Crypto.${asset}/USD&resolution=${calculateResolution(dateRange)}&from=${Math.floor(
                    Number(now) / 1000
                )}&to=${Math.floor(Number(Date.now()) / 1000)}`
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

const calculateResolution = (dateRange: number) => {
    // ['1', '2', '5', '15', '30', '60', '120', '240', '360', '720', 'D', '1D', 'W', '1W', 'M', '1M'] resolutions
    switch (dateRange) {
        case 1:
            return '30';
        case 7:
            return '240';
        case 14:
            return '360';
        case 30:
            return '720';
        case 182:
            return 'D';
        case 365:
            return '1W';
    }
};

export default usePythCandlestickQuery;
