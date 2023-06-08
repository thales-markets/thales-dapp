import snapshot from '@snapshot-labs/snapshot.js';
import {
    NUMBER_OF_COUNCIL_MEMBERS,
    NUMBER_OF_COUNCIL_MEMBERS_OLD,
    OLD_COUNCIL_END_DATE,
    PROPOSAL_APPROVAL_VOTES,
    PROPOSAL_APPROVAL_VOTES_OLD,
} from 'constants/governance';
import { SpaceKey, StatusEnum } from 'enums/governance';
import { ethers } from 'ethers';
import { ThemeInterface } from 'types/ui';

function getENSForAddresses(addresses: any[]) {
    return new Promise((resolve, reject) => {
        snapshot.utils
            .subgraphRequest('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
                accounts: {
                    __args: {
                        first: 1000,
                        where: {
                            id_in: addresses.map((addresses: string) => addresses.toLowerCase()),
                        },
                    },
                    id: true,
                    domains: {
                        __args: {
                            first: 2,
                        },
                        name: true,
                        labelName: true,
                    },
                },
            })
            .then(({ accounts }: { accounts: any }) => {
                const ensNames = {} as any;
                accounts.forEach((profile: any) => {
                    ensNames[ethers.utils.getAddress(profile.id)] = profile.domains[0] ? profile.domains[0].name : null;
                });
                resolve(ensNames);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
}

export async function getProfiles(addresses: any) {
    let ensNames = [] as any;

    try {
        [ensNames] = await Promise.all([getENSForAddresses(addresses)]);
    } catch (e) {
        console.log(e);
    }

    const profiles = Object.fromEntries(addresses.map((address: any) => [address, {}]));

    return Object.fromEntries(
        Object.entries(profiles).map(([address, profile]) => {
            profile.ens = ensNames[ethers.utils.getAddress(address)] || '';
            profile.address = ethers.utils.getAddress(address);
            return [address, profile];
        })
    );
}

export const getProposalUrl = (spaceKey: SpaceKey, id: string) => `https://snapshot.org/#/${spaceKey}/proposal/${id}`;

export const getProposalApprovalData = (proposalStartDate: number) => {
    const numberOfCouncilMembers =
        OLD_COUNCIL_END_DATE > new Date(proposalStartDate * 1000)
            ? NUMBER_OF_COUNCIL_MEMBERS_OLD
            : NUMBER_OF_COUNCIL_MEMBERS;
    const proposalApprovalVotes =
        OLD_COUNCIL_END_DATE > new Date(proposalStartDate * 1000)
            ? PROPOSAL_APPROVAL_VOTES_OLD
            : PROPOSAL_APPROVAL_VOTES;
    return { numberOfCouncilMembers, proposalApprovalVotes };
};

export const getStatusColor = (status: string, theme: ThemeInterface) => {
    switch (status) {
        case StatusEnum.Pending:
            return theme.textColor.secondary;
        case StatusEnum.Closed:
            return theme.info.textColor.secondary;
        default:
            return theme.textColor.quaternary;
    }
};
