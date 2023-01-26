import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey } from 'constants/currency';
import { currencyKeyToCoinGeckoIndexMap } from 'constants/currency';

type RequestParams = {
    currencyKey: CurrencyKey;
    currencyVs?: string;
    days?: number;
};

interface PriceData {
    prices: Array<Array<number>>;
    market_caps: Array<Array<number>>;
    total_volumes: Array<Array<number>>;
}

const usePriceDataQuery = (requestArgs: RequestParams, options?: UseQueryOptions<PriceData>) => {
    const coinGeckoKey = currencyKeyToCoinGeckoIndexMap[requestArgs.currencyKey];

    return useQuery<PriceData>(
        QUERY_KEYS.PriceData.Currency(requestArgs.currencyKey),
        async () => {
            if (!coinGeckoKey) {
                return false;
            }

            const url = `https://api.coingecko.com/api/v3/coins/${coinGeckoKey}/market_chart?vs_currency=${
                requestArgs?.currencyVs ? requestArgs.currencyVs : 'usd'
            }&days=${requestArgs?.days ? requestArgs.days : '1'}&interval=hourly`;

            const response = await fetch(url);
            const result = JSON.parse(await response.text());

            return result;
        },
        {
            ...options,
        }
    );
};

export default usePriceDataQuery;
