import React, { useMemo } from 'react';
import TileTable from 'components/TileTable';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import generateRows from './utils/generateRows';
import { OptionsMarkets } from 'types/options';
import { keyBy } from 'lodash';
import { sortOptionsMarkets } from 'utils/options';
import { currencyKeyToCoinGeckoIndexMap, currencyKeyToNameMap } from 'constants/currency';

type HistoryProps = {
    markets?: OptionsMarkets;
    trades: [];
    searchText: string;
    isLoading?: boolean;
};

const History: React.FC<HistoryProps> = ({ markets, trades, searchText, isLoading }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const { t } = useTranslation();

    const rows = useMemo(() => {
        if (trades.length > 0 && markets) {
            const optionsMarketsMap = keyBy(sortOptionsMarkets(markets), 'address');
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
                t
            );
        }
        return [];
    }, [trades, walletAddress, markets, searchText]);

    return <TileTable rows={rows as any} isLoading={isLoading} />;
};

export default History;
