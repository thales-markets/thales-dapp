import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { Stakers, Staker } from 'types/governance';
import { NetworkId } from 'utils/network';

const useThalesStakersQuery = (networkId: NetworkId, options?: UseQueryOptions<Stakers>) => {
    return useQuery<Stakers>(
        QUERY_KEYS.Governance.ThalesStakers(networkId),
        async () => {
            const stakers = await thalesData.binaryOptions.stakers({
                network: networkId,
            });
            return stakers.filter((staker: Staker) => staker.totalStakedAmount > 0);
        },
        {
            ...options,
        }
    );
};

export default useThalesStakersQuery;
