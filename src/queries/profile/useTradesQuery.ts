import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import thalesData from 'thales-data';
import { Trades } from 'types/options';

const useTradesQuery = (networkId: Network, walletAddress: string, options?: UseQueryOptions<Trades>) => {
    return useQuery<Trades>(
        QUERY_KEYS.Profile.Trades(walletAddress, networkId),
        () =>
            thalesData.binaryOptions.trades({
                taker: walletAddress,
                network: networkId,
            }),
        options
    );
};

export default useTradesQuery;
