import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { StakersFilterEnum } from 'enums/governance';
import { Network } from 'enums/network';
import { orderBy } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';
import { Staker, Stakers } from 'types/governance';

const useThalesStakersQuery = (filter: StakersFilterEnum, options?: UseQueryOptions<Stakers>) => {
    return useQuery<Stakers>(
        QUERY_KEYS.Governance.ThalesStakers(filter),
        async () => {
            const [stakers, stakersArb, stakersBase] = await Promise.all([
                axios.get(`${generalConfig.API_URL}/v1/stakers/${Network.OptimismMainnet}`),
                axios.get(`${generalConfig.API_URL}/v1/stakers/${Network.Arbitrum}`),
                axios.get(`${generalConfig.API_URL}/v1/stakers/${Network.Base}`),
            ]);

            let stakersFinal: Stakers = [];
            if (filter === StakersFilterEnum.Optimism) {
                stakersFinal = stakers?.data;
            } else if (filter === StakersFilterEnum.Arbitrum) {
                stakersFinal = stakersArb?.data;
            } else if (filter === StakersFilterEnum.Base) {
                stakersFinal = stakersBase?.data;
            } else {
                const mapToUse = new Map();
                stakersFinal = stakers?.data;

                [...stakers?.data].map((staker: Staker) => {
                    mapToUse.set(staker.id, staker.totalStakedAmount);
                });

                stakersArb?.data.map((staker: Staker) => {
                    if (mapToUse.get(staker.id)) {
                        mapToUse.set(staker.id, staker.totalStakedAmount + mapToUse.get(staker.id));
                    } else {
                        stakersFinal.push(staker);
                    }
                });

                stakersBase?.data.map((staker: Staker) => {
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
                stakersFinal.filter((staker: Staker) => staker.totalStakedAmount > 0),
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
