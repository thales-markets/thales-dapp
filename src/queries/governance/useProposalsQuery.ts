import { useQuery, UseQueryOptions } from 'react-query';
import request, { gql } from 'graphql-request';
import { EXCLUDED_PROPOSALS, SNAPSHOT_GRAPHQL_URL, SpaceKey } from 'constants/governance';
import { Proposal } from 'types/governance';
import QUERY_KEYS from 'constants/queryKeys';

const useProposalsQuery = (spaceKey: SpaceKey, options?: UseQueryOptions<Proposal[]>) => {
    return useQuery<Proposal[]>(
        QUERY_KEYS.Governance.Proposals(spaceKey),
        async () => {
            const { proposals }: { proposals: Proposal[] } = await request(
                SNAPSHOT_GRAPHQL_URL,
                gql`
                    query ProposalsForSpace($spaceKey: String) {
                        proposals(first: 100, where: { space: $spaceKey }, orderBy: "created", orderDirection: desc) {
                            id
                            title
                            body
                            choices
                            start
                            end
                            snapshot
                            state
                            author
                            type
                            space {
                                id
                                name
                                symbol
                                network
                            }
                            strategies {
                                name
                                params
                            }
                        }
                    }
                `,
                { spaceKey: spaceKey }
            );

            return proposals.filter((proposal: Proposal) => !EXCLUDED_PROPOSALS.includes(proposal.id));
        },
        {
            ...options,
        }
    );
};

export default useProposalsQuery;
