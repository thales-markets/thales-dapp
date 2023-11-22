import snapshot from '@snapshot-labs/snapshot.js';
import { SNAPSHOT_SCORE_URL, VOTING_COUNCIL_PROPOSAL_ID } from 'constants/governance';
import QUERY_KEYS from 'constants/queryKeys';
import { StatusEnum } from 'enums/governance';
import { useQuery, UseQueryOptions } from 'react-query';
import { Proposal } from 'types/governance';

const useVotingPowerQuery = (proposal: Proposal, walletAddress: string, options?: UseQueryOptions<number>) => {
    return useQuery<number>(
        QUERY_KEYS.Governance.VotingPower(proposal.id, proposal.snapshot, walletAddress),
        async () => {
            if (proposal.id === VOTING_COUNCIL_PROPOSAL_ID && proposal.state !== StatusEnum.Closed) {
                proposal.strategies[0].params = {
                    ...proposal.strategies[0].params,
                };
            }

            const scores = await snapshot.utils.getScores(
                proposal.space.id,
                proposal.strategies,
                proposal.space.network,
                [walletAddress],
                parseInt(proposal.snapshot),
                SNAPSHOT_SCORE_URL
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
