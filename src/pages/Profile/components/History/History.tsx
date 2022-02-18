import React, { useMemo } from 'react';
import TileTable from '../../../../components/TileTable';
import useBinaryOptionsAllTradesQuery from '../../../../queries/options/useBinaryOptionsAllTradesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/rootReducer';
import { getNetworkId, getWalletAddress } from '../../../../redux/modules/wallet';
import { getIsAppReady } from '../../../../redux/modules/app';
import generateRows from './utils/generateRows';

const History: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const query = useBinaryOptionsAllTradesQuery(networkId, { enabled: isAppReady });

    const rows = useMemo(() => {
        if (query.isSuccess) {
            return generateRows(query.data, walletAddress);
        }
        return [];
    }, [query.isSuccess, query.data, walletAddress]);

    return <TileTable rows={rows} />;
};

export default History;
