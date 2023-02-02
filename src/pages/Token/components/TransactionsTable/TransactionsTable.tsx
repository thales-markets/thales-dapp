import React, { FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { CRYPTO_CURRENCY_MAP, LP_TOKEN, THALES_CURRENCY } from 'constants/currency';
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

    const amountSort = useMemo(
        () => (rowA: any, rowB: any, columnId: any, desc: any) => {
            let a = rowA.values[columnId];
            let b = rowB.values[columnId];

            if (a === 0) {
                // Zeros to bottom
                a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }
            if (b === 0) {
                b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }
            return a > b ? 1 : a < b ? -1 : 0;
        },
        []
    );

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
                            <p>
                                {t(
                                    `options.earn.table.types.${
                                        cellProps.cell.value === TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS_SECOND
                                            ? TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS
                                            : cellProps.cell.value
                                    }`
                                ).toUpperCase()}
                            </p>
                        ),
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.earn.table.amount-col')}</>,
                        sortType: amountSort,
                        accessor: 'amount',
                        Cell: (cellProps: CellProps<TokenTransaction, TokenTransaction['amount']>) => (
                            <p>
                                {cellProps.cell.row.original.type !== TransactionFilterEnum.CANCEL_UNSTAKE &&
                                cellProps.cell.row.original.type !== TransactionFilterEnum.MERGE_ACCOUNT &&
                                cellProps.cell.row.original.type !== TransactionFilterEnum.DELEGATE_VOLUME &&
                                cellProps.cell.row.original.type !== TransactionFilterEnum.REMOVE_DELEGATION
                                    ? formatCurrencyWithKey(
                                          cellProps.cell.row.original.type === TransactionFilterEnum.LP_STAKE ||
                                              cellProps.cell.row.original.type === TransactionFilterEnum.LP_UNSTAKE
                                              ? LP_TOKEN
                                              : cellProps.cell.row.original.type ===
                                                TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS_SECOND
                                              ? CRYPTO_CURRENCY_MAP.OP
                                              : THALES_CURRENCY,
                                          cellProps.cell.value
                                      )
                                    : EMPTY_VALUE}
                            </p>
                        ),
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.earn.table.tx-status-col')}</>,
                        id: 'tx-status',
                        Cell: (cellProps: CellProps<TokenTransaction>) => (
                            <ViewEtherscanLink hash={cellProps.cell.row.original.hash} />
                        ),
                    },
                ]}
                data={transactions}
                isLoading={isLoading}
                noResultsMessage={noResultsMessage}
                tableHeadCellStyles={{ color: '#64D9FE' }}
            />
        </>
    );
});

export default TransactionsTable;
