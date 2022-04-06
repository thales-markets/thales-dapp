import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { MigratedRetroReward } from 'types/token';
import unclaimedInvestorsRetroRewardsHashes from 'utils/json/airdrop-hashes-unclaimed-retro-investors.json';

const useMigratedInvestorsRetroRewardsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<MigratedRetroReward>
) => {
    return useQuery<MigratedRetroReward>(
        QUERY_KEYS.Token.MigratedInvestorsRetroRewards(walletAddress, networkId),
        async () => {
            const paused = await (snxJSConnector as any).unclaimedInvestorsRetroAirdropContract.paused();

            const unclaimedInvestorsRetroRewardsHash = unclaimedInvestorsRetroRewardsHashes.find(
                (airdrop: any) => airdrop.address.toLowerCase() === walletAddress.toLowerCase()
            );

            const migratedRewards: MigratedRetroReward = {
                isClaimPaused: paused,
                hasClaimRights:
                    unclaimedInvestorsRetroRewardsHash !== undefined &&
                    unclaimedInvestorsRetroRewardsHash.balance !== '0',
                claimed: false,
            };
            if (unclaimedInvestorsRetroRewardsHash) {
                migratedRewards.reward = {
                    rawBalance: unclaimedInvestorsRetroRewardsHash.balance,
                    balance: bigNumberFormatter(unclaimedInvestorsRetroRewardsHash.balance),
                    index: unclaimedInvestorsRetroRewardsHash.index,
                    proof: unclaimedInvestorsRetroRewardsHash.proof,
                };
                migratedRewards.claimed = !(await (snxJSConnector as any).unclaimedInvestorsRetroAirdropContract.canClaim(
                    unclaimedInvestorsRetroRewardsHash.index
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

export default useMigratedInvestorsRetroRewardsQuery;
