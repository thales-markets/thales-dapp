import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RecentTransactions from './RecentTransactions';
import YourTransactions from './YourTransactions';
import { useMarketContext } from '../contexts/MarketContext';
import { Accordion } from 'semantic-ui-react';
import { getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';

const TransactionsCard: React.FC = () => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const panels1 = [
        {
            key: `panel-1`,
            title: t('options.market.transactions-card.recent-market-tab-title'),
            content: {
                content: <RecentTransactions marketAddress={optionsMarket.address} />,
            },
        },
    ];

    const panels2 = [
        {
            key: `panel-2`,
            title: t('options.market.transactions-card.your-activity-tab-title'),
            content: {
                content: <YourTransactions marketAddress={optionsMarket.address} walletAddress={walletAddress} />,
            },
        },
    ];

    return (
        <>
            <div style={{ marginBottom: 10 }}>
                <Accordion panels={panels1} exclusive={false} fluid styled />
            </div>
            {isWalletConnected && (
                <div style={{ marginBottom: 10 }}>
                    <Accordion panels={panels2} exclusive={false} fluid styled />
                </div>
            )}
        </>
    );
};

export default TransactionsCard;
