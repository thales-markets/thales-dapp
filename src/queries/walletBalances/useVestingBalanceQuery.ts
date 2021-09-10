import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { VestingInfo } from 'types/token';

const useVestingBalanceQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<VestingInfo>
) => {
    return useQuery<VestingInfo>(
        QUERY_KEYS.WalletBalances.Vesting(walletAddress, networkId),
        async () => {
            const [unlocked, initialLocked, totalClaimed, startTime, endTime] = await Promise.all([
                await (snxJSConnector as any).vestingEscrowContract.balanceOf(walletAddress),
                await (snxJSConnector as any).vestingEscrowContract.initialLocked(walletAddress),
                await (snxJSConnector as any).vestingEscrowContract.totalClaimed(walletAddress),
                await (snxJSConnector as any).vestingEscrowContract.startTime(),
                await (snxJSConnector as any).vestingEscrowContract.endTime(),
            ]);

            const vestingInfo: VestingInfo = {
                unlocked: bigNumberFormatter(unlocked),
                initialLocked: bigNumberFormatter(initialLocked),
                totalClaimed: bigNumberFormatter(totalClaimed),
                startTime: Number(startTime) * 1000,
                endTime: Number(endTime) * 1000,
            };

            return vestingInfo;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useVestingBalanceQuery;
