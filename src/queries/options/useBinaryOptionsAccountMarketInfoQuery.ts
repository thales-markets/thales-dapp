import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { AccountMarketInfo } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters';

const useBinaryOptionsAccountMarketInfoQuery = (
    marketAddress: string,
    walletAddress: string,
    options?: UseQueryOptions<AccountMarketInfo>
) => {
    return useQuery<AccountMarketInfo>(
        QUERY_KEYS.BinaryOptions.AccountMarketInfo(marketAddress, walletAddress),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getAccountMarketData(
                marketAddress,
                walletAddress
            );
            return {
                claimable: {
                    long: bigNumberFormatter(result.claimable.long),
                    short: bigNumberFormatter(result.claimable.short),
                },
                balances: {
                    long: bigNumberFormatter(result.balances.long),
                    short: bigNumberFormatter(result.balances.short),
                },
                bids: {
                    long: bigNumberFormatter(result.bids.long),
                    short: bigNumberFormatter(result.bids.short),
                },
            };
        },
        options
    );
};

export default useBinaryOptionsAccountMarketInfoQuery;
