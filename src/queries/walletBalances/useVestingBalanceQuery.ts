import { useQuery, UseQueryOptions } from 'react-query';
import { ethers } from 'ethers';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { VestingInfo } from '../../types/vesting';
import { truncToDecimals } from '../../utils/formatters/number';

const useVestingBalanceQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<VestingInfo>
) => {
    return useQuery<VestingInfo>(
        QUERY_KEYS.WalletBalances.Vesting(walletAddress, networkId),
        async () => {
            const unlocked = +truncToDecimals(
                bigNumberFormatter(await (snxJSConnector as any).vestingEscrowContract.balanceOf(walletAddress))
            );
            const initialLocked = +truncToDecimals(
                bigNumberFormatter(await (snxJSConnector as any).vestingEscrowContract.initialLocked(walletAddress))
            );
            const totalClaimed = +truncToDecimals(
                bigNumberFormatter(await (snxJSConnector as any).vestingEscrowContract.totalClaimed(walletAddress))
            );

            const startTime = new Date(
                +ethers.utils.formatUnits(await (snxJSConnector as any).vestingEscrowContract.startTime(), 0) * 1000
            );

            const endTime = new Date(
                +ethers.utils.formatUnits(await (snxJSConnector as any).vestingEscrowContract.endTime(), 0) * 1000
            );

            return { unlocked, initialLocked, totalClaimed, startTime, endTime };
        },
        options
    );
};

export default useVestingBalanceQuery;
