import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/TableV2';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { formatCurrency } from 'utils/formatters/number';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { VaultsAndLiquidityPoolUserTransaction, VaultsAndLiquidityPoolUserTransactions } from 'types/liquidityPool';
import { getIsAppReady } from 'redux/modules/app';
import useUserVaultsAndLpTransactionsQuery from 'queries/user/useUserVaultsAndLpTransactionsQuery';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { ScreenSizeBreakpoint } from 'enums/ui';

export const UserVaultsAndLpTransactionsTable: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [userTransactions, setUserTransactions] = useState<VaultsAndLiquidityPoolUserTransactions>([]);

    const userTransactionsQuery = useUserVaultsAndLpTransactionsQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (userTransactionsQuery.isSuccess && userTransactionsQuery.data) {
            setUserTransactions(userTransactionsQuery.data);
        } else {
            setUserTransactions([]);
        }
    }, [userTransactionsQuery.isSuccess, userTransactionsQuery.data]);

    return (
        <Container>
            <TableContainer>
                <Table
                    columns={[
                        {
                            Header: <>{t('options.trading-profile.vaults-lp.date-time-col')}</>,
                            accessor: 'timestamp',
                            Cell: (
                                cellProps: CellProps<
                                    VaultsAndLiquidityPoolUserTransaction,
                                    VaultsAndLiquidityPoolUserTransaction['timestamp']
                                >
                            ) => <p>{formatTxTimestamp(cellProps.cell.value)}</p>,
                            sortable: true,
                        },
                        {
                            Header: <>{t('options.trading-profile.vaults-lp.name-col')}</>,
                            accessor: 'name',
                            Cell: (
                                cellProps: CellProps<
                                    VaultsAndLiquidityPoolUserTransaction,
                                    VaultsAndLiquidityPoolUserTransaction['name']
                                >
                            ) => (
                                <p>
                                    {cellProps.cell.value === 'lp'
                                        ? t(`options.trading-profile.vaults-lp.thales-lp-title`)
                                        : t(`vault.${cellProps.cell.value}.title`)}
                                </p>
                            ),
                            sortable: true,
                        },
                        {
                            Header: <>{t('options.trading-profile.vaults-lp.type-col')}</>,
                            accessor: 'type',
                            Cell: (
                                cellProps: CellProps<
                                    VaultsAndLiquidityPoolUserTransaction,
                                    VaultsAndLiquidityPoolUserTransaction['type']
                                >
                            ) => <p>{t(`vault.user-transactions.type.${cellProps.cell.value}`)}</p>,
                            sortable: true,
                            sortType: 'alphanumeric',
                        },
                        {
                            Header: <>{t('options.trading-profile.vaults-lp.amount-col')}</>,
                            accessor: 'amount',
                            Cell: (
                                cellProps: CellProps<
                                    VaultsAndLiquidityPoolUserTransaction,
                                    VaultsAndLiquidityPoolUserTransaction['amount']
                                >
                            ) => (
                                <>
                                    <p>
                                        {cellProps.cell.row.original.type === 'withdrawalRequest'
                                            ? '-'
                                            : `$${formatCurrency(cellProps.cell.value)}`}
                                    </p>
                                </>
                            ),
                            sortable: true,
                            sortType: 'basic',
                        },
                        {
                            Header: <>{t('options.trading-profile.vaults-lp.round-col')}</>,
                            accessor: 'round',
                            Cell: (
                                cellProps: CellProps<
                                    VaultsAndLiquidityPoolUserTransaction,
                                    VaultsAndLiquidityPoolUserTransaction['round']
                                >
                            ) => (
                                <p>{`${t('options.trading-profile.vaults-lp.round-label')} ${cellProps.cell.value}`}</p>
                            ),
                        },
                        {
                            Header: <>{t('options.trading-profile.vaults-lp.tx-status-col')}</>,
                            accessor: 'hash',
                            Cell: (
                                cellProps: CellProps<
                                    VaultsAndLiquidityPoolUserTransaction,
                                    VaultsAndLiquidityPoolUserTransaction['hash']
                                >
                            ) => <ViewEtherscanLink hash={cellProps.cell.value} />,
                        },
                    ]}
                    data={userTransactions}
                    isLoading={userTransactionsQuery.isLoading}
                    hidePagination
                    noResultsMessage={t('options.trading-profile.vaults-lp.no-transactions')}
                />
            </TableContainer>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    position: relative;
    max-height: 315px;
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-height: 1100px;
    }
`;

const TableContainer = styled(FlexDivColumn)`
    overflow: auto;
`;

export default UserVaultsAndLpTransactionsTable;
