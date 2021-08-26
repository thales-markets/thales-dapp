import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import retroAirdropHashes from 'utils/contracts/airdrop-hashes.json';
import { Airdrop } from 'types/token';

const useRetroAirdropQuery = (walletAddress: string, networkId: NetworkId, options?: UseQueryOptions<Airdrop>) => {
    return useQuery<Airdrop>(
        QUERY_KEYS.WalletBalances.RetroAirdrop(walletAddress, networkId),
        async () => {
            const retroAirdropHash = retroAirdropHashes.find((airdrop) => airdrop.address === walletAddress);

            const airdrop: Airdrop = {
                isClaimPaused: false,
                hasClaimRights: retroAirdropHash !== undefined,
                claimed: true,
            };

            if (retroAirdropHash) {
                airdrop.accountInfo = {
                    rawBalance: retroAirdropHash.balance,
                    balance: bigNumberFormatter(retroAirdropHash.balance),
                    index: retroAirdropHash.index,
                    proof: retroAirdropHash.proof,
                };
                try {
                    await (snxJSConnector as any).retroAirdropContract.claimed(retroAirdropHash.index);
                    airdrop.claimed = false;
                } catch {}
            }
            return airdrop;
        },
        options
    );
};

export default useRetroAirdropQuery;
