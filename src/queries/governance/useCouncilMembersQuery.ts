import { ethers } from 'ethers';
import thalesCouncil from 'utils/contracts/thalesCouncil';
import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';
import { NUMBER_OF_COUNCIL_MEMBERS } from 'constants/governance';
import { getProfiles } from 'utils/governance';

const useCouncilMembersQuery = (options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.Governance.CouncilMembers(),
        async () => {
            const thalesCouncilContract = new ethers.Contract(
                thalesCouncil.address,
                thalesCouncil.abi,
                snxJSConnector.provider
            );

            const councilMembers = [] as any;

            for (let i = 1; i <= NUMBER_OF_COUNCIL_MEMBERS; i++) {
                const address = await thalesCouncilContract.ownerOf(ethers.utils.parseEther(i.toString()));
                if (address !== ethers.constants.AddressZero) {
                    councilMembers.push(ethers.utils.getAddress(address));
                }
            }
            const resolvedMembers = await Promise.resolve(councilMembers);

            const profiles = await getProfiles(resolvedMembers);

            const profileArray = Object.keys(profiles).map((profile) => {
                const accessor = profiles[profile];
                return {
                    ens: accessor.ens.length > 0 ? accessor.ens : null,
                    address: profile,
                    name: accessor.name ? accessor.name : null,
                };
            });
            return profileArray;
        },
        options
    );
};

export default useCouncilMembersQuery;
