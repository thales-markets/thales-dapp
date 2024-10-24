import snxJSConnector from 'utils/snxJSConnector';

import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import { Coins, COLLATERAL_DECIMALS } from 'thales-utils';
import { SupportedNetwork } from 'types/network';
import { getDefaultCollateral } from 'utils/currency';
import { getContractForInteraction } from '../../utils/options';

const useStableBalanceQuery = (
    walletAddress: string,
    networkId: SupportedNetwork,
    isDeprecatedCurrency: boolean,
    options?: UseQueryOptions<any>
) => {
    return useQuery<any>(
        QUERY_KEYS.WalletBalances.StableCoinBalance(walletAddress ?? '', networkId, isDeprecatedCurrency),
        async () => {
            try {
                const { collateral, collateralUSDC } = snxJSConnector;
                const collateralContractForInteraction = getContractForInteraction(
                    networkId,
                    isDeprecatedCurrency,
                    collateral,
                    collateralUSDC
                );
                const collateralKey = getDefaultCollateral(networkId, isDeprecatedCurrency);

                let usdBalance = await collateralContractForInteraction?.balanceOf(walletAddress);
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
