import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/Table';
import { OptionsTransaction, OptionsTransactions } from 'types/options';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import OptionSideIcon from '../../../components/OptionSideIcon';

type TransactionsTableProps = {
    optionsTransactions: OptionsTransactions;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

export const TransactionsTable: FC<TransactionsTableProps> = memo(
    ({ optionsTransactions, noResultsMessage, isLoading }) => {
        const { t } = useTranslation();
        return (
            <Table
                columns={[
                    {
                        Header: <>{t('options.market.transactions-card.table.date-time-col')}</>,
                        accessor: 'timestamp',
                        Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['timestamp']>) =>
                            formatTxTimestamp(cellProps.cell.value),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.type-col')}</>,
                        accessor: 'type',
                        Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['type']>) => (
                            <span>{t(`options.market.transactions-card.table.types.${cellProps.cell.value}`)}</span>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.position-col')}</>,
                        accessor: 'side',
                        Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['side']>) => {
                            const side = cellProps.cell.value;
                            const type = cellProps.cell.row.original.type;
                            if (type === 'exercise') return <span>{EMPTY_VALUE}</span>;
                            return (
                                <span>
                                    <OptionSideIcon side={side} />
                                    <span>{side}</span>
                                </span>
                            );
                        },
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.amount-col')}</>,
                        sortType: 'basic',
                        accessor: 'amount',
                        Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['amount']>) => (
                            <span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, cellProps.cell.value)}</span>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.tx-status-col')}</>,
                        id: 'tx-status',
                        Cell: (cellProps: CellProps<OptionsTransaction>) =>
                            cellProps.cell.row.original.status && cellProps.cell.row.original.status === 'pending' ? (
                                <span>{t('common.tx-status.pending')}</span>
                            ) : (
                                <ViewEtherscanLink hash={cellProps.cell.row.original.hash} />
                            ),
                        width: 150,
                    },
                ]}
                data={optionsTransactions}
                isLoading={isLoading}
                noResultsMessage={noResultsMessage}
            />
        );
    }
);

export default TransactionsTable;
