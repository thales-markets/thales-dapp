import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { Staker, Stakers } from 'types/governance';
import { Network } from 'utils/network';

const useThalesStakersQuery = (options?: UseQueryOptions<Stakers>) => {
    return useQuery<Stakers>(
        QUERY_KEYS.Governance.ThalesStakers(),
        async () => {
            const [stakers, stakersArb] = await Promise.all([
                thalesData.binaryOptions.stakers({
                    network: Network['Mainnet-Ovm'],
                }),
                thalesData.binaryOptions.stakers({
                    network: Network.Arbitrum,
                }),
            ]);
            const mapToUse = new Map();
            const stakersFinal: Stakers = [...stakers];

            [...stakers].map((staker: Staker) => {
                mapToUse.set(staker.id, staker.totalStakedAmount);
            });

            stakersArb.map((staker: Staker) => {
                if (mapToUse.get(staker.id)) {
                    mapToUse.set(staker.id, staker.totalStakedAmount + mapToUse.get(staker.id));
                } else {
                    stakersFinal.push(staker);
                }
            });

            return stakersFinal
                .map((staker) => {
                    if (mapToUse.get(staker.id)) {
                        staker.totalStakedAmount = mapToUse.get(staker.id);
                    }
                    return staker;
                })
                .filter((staker: Staker) => staker.totalStakedAmount > 0);
        },
        {
            ...options,
        }
    );
};

export default useThalesStakersQuery;
