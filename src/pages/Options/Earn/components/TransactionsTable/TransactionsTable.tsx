import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { LP_TOKEN, THALES_CURRENCY } from 'constants/currency';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/Table';
import { TokenTransaction, TokenTransactions, TransactionFilterEnum } from 'types/token';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { EMPTY_VALUE } from 'constants/placeholder';

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
                            <p>
                                {cellProps.cell.row.original.type !== TransactionFilterEnum.CANCEL_UNSTAKE
                                    ? formatCurrencyWithKey(
                                          cellProps.cell.row.original.type === TransactionFilterEnum.LP_STAKE ||
                                              cellProps.cell.row.original.type === TransactionFilterEnum.LP_UNSTAKE
                                              ? LP_TOKEN
                                              : THALES_CURRENCY,
                                          cellProps.cell.value
                                      )
                                    : EMPTY_VALUE}
                            </p>
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
