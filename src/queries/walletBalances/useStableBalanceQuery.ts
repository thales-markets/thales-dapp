import snxJSConnector from 'utils/snxJSConnector';

import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import { getStableCoinForNetwork } from 'utils/currency';
import { STABLE_DECIMALS } from 'constants/options';
import { StableCoins } from 'types/options';

const useStableBalanceQuery = (walletAddress: string, networkId: NetworkId, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.WalletBalances.Balance(walletAddress ?? '', networkId),
        async () => {
            try {
                const collateral = snxJSConnector.collateral;
                const collateralKey = getStableCoinForNetwork(networkId);

                let usdBalance = await collateral?.balanceOf(walletAddress);
                usdBalance = usdBalance
                    ? parseInt(usdBalance) / 10 ** STABLE_DECIMALS[collateralKey as StableCoins]
                        ? STABLE_DECIMALS[collateralKey as StableCoins]
                        : 18
                    : 0;

                return {
                    [collateralKey]: {
                        balance: usdBalance,
                    },
                };
            } catch (e) {
                console.log('e ', e);
                return null;
            }
        },
        options
    );
};

export default useStableBalanceQuery;
