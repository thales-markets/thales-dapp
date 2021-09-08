import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { StakingReward } from 'types/token';
import { getOngoingAirdropHashesURL } from 'utils/token';

const useOngoingAirdropQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<StakingReward>
) => {
    return useQuery<StakingReward>(
        QUERY_KEYS.WalletBalances.OngoingAirdrop(walletAddress, networkId),
        async () => {
            const [paused, period] = await Promise.all([
                (snxJSConnector as any).ongoingAirdropContract.paused(),
                (snxJSConnector as any).ongoingAirdropContract.period(),
            ]);

            let ongoingAirdropHashes: any = [];
            let isHashFileAvailable = true;
            try {
                const ongoingAirdropHashesResponse = await fetch(getOngoingAirdropHashesURL(period));
                ongoingAirdropHashes = await ongoingAirdropHashesResponse.json();
            } catch {
                isHashFileAvailable = false;
            }
            const ongoingAirdropHash = ongoingAirdropHashes.find(
                (airdrop: any) => airdrop.address.toLowerCase() === walletAddress.toLowerCase()
            );

            const airdrop: StakingReward = {
                isClaimPaused: paused || !isHashFileAvailable,
                hasClaimRights: ongoingAirdropHash !== undefined,
                claimed: true,
            };
            if (ongoingAirdropHash) {
                airdrop.reward = {
                    rawBalance: ongoingAirdropHash.balance,
                    balance: bigNumberFormatter(ongoingAirdropHash.balance),
                    previousBalance: bigNumberFormatter(ongoingAirdropHash.previousBalance || 0),
                    stakingBalance: bigNumberFormatter(ongoingAirdropHash.stakingBalance || 0),
                    snxBalance: bigNumberFormatter(
                        ongoingAirdropHash.balance - (ongoingAirdropHash.stakingBalance || 0)
                    ),
                    index: ongoingAirdropHash.index,
                    proof: ongoingAirdropHash.proof,
                };
                try {
                    await (snxJSConnector as any).ongoingAirdropContract.claimed(ongoingAirdropHash.index);
                    airdrop.claimed = false;
                } catch {}
            }

            return airdrop;
        },
        options
    );
};

export default useOngoingAirdropQuery;
