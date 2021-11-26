import { useQuery, UseQueryOptions } from 'react-query';
import request, { gql } from 'graphql-request';
import { SNAPSHOT_GRAPHQL_URL, SpaceKey } from 'constants/governance';
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
                        proposals(first: 10, where: { space: $spaceKey }, orderBy: "created", orderDirection: desc) {
                            id
                            title
                            body
                            choices
                            start
                            end
                            snapshot
                            state
                            author
                            space {
                                id
                                name
                                symbol
                            }
                        }
                    }
                `,
                { spaceKey: spaceKey }
            );

            return proposals;
        },
        {
            ...options,
        }
    );
};

export default useProposalsQuery;
