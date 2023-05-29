import TileTable from 'components/TileTable';
import { currencyKeyToCoinGeckoIndexMap, currencyKeyToNameMap } from 'constants/currency';
import { keyBy } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTheme } from 'styled-components';
import { OptionsMarkets } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { sortOptionsMarkets } from 'utils/options';
import generateRows from './utils/generateRows';

type HistoryProps = {
    markets?: OptionsMarkets;
    trades: [];
    searchText: string;
    isLoading?: boolean;
};

const History: React.FC<HistoryProps> = ({ markets, trades, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

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
                t,
                theme
            );
        }
        return [];
    }, [trades, walletAddress, markets, searchText]);

    return <TileTable rows={rows as any} isLoading={isLoading} />;
};

export default History;
