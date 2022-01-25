import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { MigratedReward } from 'types/token';
import { getOngoingAirdropHashesURL } from 'utils/token';

const BALANCE_THRESHOLD = 0.0001;

const useMigratedRewardsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<MigratedReward>
) => {
    return useQuery<MigratedReward>(
        QUERY_KEYS.Token.MigratedRewards(walletAddress, networkId),
        async () => {
            const [paused, period, lastPeriodTimeStamp, durationPeriod] = await Promise.all([
                (snxJSConnector as any).ongoingAirdropContract.paused(),
                (snxJSConnector as any).ongoingAirdropContract.period(),
                (snxJSConnector as any).stakingThalesContract.lastPeriodTimeStamp(),
                (snxJSConnector as any).stakingThalesContract.durationPeriod(),
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

            const migratedRewards: MigratedReward = {
                isClaimPaused: paused || !isHashFileAvailable,
                hasClaimRights: ongoingAirdropHash !== undefined && ongoingAirdropHash.balance !== '0',
                claimed: true,
                period: period,
                closingDate: Number(lastPeriodTimeStamp) * 1000 + Number(durationPeriod) * 1000,
            };
            if (ongoingAirdropHash) {
                const balance = bigNumberFormatter(ongoingAirdropHash.balance);
                const previousBalance = bigNumberFormatter(ongoingAirdropHash.previousBalance || 0);
                const stakingBalance = bigNumberFormatter(ongoingAirdropHash.stakingBalance || 0);
                const snxBalance =
                    bigNumberFormatter(ongoingAirdropHash.balance) -
                    bigNumberFormatter(ongoingAirdropHash.stakingBalance || 0) -
                    bigNumberFormatter(ongoingAirdropHash.previousBalance || 0);
                migratedRewards.reward = {
                    rawBalance: ongoingAirdropHash.balance,
                    balance,
                    previousBalance,
                    stakingBalance,
                    snxBalance: snxBalance < BALANCE_THRESHOLD ? 0 : snxBalance,
                    index: ongoingAirdropHash.index,
                    proof: ongoingAirdropHash.proof,
                };
                migratedRewards.claimed = !(await (snxJSConnector as any).ongoingAirdropContract.canClaim(
                    ongoingAirdropHash.index
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

export default useMigratedRewardsQuery;
