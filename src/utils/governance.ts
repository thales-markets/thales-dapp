import snapshot from '@snapshot-labs/snapshot.js';
import { SpaceKey } from 'constants/governance';
// import { getCurrentTimestampSeconds } from 'utils/formatters/date';
import { ethers } from 'ethers';
import { truncateAddress, truncateText } from './formatters/string';

export function getENSForAddresses(addresses: any[]) {
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

export function getUsername(address: string, youText: string, profile: any, walletAddress: string, short = true) {
    if (address.toLowerCase() === walletAddress.toLowerCase()) {
        return youText;
    }

    if (profile) {
        if (profile.ens) {
            return short ? truncateText(profile.ens, 12) : profile.ens;
        }
        return short ? truncateAddress(address) : address;
    }

    return short ? truncateAddress(address) : address;
}

export const getProposalUrl = (spaceKey: SpaceKey, id: string) => `https://snapshot.org/#/${spaceKey}/proposal/${id}`;
