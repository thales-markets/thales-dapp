import React, { useMemo } from 'react';
import TileTable from 'components/TileTable';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import generateRows from './utils/generateRows';
import useUserTransactionsQuery from 'queries/user/useUserTransactions';
import { OptionsMarkets } from 'types/options';
import { keyBy } from 'lodash';
import { sortOptionsMarkets } from 'utils/options';

type HistoryProps = {
    markets?: OptionsMarkets;
};

const History: React.FC<HistoryProps> = ({ markets }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const allTx = useUserTransactionsQuery(networkId, walletAddress as any, { enabled: isAppReady });

    const rows = useMemo(() => {
        if (allTx.isSuccess && markets) {
            const optionsMarketsMap = keyBy(sortOptionsMarkets(markets), 'address');
            allTx.data.trades.map((trade: any) => {
                trade.marketItem = optionsMarketsMap[trade.market];
            });
            return generateRows(allTx.data.trades);
        }
        return [];
    }, [allTx.isSuccess, walletAddress, markets]);

    return <TileTable rows={rows} />;
};

export default History;
