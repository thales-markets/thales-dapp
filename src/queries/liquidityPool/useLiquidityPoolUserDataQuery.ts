import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { UserLiquidityPoolData } from 'types/liquidityPool';
import { NetworkId, getDefaultDecimalsForNetwork } from 'utils/network';

const useLiquidityPoolUserDataQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<UserLiquidityPoolData | undefined>
) => {
    return useQuery<UserLiquidityPoolData | undefined>(
        QUERY_KEYS.LiquidityPool.UserData(walletAddress, networkId),
        async () => {
            const userLiquidityPoolData: UserLiquidityPoolData = {
                balanceCurrentRound: 0,
                balanceNextRound: 0,
                balanceTotal: 0,
                isWithdrawalRequested: false,
                hasDepositForCurrentRound: false,
                hasDepositForNextRound: false,
                stakedThales: 0,
                maxDeposit: 0,
                availableToDeposit: 0,
                neededStakedThalesToWithdraw: 0,
            };

            const decimals = getDefaultDecimalsForNetwork(networkId);
            try {
                const { liquidityPoolContract, liquidityPoolDataContract } = snxJSConnector;
                if (liquidityPoolContract && liquidityPoolDataContract) {
                    const contractUserLiquidityPoolData = await liquidityPoolDataContract.getUserLiquidityPoolData(
                        liquidityPoolContract.address,
                        walletAddress
                    );

                    userLiquidityPoolData.balanceCurrentRound = bigNumberFormatter(
                        contractUserLiquidityPoolData.balanceCurrentRound,
                        decimals
                    );
                    userLiquidityPoolData.balanceNextRound = bigNumberFormatter(
                        contractUserLiquidityPoolData.balanceNextRound,
                        decimals
                    );
                    userLiquidityPoolData.balanceTotal = contractUserLiquidityPoolData.withdrawalRequested
                        ? 0
                        : userLiquidityPoolData.balanceCurrentRound + userLiquidityPoolData.balanceNextRound;
                    userLiquidityPoolData.isWithdrawalRequested = contractUserLiquidityPoolData.withdrawalRequested;
                    userLiquidityPoolData.hasDepositForCurrentRound = userLiquidityPoolData.balanceCurrentRound > 0;
                    userLiquidityPoolData.hasDepositForNextRound = userLiquidityPoolData.balanceNextRound > 0;
                    userLiquidityPoolData.maxDeposit = bigNumberFormatter(
                        contractUserLiquidityPoolData.maxDeposit,
                        decimals
                    );
                    userLiquidityPoolData.stakedThales = bigNumberFormatter(contractUserLiquidityPoolData.stakedThales);
                    userLiquidityPoolData.availableToDeposit = bigNumberFormatter(
                        contractUserLiquidityPoolData.availableToDeposit,
                        decimals
                    );
                    userLiquidityPoolData.neededStakedThalesToWithdraw = bigNumberFormatter(
                        contractUserLiquidityPoolData.neededStakedThalesToWithdraw
                    );

                    return userLiquidityPoolData;
                }
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

export default useLiquidityPoolUserDataQuery;
