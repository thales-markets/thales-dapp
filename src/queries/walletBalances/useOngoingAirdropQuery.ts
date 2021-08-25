import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { Airdrop } from 'types/token';
import { getOngoingAirdropHashesURL } from 'utils/token';

const useOngoingAirdropQuery = (walletAddress: string, networkId: NetworkId, options?: UseQueryOptions<Airdrop>) => {
    return useQuery<Airdrop>(
        QUERY_KEYS.WalletBalances.OngoingAirdrop(walletAddress, networkId),
        async () => {
            const [paused, period] = await Promise.all([
                (snxJSConnector as any).ongoingAirdropContract.paused(),
                (snxJSConnector as any).ongoingAirdropContract.period(),
            ]);

            const ongoingAirdropHashesResponse = await fetch(getOngoingAirdropHashesURL(period));
            const ongoingAirdropHashes = await ongoingAirdropHashesResponse.json();
            const ongoingAirdropHash = ongoingAirdropHashes.find((airdrop: any) => airdrop.address === walletAddress);

            const airdrop: Airdrop = {
                isClaimPaused: paused,
                hasClaimRights: ongoingAirdropHash !== undefined,
                claimed: true,
            };
            if (ongoingAirdropHash) {
                airdrop.accountInfo = {
                    rawBalance: ongoingAirdropHash.balance,
                    balance: bigNumberFormatter(ongoingAirdropHash.balance),
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
