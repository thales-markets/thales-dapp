import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { THALES_CURRENCY } from 'constants/currency';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/Table';
import { ClaimTransaction, ClaimTransactions } from 'types/token';
import ViewEtherscanLink from 'components/ViewEtherscanLink';

type TransactionsTableProps = {
    transactions: ClaimTransactions;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

export const TransactionsTable: FC<TransactionsTableProps> = memo(({ transactions, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();
    return (
        <>
            <Table
                columns={[
                    {
                        Header: <>{t('options.earn.snx-stakers.table.date-time-col')}</>,
                        accessor: 'timestamp',
                        Cell: (cellProps: CellProps<ClaimTransaction, ClaimTransaction['timestamp']>) => (
                            <p>{formatTxTimestamp(cellProps.cell.value)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.earn.snx-stakers.table.type-col')}</>,
                        accessor: 'type',
                        Cell: (cellProps: CellProps<ClaimTransaction, ClaimTransaction['type']>) => (
                            <p>{t(`options.earn.snx-stakers.table.types.${cellProps.cell.value}`)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.earn.snx-stakers.table.amount-col')}</>,
                        sortType: 'basic',
                        accessor: 'amount',
                        Cell: (cellProps: CellProps<ClaimTransaction, ClaimTransaction['amount']>) => (
                            <p>{formatCurrencyWithKey(THALES_CURRENCY, cellProps.cell.value)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.earn.snx-stakers.table.tx-status-col')}</>,
                        id: 'tx-status',
                        Cell: (cellProps: CellProps<ClaimTransaction>) => (
                            // cellProps.cell.row.original.status && cellProps.cell.row.original.status === 'pending' ? (
                            //     <span>{t('common.tx-status.pending')}</span>
                            // ) : (
                            <ViewEtherscanLink hash={cellProps.cell.row.original.hash} />
                        ),
                        // ),
                        width: 150,
                    },
                ]}
                data={transactions}
                isLoading={isLoading}
                noResultsMessage={noResultsMessage}
            />
        </>
    );
});

export default TransactionsTable;
