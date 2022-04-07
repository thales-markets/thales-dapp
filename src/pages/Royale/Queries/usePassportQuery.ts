import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import { NetworkId } from 'utils/network';

export type RoyalePassport = {
    id: number | null;
};

const useRoyalePasportQuery = (
    walletAddress: string,
    networkId: NetworkId,
    season: number,
    options?: UseQueryOptions<RoyalePassport[]>
) => {
    return useQuery<RoyalePassport[]>(
        QUERY_KEYS.Royale.RoyalePassport(walletAddress, networkId, season),
        async () => {
            const passports = await thalesData.binaryOptions.thalesRoyalePassportPlayers({
                owner: walletAddress,
                network: networkId,
                season,
            });

            return passports;
        },
        {
            refetchInterval: 3000,
            ...options,
        }
    );
};

export default useRoyalePasportQuery;
