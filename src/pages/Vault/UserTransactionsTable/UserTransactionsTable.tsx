import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { formatTxTimestamp, formatCurrency, truncateAddress } from 'thales-utils';
import Table from 'components/TableV2';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { VaultUserTransaction, VaultUserTransactions } from 'types/vault';

type UserTransactionsTableProps = {
    transactions: VaultUserTransactions;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

const UserTransactionsTable: FC<UserTransactionsTableProps> = memo(({ transactions, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();

    return (
        <>
            <Table
                columns={[
                    {
                        Header: <>{t('vault.trades-history.table.date-time-col')}</>,
                        accessor: 'timestamp',
                        Cell: (cellProps: CellProps<VaultUserTransaction, VaultUserTransaction['timestamp']>) => (
                            <p>{formatTxTimestamp(cellProps.cell.value)}</p>
                        ),
                        sortable: true,
                    },
                    {
                        Header: <>{t('vault.trades-history.table.wallet-address')}</>,
                        accessor: 'account',
                        Cell: (cellProps: CellProps<VaultUserTransaction, VaultUserTransaction['account']>) => (
                            <p>{truncateAddress(cellProps.cell.value, 5)}</p>
                        ),
                        sortable: true,
                        sortType: 'alphanumeric',
                    },
                    {
                        Header: <>{t('vault.trades-history.table.type-col')}</>,
                        accessor: 'type',
                        Cell: (cellProps: CellProps<VaultUserTransaction, VaultUserTransaction['type']>) => (
                            <p>{t(`vault.user-transactions.type.${cellProps.cell.value}`)}</p>
                        ),
                        sortable: true,
                        sortType: 'alphanumeric',
                    },
                    {
                        Header: <>{t('vault.trades-history.table.amount-col')}</>,
                        accessor: 'amount',
                        Cell: (cellProps: CellProps<VaultUserTransaction, VaultUserTransaction['amount']>) => (
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
                        Header: <>{t('vault.trades-history.table.tx-status-col')}</>,
                        accessor: 'hash',
                        Cell: (cellProps: CellProps<VaultUserTransaction, VaultUserTransaction['hash']>) => (
                            <ViewEtherscanLink hash={cellProps.cell.value} />
                        ),
                    },
                ]}
                data={transactions}
                isLoading={isLoading}
                noResultsMessage={noResultsMessage}
                hidePagination
            />
        </>
    );
});

export default UserTransactionsTable;
