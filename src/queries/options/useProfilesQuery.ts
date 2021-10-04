import { useQuery, UseQueryOptions } from 'react-query';
import dotenv from 'dotenv';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

dotenv.config();

export interface Profiles {
    profiles: Map<
        string,
        {
            mints: [];
            trades: [];
            excercises: [];
            unclaimed: [];
        }
    >;
}

const userProfilesQuery = (networkId: NetworkId, options?: UseQueryOptions<Profiles>) => {
    return useQuery<Profiles>(
        QUERY_KEYS.BinaryOptions.Profiles(networkId),
        async () => {
            const baseUrl = 'https://api.thales.market/profiles/' + networkId;
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            const profiles = new Map();
            result.map((record: any) => {
                profiles.set(record[0].toString().toLowerCase().trim(), {
                    mints: record[1].mints,
                    trades: record[1].trades,
                    excercises: record[1].excercises,
                    unclaimed: record[1].unclaimed,
                });
            });

            return { profiles };
        },
        options
    );
};
export default userProfilesQuery;
