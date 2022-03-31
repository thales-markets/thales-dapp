import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { TokenInfo } from 'types/token';
import { TOTAL_SUPPLY } from 'constants/token';
import { NetworkId } from 'utils/network';

const useTokenInfoQuery = (networkId: NetworkId, options?: UseQueryOptions<TokenInfo | undefined>) => {
    return useQuery<TokenInfo | undefined>(
        QUERY_KEYS.Token.Info(networkId),
        async () => {
            try {
                const [price, circulatingSupply, marketCap] = await Promise.all([
                    await fetch('https://api.thales.market/token/price'),
                    await fetch('https://api.thales.market/token/circulatingsupply'),
                    await fetch('https://api.thales.market/token/marketcap'),
                ]);

                const tokenInfo: TokenInfo = {
                    price: Number(await price.text()),
                    circulatingSupply: Number(await circulatingSupply.text()),
                    marketCap: Number(await marketCap.text()),
                    totalSupply: TOTAL_SUPPLY,
                };

                return tokenInfo;
            } catch (e) {
                console.log(e);
            }

            return undefined;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useTokenInfoQuery;
