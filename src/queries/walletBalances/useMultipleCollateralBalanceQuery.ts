import snxJSConnector from 'utils/snxJSConnector';

import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { COLLATERAL_DECIMALS } from 'constants/currency';
import { bigNumberFormatter } from 'utils/formatters/ethers';

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
                        ETH: 0,
                    };
                }

                const [
                    sUSDBalance,
                    DAIBalance,
                    USDCBalance,
                    USDTBalance,
                    OPBalance,
                    WETHBalance,
                    ETHBalance,
                ] = await Promise.all([
                    multipleCollateral?.length ? multipleCollateral[0]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[1]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[2]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[3]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[4]?.balanceOf(walletAddress) : undefined,
                    multipleCollateral?.length ? multipleCollateral[5]?.balanceOf(walletAddress) : undefined,
                    snxJSConnector.provider ? snxJSConnector.provider.getBalance(walletAddress) : undefined,
                ]);
                return {
                    sUSD: sUSDBalance ? bigNumberFormatter(sUSDBalance, COLLATERAL_DECIMALS.sUSD) : 0,
                    DAI: DAIBalance ? bigNumberFormatter(DAIBalance, COLLATERAL_DECIMALS.DAI) : 0,
                    USDC: USDCBalance ? bigNumberFormatter(USDCBalance, COLLATERAL_DECIMALS.USDC) : 0,
                    USDT: USDTBalance ? bigNumberFormatter(USDTBalance, COLLATERAL_DECIMALS.USDT) : 0,
                    OP: OPBalance ? bigNumberFormatter(OPBalance, COLLATERAL_DECIMALS.OP) : 0,
                    WETH: WETHBalance ? bigNumberFormatter(WETHBalance, COLLATERAL_DECIMALS.WETH) : 0,
                    ETH: ETHBalance ? bigNumberFormatter(ETHBalance, COLLATERAL_DECIMALS.ETH) : 0,
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
                    ETH: 0,
                };
            }
        },
        options
    );
};

export default useMultipleCollateralBalanceQuery;
