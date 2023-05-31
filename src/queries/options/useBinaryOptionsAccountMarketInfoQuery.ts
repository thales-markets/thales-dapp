import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { AccountMarketInfo } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { BALANCE_THRESHOLD } from 'constants/token';

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
                long:
                    bigNumberFormatter(result.balances.up) < BALANCE_THRESHOLD
                        ? 0
                        : bigNumberFormatter(result.balances.up),
                short:
                    bigNumberFormatter(result.balances.down) < BALANCE_THRESHOLD
                        ? 0
                        : bigNumberFormatter(result.balances.down),
            };
        },
        {
            ...options,
        }
    );
};

export default useBinaryOptionsAccountMarketInfoQuery;
