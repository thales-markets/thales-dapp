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
import styled from 'styled-components';
import longIcon from 'assets/images/long_small.svg';
import shortIcon from 'assets/images/short_small.svg';
import { COLORS } from 'constants/ui';

type TransactionsTableProps = {
    optionsTransactions: OptionsTransactions;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

const getCellColor = (type: string) => {
    switch (type) {
        case 'buy':
            return COLORS.BUY;
        case 'sell':
            return COLORS.SELL;
        default:
            return COLORS.WHITE;
    }
};

export const TransactionsTable: FC<TransactionsTableProps> = memo(
    ({ optionsTransactions, noResultsMessage, isLoading }) => {
        const { t } = useTranslation();
        return (
            <>
                <Table
                    columns={[
                        {
                            Header: <>{t('options.market.transactions-card.table.date-time-col')}</>,
                            accessor: 'timestamp',
                            Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['timestamp']>) => (
                                <p>{formatTxTimestamp(cellProps.cell.value)}</p>
                            ),
                            width: 150,
                            sortable: true,
                        },
                        {
                            Header: <>{t('options.market.transactions-card.table.type-col')}</>,
                            accessor: 'type',
                            Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['type']>) => (
                                <p style={{ color: getCellColor(cellProps.cell.row.original.type) }}>
                                    {t(`options.market.transactions-card.table.types.${cellProps.cell.value}`)}
                                </p>
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
                                if (type === 'mint' || type === 'exercise') return <span>{EMPTY_VALUE}</span>;
                                return (
                                    <>
                                        {side === 'long' ? (
                                            <PositionImage src={longIcon} />
                                        ) : (
                                            <PositionImage src={shortIcon} />
                                        )}
                                    </>
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
                                <p style={{ color: getCellColor(cellProps.cell.row.original.type) }}>
                                    {cellProps.cell.row.original.type === 'buy' ||
                                    cellProps.cell.row.original.type === 'sell'
                                        ? formatCurrencyWithKey('sOPT', cellProps.cell.value)
                                        : formatCurrencyWithKey(SYNTHS_MAP.sUSD, cellProps.cell.value)}
                                </p>
                            ),
                            width: 150,
                            sortable: true,
                        },
                        {
                            Header: <>{t('options.market.transactions-card.table.price-col')}</>,
                            sortType: 'basic',
                            accessor: 'price',
                            Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['price']>) => (
                                <p style={{ color: getCellColor(cellProps.cell.row.original.type) }}>
                                    {cellProps.cell.row.original.type === 'buy' ||
                                    cellProps.cell.row.original.type === 'sell'
                                        ? formatCurrencyWithKey(SYNTHS_MAP.sUSD, cellProps.cell.value ?? 0)
                                        : EMPTY_VALUE}
                                </p>
                            ),
                            width: 150,
                            sortable: true,
                        },
                        {
                            Header: <>{t('options.market.transactions-card.table.tx-status-col')}</>,
                            id: 'tx-status',
                            Cell: (cellProps: CellProps<OptionsTransaction>) =>
                                cellProps.cell.row.original.status &&
                                cellProps.cell.row.original.status === 'pending' ? (
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
            </>
        );
    }
);

const PositionImage = styled.img``;

export default TransactionsTable;
