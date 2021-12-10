import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { Stakers, Staker } from 'types/governance';
import { NetworkId } from 'utils/network';
// import snxJSConnector from 'utils/snxJSConnector';

const useThalesStakersQuery = (networkId: NetworkId, options?: UseQueryOptions<Stakers>) => {
    return useQuery<Stakers>(
        QUERY_KEYS.Governance.ThalesStakers(networkId),
        async () => {
            const stakers = await thalesData.binaryOptions.stakers({
                network: networkId,
            });
            // const promises = [];
            // for (let index = 0; index < stakers.length; index++) {
            //     promises.push((snxJSConnector as any).provider.lookupAddress(stakers[index].id));
            // }

            // const ensNames: string[] = await Promise.all(promises);

            // const extendedStakers = stakers.map((staker: Staker, i: number) => {
            //     staker.ensName = ensNames[i];
            //     return staker;
            // });
            return stakers.filter((staker: Staker) => staker.totalStakedAmount > 0);
        },
        {
            ...options,
        }
    );
};

export default useThalesStakersQuery;
