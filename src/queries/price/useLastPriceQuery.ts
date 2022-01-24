import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';

type RequestParams = {
    coins: Array<string>;
};

type PriceData = {
    [key: string]: {
        usd: number;
        usd_24h_change: number;
    };
};

const useLastPriceQuery = (requestArgs: RequestParams, options?: UseQueryOptions<PriceData>) => {
    return useQuery<PriceData>(
        QUERY_KEYS.PriceData.Data,
        async () => {
            try {
                const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
                    requestArgs.coins.join(',')
                )}vs_currency=usd&include_24hr_change=true`;

                const response = await fetch(url);
                const result = JSON.parse(await response.text());

                return result;
            } catch (error) {
                console.log('Error useLastPriceQuery ', error);
                return;
            }
        },
        {
            ...options,
        }
    );
};

export default useLastPriceQuery;
