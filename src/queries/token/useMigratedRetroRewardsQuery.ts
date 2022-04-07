import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { MigratedRetroReward } from 'types/token';
import unclaimedRetroRewardsHashes from 'utils/json/airdrop-hashes-unclaimed-retro.json';

const useMigratedRetroRewardsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<MigratedRetroReward>
) => {
    return useQuery<MigratedRetroReward>(
        QUERY_KEYS.Token.MigratedRetroRewards(walletAddress, networkId),
        async () => {
            const paused = await (snxJSConnector as any).unclaimedRetroAirdropContract.paused();

            const unclaimedRetroRewardsHash = unclaimedRetroRewardsHashes.find(
                (airdrop: any) => airdrop.address.toLowerCase() === walletAddress.toLowerCase()
            );

            const migratedRewards: MigratedRetroReward = {
                isClaimPaused: paused,
                hasClaimRights: unclaimedRetroRewardsHash !== undefined && unclaimedRetroRewardsHash.balance !== '0',
                claimed: false,
            };
            if (unclaimedRetroRewardsHash) {
                migratedRewards.reward = {
                    rawBalance: unclaimedRetroRewardsHash.balance,
                    balance: bigNumberFormatter(unclaimedRetroRewardsHash.balance),
                    index: unclaimedRetroRewardsHash.index,
                    proof: unclaimedRetroRewardsHash.proof,
                };
                migratedRewards.claimed = !(await (snxJSConnector as any).unclaimedRetroAirdropContract.canClaim(
                    unclaimedRetroRewardsHash.index
                ));
            }

            return migratedRewards;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMigratedRetroRewardsQuery;
