import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { getIsOVM, NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { Airdrop } from 'types/token';
import retroAirdropHashes from 'utils/json/airdrop-hashes.json';
import l2retroAirdropHashes from 'utils/json/l2-airdrop-hashes.json';

const useRetroAirdropQuery = (walletAddress: string, networkId: NetworkId, options?: UseQueryOptions<Airdrop>) => {
    return useQuery<Airdrop>(
        QUERY_KEYS.WalletBalances.RetroAirdrop(walletAddress, networkId),
        async () => {
            const isL2 = getIsOVM(networkId);
            const retroAirdropHash = (isL2 ? l2retroAirdropHashes : retroAirdropHashes).find(
                (airdrop: any) => airdrop.address.toLowerCase() === walletAddress.toLowerCase()
            );

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
                airdrop.claimed = !(await (snxJSConnector as any).retroAirdropContract.canClaim(
                    retroAirdropHash.index
                ));
            }
            return airdrop;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useRetroAirdropQuery;
