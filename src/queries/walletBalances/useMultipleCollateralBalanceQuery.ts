import snxJSConnector from 'utils/snxJSConnector';

import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import { STABLE_DECIMALS } from 'constants/options';
import { COLLATERALS_INDEX } from 'enums/options';

const useMultipleCollateralBalanceQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<any>
) => {
    return useQuery<any>(
        QUERY_KEYS.WalletBalances.MultipleCollateral(walletAddress, networkId),
        async () => {
            try {
                const multipleCollateral = snxJSConnector.multipleCollateral;

                if (!walletAddress || !networkId) {
                    return {
                        sUSD: 0,
                        DAI: 0,
                        USDC: 0,
                        USDT: 0,
                    };
                }

                const [sUSDBalance, DAIBalance, USDCBalance, USDTBalance] = await Promise.all([
                    multipleCollateral?.length
                        ? multipleCollateral[COLLATERALS_INDEX.sUSD]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral?.length
                        ? multipleCollateral[COLLATERALS_INDEX.DAI]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral?.length
                        ? multipleCollateral[COLLATERALS_INDEX.USDC]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral?.length
                        ? multipleCollateral[COLLATERALS_INDEX.USDT]?.balanceOf(walletAddress)
                        : undefined,
                ]);
                return {
                    sUSD: sUSDBalance ? parseInt(sUSDBalance) / 10 ** STABLE_DECIMALS.sUSD : 0,
                    DAI: DAIBalance ? parseInt(DAIBalance) / 10 ** STABLE_DECIMALS.DAI : 0,
                    USDC: USDCBalance ? parseInt(USDCBalance) / 10 ** STABLE_DECIMALS.USDC : 0,
                    USDT: USDTBalance ? parseInt(USDTBalance) / 10 ** STABLE_DECIMALS.USDT : 0,
                };
            } catch (e) {
                console.log('e ', e);
                return {
                    sUSD: 0,
                    DAI: 0,
                    USDC: 0,
                    USDT: 0,
                };
            }
        },
        options
    );
};

export default useMultipleCollateralBalanceQuery;
