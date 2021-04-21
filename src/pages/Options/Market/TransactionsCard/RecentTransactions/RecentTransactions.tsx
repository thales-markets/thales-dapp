import React from 'react';
import { OptionsMarketInfo } from 'types/options';
import useBinaryOptionsTransactionsQuery from 'queries/options/useBinaryOptionsTransactionsQuery';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { useMarketContext } from '../../contexts/MarketContext';
import useBinaryOptionsTradesQuery from 'queries/options/useBinaryOptionsTradesQuery';
import TransactionsWithFilters from '../components/TransactionsWithFilters';
import { getIsAppReady } from 'redux/modules/app';

type RecentTransactionsProps = {
    marketAddress: OptionsMarketInfo['address'];
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ marketAddress }) => {
    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isTradingEnabled = optionsMarket.phase === 'trading' || optionsMarket.phase === 'maturity';

    const marketTransactionsQuery = useBinaryOptionsTransactionsQuery(marketAddress, networkId, {
        enabled: isAppReady,
    });
    const tradesQuery = useBinaryOptionsTradesQuery(
        marketAddress,
        optionsMarket.longAddress,
        optionsMarket.shortAddress,
        networkId,
        { enabled: isAppReady && isTradingEnabled }
    );

    return (
        <TransactionsWithFilters
            marketTransactions={marketTransactionsQuery.data || []}
            tradesTransactions={tradesQuery.data || []}
            isLoading={marketTransactionsQuery.isLoading || tradesQuery.isLoading}
            type="recent-activity"
        />
    );
};

export default RecentTransactions;
