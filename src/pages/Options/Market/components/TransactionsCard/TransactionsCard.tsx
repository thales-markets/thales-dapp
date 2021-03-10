import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RecentTransactions from './RecentTransactions';
import YourTransactions from './YourTransactions';
import { useMarketContext } from '../../contexts/MarketContext';
import PendingTransactions from './PendingTransactions';
import { Card, Tab } from 'semantic-ui-react';
import { getCurrentWalletAddress } from 'redux/modules/wallet/walletDetails';
import { RootState } from 'redux/rootReducer';

const TransactionsCard: React.FC = () => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const walletAddress = useSelector((state: RootState) => getCurrentWalletAddress(state)) || '';
    //const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const panes = [
        {
            menuItem: t('options.market.transactions-card.recent-market-tab-title'),
            render: () => (
                <Tab.Pane>
                    <RecentTransactions marketAddress={optionsMarket.address} />
                </Tab.Pane>
            ),
        },
        {
            menuItem: t('options.market.transactions-card.your-activity-tab-title'),
            render: () => (
                <Tab.Pane>
                    <YourTransactions marketAddress={optionsMarket.address} walletAddress={walletAddress} />
                </Tab.Pane>
            ),
        },
        {
            menuItem: t('options.market.transactions-card.pending-transactions-tab-title'),
            render: () => (
                <Tab.Pane>
                    <PendingTransactions marketAddress={optionsMarket.address} walletAddress={walletAddress} />
                </Tab.Pane>
            ),
        },
    ];

    return (
        <Card fluid>
            <Card.Content>
                <Card.Description>
                    <Tab panes={panes} />
                </Card.Description>
            </Card.Content>
        </Card>
    );
};

export default TransactionsCard;
