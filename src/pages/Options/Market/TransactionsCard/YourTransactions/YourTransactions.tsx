import React, { useMemo } from 'react';
import { OptionsMarketInfo } from 'types/options';
import useBinaryOptionsUserTransactionsQuery from 'queries/options/useBinaryOptionsUserTransactionsQuery';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { getOptionsPendingTransactions } from 'redux/modules/options';
import { uniqBy } from 'lodash';
import { useMarketContext } from '../../contexts/MarketContext';
import useBinaryOptionsUserTradesQuery from 'queries/options/useBinaryOptionsUserTradesQuery';
import TransactionsWithFilters from '../components/TransactionsWithFilters';
import MarketWidgetHeader from '../../components/MarketWidget/MarketWidgetHeader';
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetContent from '../../components/MarketWidget/MarketWidgetContent';

type YourTransactionsProps = {
    marketAddress: OptionsMarketInfo['address'];
    walletAddress: string;
};

const YourTransactions: React.FC<YourTransactionsProps> = ({ marketAddress, walletAddress }) => {
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const pendingTransactions = useSelector((state: RootState) => getOptionsPendingTransactions(state));
    const isTradingEnabled = optionsMarket.phase === 'trading' || optionsMarket.phase === 'maturity';

    const marketTransactionsQuery = useBinaryOptionsUserTransactionsQuery(marketAddress, walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const tradesQuery = useBinaryOptionsUserTradesQuery(
        marketAddress,
        optionsMarket.longAddress,
        optionsMarket.shortAddress,
        networkId,
        walletAddress,
        { enabled: isAppReady && isTradingEnabled }
    );

    const marketTransactions = useMemo(() => {
        const filteredPendingTransactions = pendingTransactions.filter(
            ({ market, account }) => market === marketAddress && walletAddress === account
        );
        const myTransactions = marketTransactionsQuery.data || [];

        const transactions = uniqBy(
            [...filteredPendingTransactions, ...myTransactions],
            (transaction) => transaction.hash
        );

        return transactions;
    }, [marketTransactionsQuery.data, pendingTransactions, marketAddress, walletAddress]);

    return (
        <>
            <MarketWidgetHeader widgetKey={MarketWidgetKey.YOUR_TRANSACTIONS}></MarketWidgetHeader>
            <MarketWidgetContent>
                <TransactionsWithFilters
                    marketTransactions={marketTransactions}
                    tradesTransactions={tradesQuery.data || []}
                    isLoading={marketTransactionsQuery.isLoading || tradesQuery.isLoading}
                    type="your-activity"
                />
            </MarketWidgetContent>
        </>
    );
};

export default YourTransactions;
