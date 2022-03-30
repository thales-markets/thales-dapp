import Table from 'components/TableV2';
import { USD_SIGN } from 'constants/currency';

import useLeaderboardQuery from 'queries/leaderboard/useLeaderboardQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';

const Leaderboard: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const query = useLeaderboardQuery(networkId, { enabled: isAppReady });
    const data = query.isSuccess ? query.data : [];
    return (
        <Table
            data={data}
            columns={[
                {
                    Header: t('options.leaderboard.address'),
                    accessor: 'walletAddress',
                },
                {
                    Header: t('options.leaderboard.table.trades-col'),
                    accessor: 'trades',
                },

                {
                    Header: t('options.leaderboard.table.volume-col'),
                    accessor: 'volume',
                    Cell: (cellProps: any) => <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>,
                },
                {
                    Header: t('options.leaderboard.table.netprofit-col'),
                    accessor: 'profit',
                    Cell: (cellProps: any) => <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>,
                },
                {
                    Header: t('options.leaderboard.table.investment-col'),
                    accessor: 'investment',
                    Cell: (cellProps: any) => <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>,
                },
                {
                    Header: t('options.leaderboard.table.gain-col'),
                    accessor: 'gain',
                    Cell: (cellProps: any) => <p>{formatPercentage(cellProps.cell.value)}</p>,
                },
            ]}
        />
    );
};

export default Leaderboard;
