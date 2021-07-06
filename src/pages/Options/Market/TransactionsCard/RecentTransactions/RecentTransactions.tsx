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
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetHeader from '../../components/MarketWidget/MarketWidgetHeader';
import MarketWidgetContent from '../../components/MarketWidget/MarketWidgetContent';
import { uniqBy } from 'lodash';

type RecentTransactionsProps = {
    marketAddress: OptionsMarketInfo['address'];
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ marketAddress }) => {
    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketTransactionsQuery = useBinaryOptionsTransactionsQuery(marketAddress, networkId, {
        enabled: isAppReady,
    });
    const tradesQuery = useBinaryOptionsTradesQuery(
        marketAddress,
        optionsMarket.longAddress,
        optionsMarket.shortAddress,
        networkId,
        { enabled: isAppReady }
    );

    const marketTransactions = uniqBy(marketTransactionsQuery.data || [], (transaction) => transaction.hash);

    return (
        <>
            <MarketWidgetHeader widgetKey={MarketWidgetKey.RECENT_TRANSACTIONS}></MarketWidgetHeader>
            <MarketWidgetContent>
                <TransactionsWithFilters
                    marketTransactions={marketTransactions}
                    tradesTransactions={tradesQuery.data || []}
                    isLoading={marketTransactionsQuery.isLoading || tradesQuery.isLoading}
                    type="recent-activity"
                    isTrading={optionsMarket.phase === 'trading'}
                />
            </MarketWidgetContent>
        </>
    );
};

export default RecentTransactions;
