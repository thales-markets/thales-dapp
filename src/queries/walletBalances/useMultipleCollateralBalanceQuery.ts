import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';
import { COLLATERAL_DECIMALS, Coins, bigNumberFormatter } from 'thales-utils';
import { CollateralsBalance } from 'types/collateral';
import snxJSConnector from 'utils/snxJSConnector';

const useMultipleCollateralBalanceQuery = (
    walletAddress: string,
    networkId: Network,
    options?: UseQueryOptions<any>
) => {
    return useQuery<CollateralsBalance>(
        QUERY_KEYS.WalletBalances.MultipleCollateral(walletAddress, networkId),
        async () => {
            let collateralsBalance: CollateralsBalance = {
                sUSD: 0,
                DAI: 0,
                USDCe: 0,
                USDbC: 0,
                USDT: 0,
                OP: 0,
                WETH: 0,
                ETH: 0,
                ARB: 0,
                USDC: 0,
                BUSD: 0,
            };
            try {
                const multipleCollateral = snxJSConnector.multipleCollateral;

                if (!walletAddress || !networkId) {
                    return collateralsBalance;
                }

                const [
                    sUSDBalance,
                    DAIBalance,
                    USDCBalance,
                    USDCeBalance,
                    USDbCBalance,
                    USDTBalance,
                    OPBalance,
                    WETHBalance,
                    ETHBalance,
                    ARBBalance,
                ] = await Promise.all([
                    multipleCollateral
                        ? multipleCollateral[SYNTHS_MAP.sUSD as Coins]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral
                        ? multipleCollateral[CRYPTO_CURRENCY_MAP.DAI as Coins]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral
                        ? multipleCollateral[CRYPTO_CURRENCY_MAP.USDC as Coins]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral
                        ? multipleCollateral[CRYPTO_CURRENCY_MAP.USDCe as Coins]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral
                        ? multipleCollateral[CRYPTO_CURRENCY_MAP.USDbC as Coins]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral
                        ? multipleCollateral[CRYPTO_CURRENCY_MAP.USDT as Coins]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral
                        ? multipleCollateral[CRYPTO_CURRENCY_MAP.OP as Coins]?.balanceOf(walletAddress)
                        : undefined,
                    multipleCollateral
                        ? multipleCollateral[CRYPTO_CURRENCY_MAP.WETH as Coins]?.balanceOf(walletAddress)
                        : undefined,
                    snxJSConnector.provider ? snxJSConnector.provider.getBalance(walletAddress) : undefined,
                    multipleCollateral
                        ? multipleCollateral[CRYPTO_CURRENCY_MAP.ARB as Coins]?.balanceOf(walletAddress)
                        : undefined,
                ]);
                collateralsBalance = {
                    sUSD: sUSDBalance ? bigNumberFormatter(sUSDBalance, COLLATERAL_DECIMALS.sUSD) : 0,
                    DAI: DAIBalance ? bigNumberFormatter(DAIBalance, COLLATERAL_DECIMALS.DAI) : 0,
                    USDC: USDCBalance ? bigNumberFormatter(USDCBalance, COLLATERAL_DECIMALS.USDC) : 0,
                    USDCe: USDCeBalance ? bigNumberFormatter(USDCeBalance, COLLATERAL_DECIMALS.USDCe) : 0,
                    USDbC: USDbCBalance ? bigNumberFormatter(USDbCBalance, COLLATERAL_DECIMALS.USDbC) : 0,
                    USDT: USDTBalance ? bigNumberFormatter(USDTBalance, COLLATERAL_DECIMALS.USDT) : 0,
                    OP: OPBalance ? bigNumberFormatter(OPBalance, COLLATERAL_DECIMALS.OP) : 0,
                    WETH: WETHBalance ? bigNumberFormatter(WETHBalance, COLLATERAL_DECIMALS.WETH) : 0,
                    ETH: ETHBalance ? bigNumberFormatter(ETHBalance, COLLATERAL_DECIMALS.ETH) : 0,
                    ARB: ARBBalance ? bigNumberFormatter(ARBBalance, COLLATERAL_DECIMALS.ARB) : 0,
                    BUSD: 0,
                };
            } catch (e) {
                console.log('e ', e);
            }

            return collateralsBalance;
        },
        options
    );
};

export default useMultipleCollateralBalanceQuery;
