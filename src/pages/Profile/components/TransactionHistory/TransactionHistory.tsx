import TileTable from 'components/TileTable';
import { currencyKeyToCoinGeckoIndexMap, currencyKeyToNameMap } from 'constants/currency';
import { keyBy } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTheme } from 'styled-components';
import { OptionsMarkets } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { sortOptionsMarkets } from 'utils/options';
import generateRows from './utils/generateRows';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';
import { getIsAppReady } from 'redux/modules/app';

type TransactionHistoryProps = {
    markets?: OptionsMarkets;
    trades: [];
    searchText: string;
    isLoading?: boolean;
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ markets, trades, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

    const rangedTrades = trades
        .filter((trade: any) => trade.optionSide === 'in' || trade.optionSide === 'out')
        .map((trade: any) => trade.market);

    const rangedMarketsQuery = useRangedMarketsQuery(networkId, rangedTrades, {
        enabled: isAppReady && rangedTrades.length > 0,
    });
    const rangedMarkets = rangedMarketsQuery.isSuccess ? rangedMarketsQuery.data : [];
    const allMarkets = [...(markets as any), ...rangedMarkets];

    const rows = useMemo(() => {
        if (trades.length > 0 && markets) {
            const optionsMarketsMap = keyBy(sortOptionsMarkets(allMarkets), 'address');
            return generateRows(
                trades
                    .map((trade: any) => ({
                        ...trade,
                        marketItem: optionsMarketsMap[trade.market],
                    }))
                    .filter((trade: any) => {
                        if (!trade?.marketItem) return false;

                        const search = searchText.toLowerCase();
                        const tradeValue = `${trade?.marketItem?.currencyKey} ${
                            currencyKeyToCoinGeckoIndexMap[trade?.marketItem?.asset?.toUpperCase()]
                        } ${currencyKeyToNameMap[trade?.marketItem?.asset?.toUpperCase()]}`.toLowerCase();
                        return !searchText || tradeValue.includes(search);
                    }),
                t,
                theme
            );
        }
        return [];
    }, [trades, walletAddress, markets, searchText]);

    return (
        <TileTable
            rows={rows as any}
            isLoading={isLoading || rangedMarketsQuery.isLoading}
            defaultFlowColor={theme.background.tertiary}
        />
    );
};

export default TransactionHistory;
