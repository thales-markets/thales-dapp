import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { formatShortDate, formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/TableV2';
import { buildOptionsMarketLink } from 'utils/routes';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import './style.css';
import { formatCurrency } from 'utils/formatters/number';
import SPAAnchor from 'components/SPAAnchor';
import { VaultTrade, VaultTrades } from 'types/vault';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import styled, { useTheme } from 'styled-components';
import { VaultTradeStatus } from 'constants/vault';
import { ThemeInterface } from 'types/ui';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';

type TradesTableProps = {
    transactions: VaultTrades;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

const TradesTable: FC<TradesTableProps> = memo(({ transactions, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const isMobile = useSelector((state: RootState) => getIsMobile(state));

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
                            className="hover-underline"
                            onClick={(e) => e.stopPropagation()}
                            href={buildOptionsMarketLink(cellProps.row.original.market)}
                        >
                            <CurrencyIcon
                                width={`${isMobile ? '18px' : '22px'}`}
                                height={`${isMobile ? '18px' : '22px'}`}
                                currencyKey={cellProps.cell.value}
                            />
                            {cellProps.cell.value}
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
                            {cellProps.cell.value}
                            <Icon
                                color={
                                    cellProps.cell.value === 0 ? theme.textColor.quaternary : theme.textColor.tertiary
                                }
                                marginLeft="6px"
                                className={`v2-icon v2-icon--${
                                    cellProps.cell.row.original.position === 0 ? 'up' : 'down'
                                }`}
                            ></Icon>
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
                            {cellProps.cell.value !== null && (
                                <Icon
                                    color={
                                        cellProps.cell.value === 0
                                            ? theme.textColor.quaternary
                                            : theme.textColor.tertiary
                                    }
                                    marginRight="6px"
                                    className={`v2-icon v2-icon--${cellProps.cell.value === 0 ? 'up' : 'down'}`}
                                ></Icon>
                            )}
                            {cellProps.row.original.status !== VaultTradeStatus.IN_PROGRESS && (
                                <Status
                                    color={
                                        cellProps.row.original.status == VaultTradeStatus.WIN
                                            ? theme.textColor.quaternary
                                            : theme.textColor.tertiary
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
            hidePagination
        />
    );
});

const Status = styled.span<{ color: string }>`
    color: ${(props) => props.color};
`;

const Icon = styled.i<{ color: string; marginLeft?: string; marginRight?: string }>`
    font-size: 15px;
    color: ${(props) => props.color} !important;
    margin-left: ${(props) => props.marginLeft || '0px'};
    margin-right: ${(props) => props.marginRight || '0px'};
`;

export default TradesTable;
