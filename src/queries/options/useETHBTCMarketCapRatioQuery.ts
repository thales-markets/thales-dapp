import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ETHBTCRatios } from 'types/options';

const useETHBTCMarketCapRatioQuery = (options?: UseQueryOptions<ETHBTCRatios>) => {
    return useQuery<ETHBTCRatios>(
        QUERY_KEYS.BinaryOptions.ETHBTCMarketCapRatioHistory(),
        async () => {
            try {
                const [ethMCResponse, btcMCResponse] = await Promise.all([
                    fetch('https://arcane-earth-23673.herokuapp.com/history_eth.json'),
                    fetch('https://arcane-earth-23673.herokuapp.com/history_btc.json'),
                ]);

                const ethMC = await ethMCResponse.json();
                const btcMC = await btcMCResponse.json();

                const ethBtcMcRatio: ETHBTCRatios = [];
                ethMC.forEach((item: any, idx: number) => {
                    const date = item.date.split(' ')[0];
                    ethBtcMcRatio.push({
                        timestamp: new Date(date).getTime(),
                        ratio: Number(item.value) / Number(btcMC[idx].value),
                    });
                });

                return ethBtcMcRatio;
            } catch (e) {
                console.log(e);
            }

            return [];
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useETHBTCMarketCapRatioQuery;
