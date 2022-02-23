import React, { useMemo } from 'react';
import TileTable from 'components/TileTable';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import generateRows from './utils/generateRows';
import { OptionsMarkets } from 'types/options';
import { keyBy } from 'lodash';
import { sortOptionsMarkets } from 'utils/options';

type HistoryProps = {
    markets?: OptionsMarkets;
    trades: [];
};

const History: React.FC<HistoryProps> = ({ markets, trades }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

    const rows = useMemo(() => {
        if (trades.length > 0 && markets) {
            const optionsMarketsMap = keyBy(sortOptionsMarkets(markets), 'address');
            trades.map((trade: any) => {
                trade.marketItem = optionsMarketsMap[trade.market];
            });
            return generateRows(trades);
        }
        return [];
    }, [trades, walletAddress, markets]);

    return <TileTable rows={rows} />;
};

export default History;
