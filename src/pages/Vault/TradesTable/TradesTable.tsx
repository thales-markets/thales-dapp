import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { formatShortDate, formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/Table';
import { buildOptionsMarketLink } from 'utils/routes';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import './style.css';
import { formatCurrency } from 'utils/formatters/number';
import SPAAnchor from 'components/SPAAnchor';
import { VaultTrade, VaultTrades } from 'types/vault';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import { UI_COLORS } from 'constants/ui';
import styled from 'styled-components';
import { VaultTradeStatus } from 'constants/vault';
import { isMobile } from 'utils/device';

type TradesTableProps = {
    transactions: VaultTrades;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

export const TradesTable: FC<TradesTableProps> = memo(({ transactions, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();
    // @ts-ignore
    return (
        <>
            <Table
                columns={[
                    {
                        Header: <>{t('vault.trades-history.table.date-time-col')}</>,
                        accessor: 'timestamp',
                        Cell: (cellProps: CellProps<VaultTrade, VaultTrade['timestamp']>) => (
                            <p style={{ fontSize: `${isMobile() ? '10px' : '12px'}` }}>
                                {formatTxTimestamp(cellProps.cell.value)}
                            </p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('vault.trades-history.table.asset')}</>,
                        accessor: 'currencyKey',
                        sortType: 'alphanumeric',
                        Cell: (cellProps: CellProps<VaultTrade, VaultTrade['currencyKey']>) => (
                            <SPAAnchor
                                className="hover-underline"
                                onClick={(e) => e.stopPropagation()}
                                href={buildOptionsMarketLink(cellProps.row.original.market)}
                            >
                                <CurrencyIcon
                                    width={`${isMobile() ? '18px' : '22px'}`}
                                    height={`${isMobile() ? '18px' : '22px'}`}
                                    currencyKey={cellProps.cell.value}
                                />
                                {cellProps.cell.value}
                            </SPAAnchor>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('vault.trades-history.table.maturity-date-col')}</>,
                        accessor: 'maturityDate',
                        Cell: (cellProps: CellProps<VaultTrade, VaultTrade['maturityDate']>) => (
                            <p>{formatShortDate(cellProps.cell.value)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('vault.trades-history.table.strike-price-col')}</>,
                        accessor: 'strikePrice',
                        sortType: 'basic',
                        Cell: (cellProps: CellProps<VaultTrade, VaultTrade['strikePrice']>) => (
                            <p>${formatCurrency(cellProps.cell.value)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('vault.trades-history.table.amount-col')}</>,
                        accessor: 'amount',
                        sortType: 'basic',
                        Cell: (cellProps: CellProps<VaultTrade, VaultTrade['amount']>) => (
                            <p>
                                {cellProps.cell.value}
                                <Icon
                                    style={{
                                        color: `${
                                            cellProps.cell.row.original.position === 0 ? UI_COLORS.GREEN : UI_COLORS.RED
                                        }`,
                                        marginLeft: 6,
                                    }}
                                    className={`v2-icon v2-icon--${
                                        cellProps.cell.row.original.position === 0 ? 'up' : 'down'
                                    }`}
                                ></Icon>
                            </p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('vault.trades-history.table.usd-value-col')}</>,
                        accessor: 'paid',
                        sortType: 'basic',
                        Cell: (cellProps: CellProps<VaultTrade, VaultTrade['paid']>) => (
                            <p>${formatCurrency(cellProps.cell.value)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('vault.trades-history.table.result-col')}</>,
                        accessor: 'result',
                        Cell: (cellProps: CellProps<VaultTrade, VaultTrade['result']>) => (
                            <>
                                {cellProps.cell.value !== null && (
                                    <Icon
                                        style={{
                                            color: `${cellProps.cell.value === 0 ? UI_COLORS.GREEN : UI_COLORS.RED}`,
                                            marginRight: 6,
                                        }}
                                        className={`v2-icon v2-icon--${cellProps.cell.value === 0 ? 'up' : 'down'}`}
                                    ></Icon>
                                )}
                                {cellProps.row.original.status !== VaultTradeStatus.IN_PROGRESS && (
                                    <Status
                                        color={
                                            cellProps.row.original.status == VaultTradeStatus.WIN
                                                ? UI_COLORS.GREEN
                                                : UI_COLORS.RED
                                        }
                                    >
                                        {cellProps.row.original.status}
                                    </Status>
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
                tableHeadCellStyles={{ color: 'var(--color-highlight)' }}
                tableRowCellStyles={{ fontSize: `${isMobile() ? '10px' : '14px'}` }}
            />
        </>
    );
});

const Status = styled.span<{ color: string }>`
    color: ${(props) => props.color};
`;

const Icon = styled.i`
    font-size: 19px;
    @media (max-width: 512px) {
        font-size: 16px;
    }
`;

export default TradesTable;
