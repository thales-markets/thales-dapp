import { CoinGeckoClient } from 'coingecko-api-v3';
import { currencyKeyToCoinGeckoIndexMap } from 'constants/currency';
import QUERY_KEYS from 'constants/queryKeys';
import { UseQueryOptions, useQuery } from 'react-query';

type CandlestickData = {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
};

const coinGeckoClientPrivate = new CoinGeckoClient(
    {
        timeout: 10000,
        autoRetry: true,
    },
    process.env.REACT_APP_COINGECKO_API_KEY
);

const useCoingeckoCandlestickQuery = (
    asset: string,
    dateRange: number,
    options?: UseQueryOptions<CandlestickData[]>
) => {
    return useQuery<CandlestickData[]>(
        QUERY_KEYS.Prices.CandlestickData(asset, dateRange),
        async () => {
            const ohlc = await coinGeckoClientPrivate.coinIdOHLC({
                id: currencyKeyToCoinGeckoIndexMap[asset],
                vs_currency: 'usd',
                days: dateRange,
            });

            const candleStickData = ohlc.map((ohlcData: any) => {
                return {
                    open: ohlcData[1],
                    high: ohlcData[2],
                    low: ohlcData[3],
                    close: ohlcData[4],
                    time: ohlcData[0] / 1000,
                };
            });

            return candleStickData;
        },
        options
    );
};

export default useCoingeckoCandlestickQuery;
