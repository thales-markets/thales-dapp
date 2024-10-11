import { POSITION_BALANCE_THRESHOLD } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter } from 'thales-utils';
import { AccountMarketInfo } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { getContractForInteraction } from '../../utils/options';

const useBinaryOptionsAccountMarketInfoQuery = (
    marketAddress: string,
    walletAddress: string,
    networkId: number,
    isDeprecatedCurrency: boolean,
    options?: UseQueryOptions<AccountMarketInfo>
) => {
    return useQuery<AccountMarketInfo>(
        QUERY_KEYS.BinaryOptions.UserMarketPositions(marketAddress, walletAddress),
        async () => {
            const { binaryOptionsMarketDataContract, binaryOptionsMarketDataUSDCContract } = snxJSConnector;
            const binaryOptionsMarketDataContractForInteraction = getContractForInteraction(
                networkId,
                isDeprecatedCurrency,
                binaryOptionsMarketDataContract,
                binaryOptionsMarketDataUSDCContract
            );

            const result = await binaryOptionsMarketDataContractForInteraction?.getAccountMarketData(
                marketAddress,
                walletAddress
            );

            return {
                long:
                    bigNumberFormatter(result.balances.up) < POSITION_BALANCE_THRESHOLD
                        ? 0
                        : bigNumberFormatter(result.balances.up),
                short:
                    bigNumberFormatter(result.balances.down) < POSITION_BALANCE_THRESHOLD
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
