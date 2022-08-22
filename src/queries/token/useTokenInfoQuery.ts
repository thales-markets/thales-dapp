import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { TokenInfo } from 'types/token';
import { TOTAL_SUPPLY } from 'constants/token';
import { getIsOVM, Network, NetworkId } from 'utils/network';
import { ethers } from 'ethers';
import opThalesContract from 'utils/contracts/opThalesContract';
import { DEAD_ADDRESS } from 'constants/network';

const priceL2ThalesURL =
    'https://api.1inch.exchange/v3.0/10/quote?fromTokenAddress=0x217D47011b23BB961eB6D93cA9945B7501a5BB11&toTokenAddress=0x7f5c764cbc14f9669b88837ca1490cca17c31607&amount=100000000000000000000';

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
                let toAmount;

                if (getIsOVM(networkId)) {
                    const res = await fetch(priceL2ThalesURL);
                    const data = await res.json();
                    toAmount = Number(
                        Number(ethers.utils.formatUnits(data.toTokenAmount, data.toToken.decimals)) / 100
                    ).toFixed(4);
                }

                const infuraProvider = new ethers.providers.InfuraProvider(
                    Network.Mainnet,
                    process.env.REACT_APP_INFURA_PROJECT_ID
                );
                const thalesBurned = new ethers.Contract(
                    opThalesContract.addresses[Network.Mainnet],
                    opThalesContract.abi,
                    infuraProvider
                );
                const thalesBurnedBalance = await thalesBurned.balanceOf(DEAD_ADDRESS);

                const tokenInfo: TokenInfo = {
                    price: getIsOVM(networkId) ? Number(toAmount) : Number(await price.text()),
                    circulatingSupply: Number(await circulatingSupply.text()),
                    marketCap: Number(await marketCap.text()),
                    totalSupply: TOTAL_SUPPLY,
                    thalesBurned: Number(ethers.utils.formatEther(thalesBurnedBalance)),
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
