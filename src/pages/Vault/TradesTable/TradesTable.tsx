import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { formatShortDate, formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/TableV2';
import { buildOptionsMarketLink } from 'utils/routes';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { formatCurrency } from 'utils/formatters/number';
import SPAAnchor from 'components/SPAAnchor';
import { VaultTrade, VaultTrades } from 'types/vault';
import styled, { useTheme } from 'styled-components';
import { VaultTradeStatus } from 'enums/vault';
import { ThemeInterface } from 'types/ui';
import { getColorPerPosition } from 'utils/options';
import { Positions } from 'enums/options';

type TradesTableProps = {
    transactions: VaultTrades;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

const TradesTable: FC<TradesTableProps> = memo(({ transactions, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    return (
        <Table
            columns={[
                {
                    Header: <>{t('vault.trades-history.table.date-time-col')}</>,
                    accessor: 'timestamp',
                    Cell: (cellProps: CellProps<VaultTrade, VaultTrade['timestamp']>) => (
                        <p>{formatTxTimestamp(cellProps.cell.value)}</p>
                    ),
                    sortable: true,
                },
                {
                    Header: <>{t('vault.trades-history.table.asset')}</>,
                    accessor: 'currencyKey',
                    Cell: (cellProps: CellProps<VaultTrade, VaultTrade['currencyKey']>) => (
                        <SPAAnchor
                            onClick={(e) => e.stopPropagation()}
                            href={buildOptionsMarketLink(cellProps.row.original.market)}
                        >
                            <CurrencyName>{cellProps.cell.value}</CurrencyName>
                        </SPAAnchor>
                    ),
                    sortable: true,
                    sortType: 'alphanumeric',
                },
                {
                    Header: <>{t('vault.trades-history.table.maturity-date-col')}</>,
                    accessor: 'maturityDate',
                    Cell: (cellProps: CellProps<VaultTrade, VaultTrade['maturityDate']>) => (
                        <p>{formatShortDate(cellProps.cell.value)}</p>
                    ),
                    sortable: true,
                },
                {
                    Header: <>{t('vault.trades-history.table.strike-price-col')}</>,
                    accessor: 'strikePrice',
                    Cell: (cellProps: CellProps<VaultTrade, VaultTrade['strikePrice']>) => (
                        <p>${formatCurrency(cellProps.cell.value)}</p>
                    ),
                    sortable: true,
                    sortType: 'basic',
                },
                {
                    Header: <>{t('vault.trades-history.table.amount-col')}</>,
                    accessor: 'amount',
                    Cell: (cellProps: CellProps<VaultTrade, VaultTrade['amount']>) => (
                        <p>
                            {cellProps.cell.value}{' '}
                            <Text
                                color={getColorPerPosition(
                                    cellProps.cell.row.original.position === 0 ? Positions.UP : Positions.DOWN,
                                    theme
                                )}
                            >
                                {cellProps.cell.row.original.position === 0 ? Positions.UP : Positions.DOWN}
                            </Text>
                        </p>
                    ),
                    sortable: true,
                    sortType: 'basic',
                },
                {
                    Header: <>{t('vault.trades-history.table.usd-value-col')}</>,
                    accessor: 'paid',
                    Cell: (cellProps: CellProps<VaultTrade, VaultTrade['paid']>) => (
                        <p>${formatCurrency(cellProps.cell.value)}</p>
                    ),
                    sortable: true,
                    sortType: 'basic',
                },
                {
                    Header: <>{t('vault.trades-history.table.result-col')}</>,
                    accessor: 'result',
                    Cell: (cellProps: CellProps<VaultTrade, VaultTrade['result']>) => (
                        <>
                            {cellProps.row.original.status !== VaultTradeStatus.IN_PROGRESS && (
                                <Text
                                    color={
                                        cellProps.row.original.status == VaultTradeStatus.WIN
                                            ? theme.textColor.quaternary
                                            : theme.textColor.tertiary
                                    }
                                >
                                    {cellProps.row.original.status}
                                </Text>
                            )}
                        </>
                    ),
                    width: 150,
                    sortable: true,
                },
                {
                    Header: <>{t('vault.trades-history.table.tx-status-col')}</>,
                    accessor: 'hash',
                    Cell: (cellProps: CellProps<VaultTrade, VaultTrade['hash']>) => (
                        <ViewEtherscanLink hash={cellProps.cell.value} />
                    ),
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

const Text = styled.span<{ color: string }>`
    color: ${(props) => props.color};
`;

const CurrencyName = styled.span`
    &:hover {
        text-decoration: underline;
    }
`;

export default TradesTable;
