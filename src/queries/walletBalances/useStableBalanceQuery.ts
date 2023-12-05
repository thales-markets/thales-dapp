import snxJSConnector from 'utils/snxJSConnector';

import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { Coins, COLLATERAL_DECIMALS } from 'thales-utils';
import { getDefaultCollateral } from 'utils/currency';

const useStableBalanceQuery = (walletAddress: string, networkId: Network, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.WalletBalances.StableCoinBalance(walletAddress ?? '', networkId),
        async () => {
            try {
                const collateral = snxJSConnector.collateral;
                const collateralKey = getDefaultCollateral(networkId);

                let usdBalance = await collateral?.balanceOf(walletAddress);
                usdBalance = usdBalance
                    ? parseInt(usdBalance) /
                      10 **
                          (COLLATERAL_DECIMALS[collateralKey as Coins]
                              ? COLLATERAL_DECIMALS[collateralKey as Coins]
                              : 18)
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
