import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { THALES_CURRENCY } from 'constants/currency';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/Table';
import { TokenTransaction, TokenTransactions } from 'types/token';
import ViewEtherscanLink from 'components/ViewEtherscanLink';

type TransactionsTableProps = {
    transactions: TokenTransactions;
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
                        Header: <>{t('options.earn.table.date-time-col')}</>,
                        accessor: 'timestamp',
                        Cell: (cellProps: CellProps<TokenTransaction, TokenTransaction['timestamp']>) => (
                            <p>{formatTxTimestamp(cellProps.cell.value)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.earn.table.type-col')}</>,
                        accessor: 'type',
                        Cell: (cellProps: CellProps<TokenTransaction, TokenTransaction['type']>) => (
                            <p>{t(`options.earn.table.types.${cellProps.cell.value}`)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.earn.table.amount-col')}</>,
                        sortType: 'basic',
                        accessor: 'amount',
                        Cell: (cellProps: CellProps<TokenTransaction, TokenTransaction['amount']>) => (
                            <p>{formatCurrencyWithKey(THALES_CURRENCY, cellProps.cell.value)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.earn.table.tx-status-col')}</>,
                        id: 'tx-status',
                        Cell: (cellProps: CellProps<TokenTransaction>) => (
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
