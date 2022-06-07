import snxJSConnector from 'utils/snxJSConnector';

import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import { COLLATERALS_INDEX, STABLE_DECIMALS } from 'constants/options';

const useMultipleCollateralBalanceQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<any>
) => {
    return useQuery<any>(
        QUERY_KEYS.WalletBalances.MultipleCollateral(walletAddress ?? '', networkId),
        async () => {
            try {
                const multipleCollateral = snxJSConnector.multipleCollateral;

                const sUSDBalance = multipleCollateral?.length
                    ? await multipleCollateral[COLLATERALS_INDEX.sUSD]?.balanceOf(walletAddress)
                    : undefined;

                const DAIBalance = multipleCollateral?.length
                    ? await multipleCollateral[COLLATERALS_INDEX.DAI]?.balanceOf(walletAddress)
                    : undefined;

                const USDCBalance = multipleCollateral?.length
                    ? await multipleCollateral[COLLATERALS_INDEX.USDC]?.balanceOf(walletAddress)
                    : undefined;

                const USDTBalance = multipleCollateral?.length
                    ? await multipleCollateral[COLLATERALS_INDEX.USDT]?.balanceOf(walletAddress)
                    : undefined;

                return {
                    sUSDBalance: sUSDBalance ? parseInt(sUSDBalance) / 10 ** STABLE_DECIMALS.sUSD : 0,
                    DAIBalance: DAIBalance ? parseInt(DAIBalance) / 10 ** STABLE_DECIMALS.DAI : 0,
                    USDCBalance: USDCBalance ? parseInt(USDCBalance) / 10 ** STABLE_DECIMALS.USDC : 0,
                    USDTBalance: USDTBalance ? parseInt(USDTBalance) / 10 ** STABLE_DECIMALS.USDT : 0,
                };
            } catch (e) {
                console.log('e ', e);
                return {
                    sUSDBalance: 0,
                    DAIBalance: 0,
                    USDCBalance: 0,
                    USDTBalance: 0,
                };
            }
        },
        options
    );
};

export default useMultipleCollateralBalanceQuery;
