import { generalConfig } from 'config/general';
import { DEAD_ADDRESS, SAFE_BOX_ADDRESS } from 'constants/network';
import QUERY_KEYS from 'constants/queryKeys';
import { TOTAL_SUPPLY } from 'constants/token';
import { Network } from 'enums/network';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import { TokenInfo } from 'types/token';
import thalesContract from 'utils/contracts/thalesContract';
import { NetworkId } from 'utils/network';

const useTokenInfoQuery = (networkId: NetworkId, options?: UseQueryOptions<TokenInfo | undefined>) => {
    return useQuery<TokenInfo | undefined>(
        QUERY_KEYS.Token.Info(networkId),
        async () => {
            try {
                const [price, circulatingSupply, marketCap] = await Promise.all([
                    await fetch(`${generalConfig.API_URL}/token/price`),
                    await fetch(`${generalConfig.API_URL}/token/circulatingsupply`),
                    await fetch(`${generalConfig.API_URL}/token/marketcap`),
                ]);

                const infuraProvider = new ethers.providers.InfuraProvider(
                    Network.Mainnet,
                    process.env.REACT_APP_INFURA_PROJECT_ID
                );
                const mainThalesBurned = new ethers.Contract(
                    thalesContract.addresses[Network.Mainnet],
                    thalesContract.abi,
                    infuraProvider
                );
                const mainThalesBurnedBalance = await mainThalesBurned.balanceOf(DEAD_ADDRESS);

                const opInfuraProvider = new ethers.providers.InfuraProvider(
                    Network['Mainnet-Ovm'],
                    process.env.REACT_APP_INFURA_PROJECT_ID
                );
                const opThalesBurned = new ethers.Contract(
                    thalesContract.addresses[Network['Mainnet-Ovm']],
                    thalesContract.abi,
                    opInfuraProvider
                );
                const opThalesBurnedBalance = await opThalesBurned.balanceOf(SAFE_BOX_ADDRESS);

                const totalThalesBurned =
                    Number(ethers.utils.formatEther(mainThalesBurnedBalance)) +
                    Number(ethers.utils.formatEther(opThalesBurnedBalance));

                const tokenInfo: TokenInfo = {
                    price: Number(await price.text()),
                    circulatingSupply: Number(await circulatingSupply.text()),
                    marketCap: Number(await marketCap.text()),
                    totalSupply: TOTAL_SUPPLY,
                    thalesBurned: totalThalesBurned,
                };

                return tokenInfo;
            } catch (e) {
                console.log(e);
            }

            return undefined;
        },
        {
            ...options,
        }
    );
};

export default useTokenInfoQuery;
