import { useQuery } from 'react-query';
import { compact } from 'lodash';
import { ethers } from 'ethers';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey } from 'constants/currency';
import snxJSConnector from 'utils/snxJSConnector';

export type FrozenSynths = Set<CurrencyKey>;

const useFrozenSynthsQuery = () => {
    return useQuery<FrozenSynths>(
        QUERY_KEYS.Synths.FrozenSynths,
        async () => {
            const frozenSynths = await snxJSConnector.synthSummaryUtilContract.frozenSynths();

            return new Set<CurrencyKey>([
                ...compact(frozenSynths.map(ethers.utils.parseBytes32String)),
            ] as CurrencyKey[]);
        },
        {
            enabled: snxJSConnector.initialized,
        }
    );
};

export default useFrozenSynthsQuery;
