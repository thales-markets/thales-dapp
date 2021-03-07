import React, { useMemo } from 'react';
import QUERY_KEYS from '../../../constants/queryKeys';
import MarketCreation from '../components/MarketCreation';
import { OptionsMarkets } from '../../../types/options';
import snxData from 'synthetix-data';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { sortOptionsMarkets } from '../../../utils/options';
import { RootState } from 'redux/rootReducer';
import { getAvailableSynthsMap } from 'redux/modules/synths';
import HotMarkets from '../components/HotMarkets';
import MarketsTable from '../components/MarketsTable';

const MAX_HOT_MARKETS = 4;

export const Options: React.FC = () => {
    const marketsQuery = useQuery<OptionsMarkets, any>(QUERY_KEYS.BinaryOptions.Markets, () =>
        snxData.binaryOptions.markets({ max: Infinity })
    );

    const synthsMap = useSelector((state: RootState) => getAvailableSynthsMap(state));
    const optionsMarkets = useMemo(
        () =>
            marketsQuery.isSuccess && Array.isArray(marketsQuery.data)
                ? sortOptionsMarkets(marketsQuery.data, synthsMap)
                : [],
        [marketsQuery, synthsMap]
    );

    const hotMarkets = useMemo(() => optionsMarkets.slice(0, MAX_HOT_MARKETS), [optionsMarkets]);
    return (
        <>
            <h1>Options</h1>
            <HotMarkets optionsMarkets={hotMarkets} />
            <MarketCreation />
            <MarketsTable optionsMarkets={optionsMarkets} />
        </>
    );
};

export default Options;
