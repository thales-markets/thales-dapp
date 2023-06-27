import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/TableV2';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { formatCurrency } from 'utils/formatters/number';
import { LiquidityPoolUserTransaction, LiquidityPoolUserTransactions } from 'types/liquidityPool';
import { truncateAddress } from 'utils/formatters/string';

type UserTransactionsTableProps = {
    transactions: LiquidityPoolUserTransactions;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

const UserTransactionsTable: FC<UserTransactionsTableProps> = memo(({ transactions, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();

    return (
        <Table
            columns={[
                {
                    Header: <>{t('vault.trades-history.table.date-time-col')}</>,
                    accessor: 'timestamp',
                    Cell: (
                        cellProps: CellProps<LiquidityPoolUserTransaction, LiquidityPoolUserTransaction['timestamp']>
                    ) => <p>{formatTxTimestamp(cellProps.cell.value)}</p>,
                    sortable: true,
                },
                {
                    Header: <>{t('vault.trades-history.table.wallet-address')}</>,
                    accessor: 'account',
                    Cell: (
                        cellProps: CellProps<LiquidityPoolUserTransaction, LiquidityPoolUserTransaction['account']>
                    ) => <p>{truncateAddress(cellProps.cell.value, 5)}</p>,
                    sortable: true,
                    sortType: 'alphanumeric',
                },
                {
                    Header: <>{t('vault.trades-history.table.type-col')}</>,
                    accessor: 'type',
                    Cell: (
                        cellProps: CellProps<LiquidityPoolUserTransaction, LiquidityPoolUserTransaction['type']>
                    ) => <p>{t(`liquidity-pool.user-transactions.type.${cellProps.cell.value}`)}</p>,
                    width: 150,
                    sortable: true,
                    sortType: 'alphanumeric',
                },
                {
                    Header: <>{t('vault.trades-history.table.amount-col')}</>,
                    accessor: 'amount',
                    Cell: (
                        cellProps: CellProps<LiquidityPoolUserTransaction, LiquidityPoolUserTransaction['amount']>
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
                    Header: <>{t('vault.trades-history.table.tx-status-col')}</>,
                    accessor: 'hash',
                    Cell: (
                        cellProps: CellProps<LiquidityPoolUserTransaction, LiquidityPoolUserTransaction['hash']>
                    ) => <ViewEtherscanLink hash={cellProps.cell.value} />,
                    width: 150,
                },
            ]}
            data={transactions}
            isLoading={isLoading}
            noResultsMessage={noResultsMessage}
            hidePagination
        />
    );
});

export default UserTransactionsTable;
