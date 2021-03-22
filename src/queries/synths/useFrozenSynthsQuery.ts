import { useQuery, UseQueryOptions } from 'react-query';
import { compact } from 'lodash';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey } from 'constants/currency';
import snxJSConnector from 'utils/snxJSConnector';
import { bytesFormatter } from 'utils/formatters/ethers';

export type FrozenSynths = Set<CurrencyKey>;

const useFrozenSynthsQuery = (options?: UseQueryOptions<FrozenSynths>) => {
    return useQuery<FrozenSynths>(
        QUERY_KEYS.Synths.FrozenSynths,
        async () => {
            const frozenSynths = await snxJSConnector.synthSummaryUtilContract.frozenSynths();

            return new Set<CurrencyKey>([...compact(frozenSynths.map(bytesFormatter))] as CurrencyKey[]);
        },
        {
            enabled: snxJSConnector.initialized,
            ...options,
        }
    );
};

export default useFrozenSynthsQuery;
