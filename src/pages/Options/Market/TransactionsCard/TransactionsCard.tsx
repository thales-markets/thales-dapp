import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RecentTransactions from './RecentTransactions';
import YourTransactions from './YourTransactions';
import { useMarketContext } from '../contexts/MarketContext';
import PendingTransactions from './PendingTransactions';
import { Menu } from 'semantic-ui-react';
import { getCurrentWalletAddress, getIsWalletConnected } from 'redux/modules/wallet/walletDetails';
import { RootState } from 'redux/rootReducer';

const TransactionsCard: React.FC = () => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const walletAddress = useSelector((state: RootState) => getCurrentWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const tabContent: Array<{
        id: 'recent-transactions' | 'your-transactions' | 'pending-transactions';
        name: string;
        isDisabled: boolean;
    }> = useMemo(
        () => [
            {
                id: 'recent-transactions',
                name: t('options.market.transactions-card.recent-market-tab-title'),
                isDisabled: false,
            },
            {
                id: 'your-transactions',
                name: t('options.market.transactions-card.your-activity-tab-title'),
                isDisabled: !isWalletConnected,
            },
            {
                id: 'pending-transactions',
                name: t('options.market.transactions-card.pending-transactions-tab-title'),
                isDisabled: !isWalletConnected,
            },
        ],
        [t, isWalletConnected]
    );

    const [activeTab, setActiveTab] = useState(tabContent[0]);

    return (
        <>
            <Menu tabular>
                {tabContent.map((tab) => (
                    <Menu.Item
                        disabled={tab.isDisabled}
                        key={tab.id}
                        onClick={() => setActiveTab(tab)}
                        active={tab.id === activeTab.id}
                        name={tab.id}
                    >
                        {tab.name}
                    </Menu.Item>
                ))}
            </Menu>
            {activeTab.id === 'recent-transactions' && <RecentTransactions marketAddress={optionsMarket.address} />}
            {activeTab.id === 'your-transactions' && (
                <YourTransactions marketAddress={optionsMarket.address} walletAddress={walletAddress} />
            )}
            {activeTab.id === 'pending-transactions' && (
                <PendingTransactions marketAddress={optionsMarket.address} walletAddress={walletAddress} />
            )}
        </>
    );
};

export default TransactionsCard;
