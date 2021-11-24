import { useQuery, UseQueryOptions } from 'react-query';
import snapshot from '@snapshot-labs/snapshot.js';
import { ethers } from 'ethers';
import { uniqBy } from 'lodash';
import request, { gql } from 'graphql-request';
import { snapshotEndpoint, SpaceKey } from 'constants/governance';
import { MappedVotes, Proposal, ProposalResults, SpaceData, SpaceStrategy, Vote } from 'types/governance';
import QUERY_KEYS from 'constants/queryKeys';
import voting from 'utils/voting';

// export function getENSForAddresses(addresses: any[]) {
//     return new Promise((resolve, reject) => {
//         snapshot.utils
//             .subgraphRequest('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
//                 accounts: {
//                     __args: {
//                         first: 1000,
//                         where: {
//                             id_in: addresses.map((addresses: string) => addresses.toLowerCase()),
//                         },
//                     },
//                     id: true,
//                     domains: {
//                         __args: {
//                             first: 2,
//                         },
//                         name: true,
//                         labelName: true,
//                     },
//                 },
//             })
//             .then(({ accounts }: { accounts: any }) => {
//                 const ensNames = {} as any;
//                 accounts.forEach((profile: any) => {
//                     ensNames[ethers.utils.getAddress(profile.id)] = profile.domains[0] ? profile.domains[0].name : null;
//                 });
//                 resolve(ensNames);
//             })
//             .catch((error: any) => {
//                 reject(error);
//             });
//     });
// }

// export async function getProfiles(addresses: any) {
//     let ensNames = [] as any;

//     [ensNames] = await Promise.all([getENSForAddresses(addresses)]);

//     const profiles = Object.fromEntries(addresses.map((address: any) => [address, {}]));

//     return Object.fromEntries(
//         Object.entries(profiles).map(([address, profile]) => {
//             profile.ens = ensNames[ethers.utils.getAddress(address)] || '';
//             profile.address = ethers.utils.getAddress(address);
//             return [address, profile];
//         })
//     );
// }

const useProposalQuery = (
    spaceKey: SpaceKey,
    hash: string,
    walletAddress: string,
    options?: UseQueryOptions<ProposalResults>
) => {
    return useQuery<ProposalResults>(
        QUERY_KEYS.Governance.Proposal(spaceKey, hash, walletAddress),
        async () => {
            const { getAddress } = ethers.utils;

            const { proposal }: { proposal: Proposal } = await request(
                snapshotEndpoint,
                gql`
                    query Proposal($id: String) {
                        proposal(id: $id) {
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
                            strategies {
                                name
                                params
                            }
                            space {
                                id
                                name
                            }
                        }
                    }
                `,
                { id: hash }
            );

            const { space }: { space: SpaceData } = await request(
                snapshotEndpoint,
                gql`
                    query Space($spaceKey: String) {
                        space(id: $spaceKey) {
                            domain
                            about
                            members
                            name
                            network
                            skin
                            symbol
                            strategies {
                                name
                                params
                            }
                            filters {
                                minScore
                                onlyMembers
                            }
                        }
                    }
                `,
                { spaceKey: spaceKey }
            );

            const { votes }: { votes: Vote[] } = await request(
                snapshotEndpoint,
                gql`
                    query Votes($proposal: String) {
                        votes(first: 1000, where: { proposal: $proposal }) {
                            id
                            voter
                            choice
                        }
                    }
                `,
                { proposal: proposal.id }
            );

            const voterAddresses = votes.map((e: Vote) => ethers.utils.getAddress(e.voter));

            const block = parseInt(proposal.snapshot);

            console.log(proposal.strategies, block, voterAddresses.length);

            const [scores /*, profiles*/] = await Promise.all([
                snapshot.utils.getScores(spaceKey, proposal.strategies, space.network, voterAddresses, block),
                /* Get scores and ENS/3Box profiles */
                // getProfiles(voterAddresses),
            ]);

            let mappedVotes = votes as MappedVotes[];

            mappedVotes = uniqBy(
                mappedVotes
                    .map((vote) => {
                        vote.scores = space.strategies.map(
                            (_: SpaceStrategy, key: number) => scores[key][getAddress(vote.voter)] || 0
                        );
                        vote.balance = vote.scores.reduce((a: number, b: number) => a + b, 0);
                        // vote.profile = profiles[getAddress(vote.voter)];
                        return vote;
                    })
                    .filter((vote) => vote.balance > 0)
                    .sort((a, b) => b.balance - a.balance),
                (a) => getAddress(a.voter)
            );

            /* Get results */
            //@ts-ignore
            const votingClass = new voting[proposal.type](proposal, mappedVotes, space.strategies);
            const results = {
                resultsByVoteBalance: votingClass.resultsByVoteBalance(),
                resultsByStrategyScore: votingClass.resultsByStrategyScore(),
                sumOfResultsBalance: votingClass.sumOfResultsBalance(),
            };

            /* Apply dilution penalties for SIP/SCCP pages */
            // if (spaceKey === SPACE_KEY.PROPOSAL) {
            //     const contract = new ethers.Contract(CouncilDilution.address, CouncilDilution.abi, ctx.provider as any);
            //     mappedVotes = await Promise.all(
            //         mappedVotes.map(async (vote) => {
            //             const dilutedValueBN = await contract.getDilutedWeightForProposal(hash, getAddress(vote.voter));
            //             const diluteValueNumber = Number(ethers.utils.formatEther(dilutedValueBN));

            //             const dilutedResult = vote.balance * diluteValueNumber;
            //             return {
            //                 ...vote,
            //                 balance: dilutedResult,
            //                 scores: [dilutedResult],
            //             };
            //         })
            //     );
            // }

            const returnVoteHistory = () => {
                if (walletAddress && voterAddresses.includes(getAddress(walletAddress))) {
                    const index = mappedVotes.findIndex((a) => getAddress(a.voter) === getAddress(walletAddress));
                    const currentUserVote = mappedVotes[index];
                    mappedVotes.splice(index, 1);
                    mappedVotes.unshift(currentUserVote);
                }
                return mappedVotes;
            };

            const voteList = returnVoteHistory();

            const proposalResults = {
                results,
                votes: voteList,
            };

            return proposalResults;
        },
        {
            ...options,
        }
    );
};

export default useProposalQuery;
