import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { Stakers, Staker } from 'types/governance';
import { NetworkId } from '@synthetixio/contracts-interface';

const useThalesStakersQuery = (options?: UseQueryOptions<Stakers>) => {
    return useQuery<Stakers>(
        QUERY_KEYS.Governance.ThalesStakers(),
        async () => {
            const stakers = await thalesData.binaryOptions.stakers({
                network: NetworkId['Mainnet-Ovm'],
            });
            return stakers.filter((staker: Staker) => staker.totalStakedAmount > 0);
        },
        {
            ...options,
        }
    );
};

export default useThalesStakersQuery;
