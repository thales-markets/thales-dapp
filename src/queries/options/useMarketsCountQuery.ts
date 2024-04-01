import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';

type MaturityInfo = {
    maturity: string;
    count: number;
    positions: { position: string; count: number }[];
};

type MarketsCountType = { asset: string; count: number; byMaturity: MaturityInfo[] }[];

const useMarketsCountQuery = (networkId: Network, options?: UseQueryOptions<MarketsCountType>) => {
    return useQuery<MarketsCountType>(
        QUERY_KEYS.BinaryOptions.MarketsCount(networkId),
        async () => {
            try {
                const response = await axios.get(`${generalConfig.API_URL}/thales/networks/${networkId}/market-count`);

                if (response.data && response.data?.data) {
                    return response.data?.data;
                }
                return [];
            } catch (e) {
                console.log('Error ', e);
                return [];
            }
        },
        options
    );
};

export default useMarketsCountQuery;
