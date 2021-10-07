import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Flippening } from 'types/options';

const useFlippeningQuery = (options?: UseQueryOptions<Flippening>) => {
    return useQuery<Flippening>(
        QUERY_KEYS.BinaryOptions.MarketFlippening(),
        async () => {
            try {
                const flippeningResponse = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_market_cap=true'
                );

                const flippeningJson = await flippeningResponse.json();
                const flippening: Flippening = {
                    ethPrice: flippeningJson.ethereum.usd,
                    ethMarketCap: flippeningJson.ethereum.usd_market_cap,
                    btcPrice: flippeningJson.bitcoin.usd,
                    btcMarketCap: flippeningJson.bitcoin.usd_market_cap,
                    ratio: flippeningJson.ethereum.usd_market_cap / flippeningJson.bitcoin.usd_market_cap,
                };

                return flippening;
            } catch (e) {
                console.log(e);
            }

            return {
                ethPrice: 0,
                ethMarketCap: 0,
                btcPrice: 0,
                btcMarketCap: 0,
                ratio: 0,
            };
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useFlippeningQuery;
