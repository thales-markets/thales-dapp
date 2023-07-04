import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { generalConfig } from 'config/general';

type UsersAmmBuyVolume = {
    rewards: [
        {
            address: string;
            itmInfo: any;
            otmInfo: any;
            totalRewards: any;
        }
    ];
};

const useUsersAmmBuyVolumeQuery = (
    networkId: Network,
    period: number,
    options?: UseQueryOptions<UsersAmmBuyVolume>
) => {
    return useQuery<UsersAmmBuyVolume>(
        QUERY_KEYS.User.UsersAmmBuyVolume(networkId, period),
        async () => {
            const baseUrl = `${generalConfig.API_URL}/rewardsv2/${networkId}/${period}`;
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            const rewards = result.map((record: any) => {
                return {
                    address: record.address,
                    itmInfo: record.itm,
                    otmInfo: record.otm,
                    totalRewards: record.totalRewards,
                };
            });

            return { rewards };
        },
        {
            ...options,
        }
    );
};

export default useUsersAmmBuyVolumeQuery;
