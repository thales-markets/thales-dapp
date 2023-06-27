import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { Staker, Stakers } from 'types/governance';
import { Network } from 'enums/network';
import { orderBy } from 'lodash';
import { StakersFilterEnum } from 'enums/governance';

const useThalesStakersQuery = (filter: StakersFilterEnum, options?: UseQueryOptions<Stakers>) => {
    return useQuery<Stakers>(
        QUERY_KEYS.Governance.ThalesStakers(filter),
        async () => {
            const [stakers, stakersArb] = await Promise.all([
                thalesData.binaryOptions.stakers({
                    network: Network['Mainnet-Ovm'],
                }),
                thalesData.binaryOptions.stakers({
                    network: Network.Arbitrum,
                }),
            ]);

            let stakersFinal: Stakers = [];
            if (filter === StakersFilterEnum.Optimism) {
                stakersFinal = stakers;
            } else if (filter === StakersFilterEnum.Arbitrum) {
                stakersFinal = stakersArb;
            } else {
                const mapToUse = new Map();
                stakersFinal = stakers;

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

                stakersFinal = stakersFinal.map((staker) => {
                    if (mapToUse.get(staker.id)) {
                        staker.totalStakedAmount = mapToUse.get(staker.id);
                    }
                    return staker;
                });
            }

            return orderBy(
                stakersFinal.filter((staker: Staker) => staker.totalStakedAmount >= 1),
                ['totalStakedAmount'],
                ['desc']
            );
        },
        {
            ...options,
        }
    );
};

export default useThalesStakersQuery;
