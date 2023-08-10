import snxJSConnector from 'utils/snxJSConnector';

import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { COLLATERAL_DECIMALS } from 'constants/currency';

const useMultipleCollateralBalanceQuery = (
    walletAddress: string,
    networkId: Network,
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
                        OP: 0,
                        WETH: 0,
                    };
                }

                const [sUSDBalance, DAIBalance, USDCBalance, USDTBalance, OPBalance, WETHBalance] = await Promise.all([
                    multipleCollateral?.length ? multipleCollateral[0]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[1]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[2]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[3]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[4]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[5]?.balanceOf(walletAddress) : undefined,
                ]);
                return {
                    sUSD: sUSDBalance ? parseInt(sUSDBalance) / 10 ** COLLATERAL_DECIMALS.sUSD : 0,
                    DAI: DAIBalance ? parseInt(DAIBalance) / 10 ** COLLATERAL_DECIMALS.DAI : 0,
                    USDC: USDCBalance ? parseInt(USDCBalance) / 10 ** COLLATERAL_DECIMALS.USDC : 0,
                    USDT: USDTBalance ? parseInt(USDTBalance) / 10 ** COLLATERAL_DECIMALS.USDT : 0,
                    OP: OPBalance ? parseInt(OPBalance) / 10 ** COLLATERAL_DECIMALS.OP : 0,
                    WETH: WETHBalance ? parseInt(WETHBalance) / 10 ** COLLATERAL_DECIMALS.WETH : 0,
                };
            } catch (e) {
                console.log('e ', e);
                return {
                    sUSD: 0,
                    DAI: 0,
                    USDC: 0,
                    USDT: 0,
                    OP: 0,
                    WETH: 0,
                };
            }
        },
        options
    );
};

export default useMultipleCollateralBalanceQuery;
