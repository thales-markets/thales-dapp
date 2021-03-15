import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, QueryClient } from 'react-query';
import BiddingPhaseCard from './BiddingPhaseCard';
import snxJSConnector from 'utils/snxJSConnector';
import { BINARY_OPTIONS_EVENTS } from 'constants/events';
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter } from 'utils/formatters';
import { AccountMarketInfo } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import { useMarketContext } from '../contexts/MarketContext';
import { useBOMContractContext } from '../contexts/BOMContractContext';
import TradingPhaseCard from './TradingPhaseCard';
import MaturityPhaseCard from './MaturityPhaseCard';

const queryClient = new QueryClient();

const TradeCard: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const optionsMarket = useMarketContext();
    const BOMContract = useBOMContractContext();

    const accountMarketInfoQuery = useQuery<AccountMarketInfo, any>(
        QUERY_KEYS.BinaryOptions.AccountMarketInfo(optionsMarket.address, walletAddress as string),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getAccountMarketData(
                optionsMarket.address,
                walletAddress
            );
            return {
                claimable: {
                    long: bigNumberFormatter(result.claimable.long),
                    short: bigNumberFormatter(result.claimable.short),
                },
                balances: {
                    long: bigNumberFormatter(result.balances.long),
                    short: bigNumberFormatter(result.balances.short),
                },
                bids: {
                    long: bigNumberFormatter(result.bids.long),
                    short: bigNumberFormatter(result.bids.short),
                },
            };
        },
        {
            enabled: isWalletConnected,
        }
    );

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

    useEffect(() => {
        const refetchQueries = () => {
            queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.Market(BOMContract.address));

            if (walletAddress) {
                queryClient.invalidateQueries(
                    QUERY_KEYS.BinaryOptions.AccountMarketInfo(optionsMarket.address, walletAddress as string)
                );
            }
        };
        BOMContract.on(BINARY_OPTIONS_EVENTS.BID, () => {
            refetchQueries();
        });
        BOMContract.on(BINARY_OPTIONS_EVENTS.REFUND, () => {
            refetchQueries();
        });

        if (walletAddress) {
            BOMContract.on(BINARY_OPTIONS_EVENTS.OPTIONS_CLAIMED, (account: string) => {
                if (walletAddress === account) {
                    refetchQueries();
                }
            });
            BOMContract.on(BINARY_OPTIONS_EVENTS.OPTIONS_EXERCISED, (account: string) => {
                if (walletAddress === account) {
                    refetchQueries();
                }
            });
        }
        return () => {
            BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.BID);
            BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.REFUND);
            if (walletAddress) {
                BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.OPTIONS_CLAIMED);
                BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.OPTIONS_EXERCISED);
            }
        };
    }, []);

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
