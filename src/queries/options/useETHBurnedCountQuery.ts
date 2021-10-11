import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ETHBurned } from 'types/options';

const useETHBurnedCountQuery = (options?: UseQueryOptions<ETHBurned>) => {
    return useQuery<ETHBurned>(
        QUERY_KEYS.BinaryOptions.EthBurnedCount(),
        async () => {
            try {
                const ethBurnedResponse = await fetch('https://ethburned.info/api/v1/burned', { mode: 'cors' });

                const ethBurnedJson = await ethBurnedResponse.json();
                const ethBurned: ETHBurned = {
                    total: ethBurnedJson.total,
                    totalUsd: ethBurnedJson.totalUSD,
                    yesterday: ethBurnedJson.yesterday,
                    yesterdayUsd: ethBurnedJson.yesterdayUSD,
                };

                return ethBurned;
            } catch (e) {
                console.log(e);
            }

            return {
                total: 0,
                totalUsd: 0,
                yesterday: 0,
                yesterdayUsd: 0,
            };
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useETHBurnedCountQuery;
