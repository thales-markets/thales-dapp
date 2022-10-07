import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import { generalConfig } from 'config/general';

export type UsersAmmBuyVolume = {
    rewards: [
        {
            address: string;
            upInfo: any;
            downInfo: any;
            rangedInfo: any;
            staking: number;
            discountedInfo: any;
            totalRewards: any;
        }
    ];
};

const useUsersAmmBuyVolumeQuery = (
    networkId: NetworkId,
    period: number,
    options?: UseQueryOptions<UsersAmmBuyVolume>
) => {
    return useQuery<UsersAmmBuyVolume>(
        QUERY_KEYS.Token.UsersAmmBuyVolume(networkId, period),
        async () => {
            const baseUrl = `${generalConfig.API_URL}/rewards/${networkId}/${period}`;
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            const rewards = result.map((record: any) => {
                return {
                    address: record.address,
                    upInfo: record.up,
                    downInfo: record.down,
                    rangedInfo: record.ranged,
                    discountedInfo: record.discounted,
                    staking: record.stackingRewards,
                    totalRewards: record.totalRewards,
                };
            });

            return { rewards };
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useUsersAmmBuyVolumeQuery;
