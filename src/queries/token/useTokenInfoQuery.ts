import { generalConfig } from 'config/general';
import { ARB_SAFE_BOX_ADDRESS, BASE_SAFE_BOX_ADDRESS, DEAD_ADDRESS, OP_SAFE_BOX_ADDRESS } from 'constants/network';
import QUERY_KEYS from 'constants/queryKeys';
import { TOTAL_SUPPLY } from 'constants/token';
import { Network } from 'enums/network';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import { TokenInfo } from 'types/token';
import thalesContract from 'utils/contracts/thalesContract';
import snxJSConnector from 'utils/snxJSConnector';

const useTokenInfoQuery = (networkId: Network, options?: UseQueryOptions<TokenInfo | undefined>) => {
    return useQuery<TokenInfo | undefined>(
        QUERY_KEYS.Token.Info(networkId),
        async () => {
            try {
                const [price, circulatingSupply, marketCap] = await Promise.all([
                    await fetch(`${generalConfig.API_URL}/token/price`),
                    await fetch(`${generalConfig.API_URL}/token/circulatingsupply`),
                    await fetch(`${generalConfig.API_URL}/token/marketcap`),
                ]);

                // Thales burned - Mainnet
                const infuraProvider = new ethers.providers.InfuraProvider(
                    Network.Mainnet,
                    process.env.REACT_APP_INFURA_PROJECT_ID
                );
                const mainThalesBurned = new ethers.Contract(
                    thalesContract.addresses[Network.Mainnet],
                    thalesContract.abi,
                    infuraProvider
                );

                // Thales burned - Optimism
                const opInfuraProvider = new ethers.providers.InfuraProvider(
                    Network.OptimismMainnet,
                    process.env.REACT_APP_INFURA_PROJECT_ID
                );
                const opThalesBurned = new ethers.Contract(
                    thalesContract.addresses[Network.OptimismMainnet],
                    thalesContract.abi,
                    opInfuraProvider
                );

                // Thales burned - Arbitrum
                const arbInfuraProvider = new ethers.providers.InfuraProvider(
                    Network.Arbitrum,
                    process.env.REACT_APP_INFURA_PROJECT_ID
                );
                const arbThalesBurned = new ethers.Contract(
                    thalesContract.addresses[Network.Arbitrum],
                    thalesContract.abi,
                    arbInfuraProvider
                );

                // Thales burned - Base
                const baseProviderUrl = snxJSConnector.provider?.chains?.filter((chain) => chain.id === Network.Base)[0]
                    .rpcUrls.default.http[0];
                const baseInfuraProvider = new ethers.providers.JsonRpcProvider(baseProviderUrl, Network.Base);
                const baseThalesBurned = new ethers.Contract(
                    thalesContract.addresses[Network.Base],
                    thalesContract.abi,
                    baseInfuraProvider
                );

                const [
                    mainThalesBurnedBalance,
                    opThalesBurnedBalance,
                    arbThalesBurnedBalance,
                    baseThalesBurnedBalance,
                ] = await Promise.all([
                    mainThalesBurned.balanceOf(DEAD_ADDRESS),
                    opThalesBurned.balanceOf(OP_SAFE_BOX_ADDRESS),
                    arbThalesBurned.balanceOf(ARB_SAFE_BOX_ADDRESS),
                    baseThalesBurned.balanceOf(BASE_SAFE_BOX_ADDRESS),
                ]);

                const totalThalesBurned =
                    Number(ethers.utils.formatEther(mainThalesBurnedBalance)) +
                    Number(ethers.utils.formatEther(opThalesBurnedBalance)) +
                    Number(ethers.utils.formatEther(arbThalesBurnedBalance)) +
                    Number(ethers.utils.formatEther(baseThalesBurnedBalance));

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
