import { useQuery, UseQueryOptions } from 'react-query';
import dotenv from 'dotenv';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

dotenv.config();

export interface Competition {
    competition: [
        {
            trades: number;
            volume: number;
            netProfit: number;
            investment: number;
            gain: number;
        }
    ];
}

const useCompetitionQuery = (networkId: NetworkId, options?: UseQueryOptions<Competition>) => {
    return useQuery<Competition>(
        QUERY_KEYS.BinaryOptions.Competition(networkId),
        async () => {
            const baseUrl = 'https://api.thales.market/competition/' + networkId;
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            const competition = result.map((record: any) => {
                return {
                    walletAddress: record[0],
                    volume: record[1].volume,
                    trades: record[1].trades,
                    netProfit: record[1].netProfit,
                    investment: record[1].investment,
                    gain: record[1].gain,
                };
            });

            return { competition };
        },
        options
    );
};
export default useCompetitionQuery;
