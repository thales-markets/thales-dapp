import React from 'react';
import { useSelector } from 'react-redux';
import BiddingPhaseCard from './BiddingPhaseCard';
import { AccountMarketInfo } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import { useMarketContext } from '../contexts/MarketContext';
import TradingPhaseCard from './TradingPhaseCard';
import MaturityPhaseCard from './MaturityPhaseCard';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { getIsAppReady } from 'redux/modules/app';

const TradeCard: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const optionsMarket = useMarketContext();

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const accountMarketInfo = {
        balances: {
            long: 0,
            short: 0,
        },
        claimable: {
            long: 0,
            short: 0,
        },
        bids: {
            long: 0,
            short: 0,
        },
    };

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        const { balances, claimable, bids } = accountMarketInfoQuery.data as AccountMarketInfo;

        accountMarketInfo.balances = balances;
        accountMarketInfo.claimable = claimable;
        accountMarketInfo.bids = bids;
    }

    const sharedProps = {
        optionsMarket,
        accountMarketInfo,
    };

    return (
        <>
            {optionsMarket.phase === 'bidding' && <BiddingPhaseCard {...sharedProps} />}
            {optionsMarket.phase === 'trading' && <TradingPhaseCard {...sharedProps} />}
            {optionsMarket.phase === 'maturity' && <MaturityPhaseCard {...sharedProps} />}
        </>
    );
};

export default TradeCard;
