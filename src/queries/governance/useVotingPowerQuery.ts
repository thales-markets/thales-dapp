import { useQuery, UseQueryOptions } from 'react-query';
import snapshot from '@snapshot-labs/snapshot.js';
import { Proposal } from 'types/governance';
import QUERY_KEYS from 'constants/queryKeys';

const useVotingPowerQuery = (proposal: Proposal, walletAddress: string, options?: UseQueryOptions<number>) => {
    return useQuery<number>(
        QUERY_KEYS.Governance.VotingPower(proposal.id, proposal.snapshot, walletAddress),
        async () => {
            const scores = await snapshot.utils.getScores(
                proposal.space.id,
                proposal.strategies,
                proposal.space.network,
                [walletAddress],
                parseInt(proposal.snapshot)
            );

            const mappedScores = scores.map((score: number) =>
                Object.values(score).reduce((a: number, b: number) => a + b, 0)
            );
            return mappedScores.reduce((a: number, b: number) => a + b, 0);
        },
        {
            ...options,
        }
    );
};

export default useVotingPowerQuery;
