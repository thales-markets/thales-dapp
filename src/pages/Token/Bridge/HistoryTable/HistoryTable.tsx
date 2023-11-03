import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import Table from 'components/TableV2';
import { formatTxTimestamp } from 'utils/formatters/date';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { SUPPORTED_NETWORK_IDS_MAP } from 'utils/network';
import { FlexDivRowCentered } from 'styles/common';
import { CelerBridgeHistory, CelerBridgeTransaction } from 'types/token';
import NetworkIcon from '../components/NetworkIcon';

type HistoryTableProps = {
    transactions: CelerBridgeHistory;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

const HistoryTable: FC<HistoryTableProps> = memo(({ transactions, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    return (
        <Table
            columns={[
                {
                    Header: <>{t('thales-token.bridge.history.table.date-time-col')}</>,
                    accessor: 'timestamp',
                    Cell: (cellProps: CellProps<CelerBridgeTransaction, CelerBridgeTransaction['timestamp']>) => (
                        <Text>{formatTxTimestamp(cellProps.cell.value)}</Text>
                    ),
                    sortable: true,
                },
                {
                    Header: <>{t('thales-token.bridge.history.table.from-col')}</>,
                    accessor: 'srcChainId',
                    Cell: (cellProps: CellProps<CelerBridgeTransaction, CelerBridgeTransaction['srcChainId']>) => (
                        <FlexDivRowCentered>
                            {cellProps.cell.value && <NetworkIcon networkId={cellProps.cell.value} />}
                            {cellProps.cell.value ? SUPPORTED_NETWORK_IDS_MAP[cellProps.cell.value].name : ''}
                            {cellProps.cell.row.original.srcTx && (
                                <ViewEtherscanLink hash={cellProps.cell.row.original.srcTx} />
                            )}
                        </FlexDivRowCentered>
                    ),
                    sortable: true,
                },
                {
                    Header: <>{t('thales-token.bridge.history.table.sent-col')}</>,
                    accessor: 'srcAmount',
                    Cell: (cellProps: CellProps<CelerBridgeTransaction, CelerBridgeTransaction['srcAmount']>) => (
                        <Text color={theme.tradeTypeColor.sell}>
                            {cellProps.cell.value
                                ? `-${formatCurrencyWithKey(THALES_CURRENCY, cellProps.cell.value)}`
                                : ''}
                        </Text>
                    ),
                    sortable: true,
                },
                {
                    Header: <>{t('thales-token.bridge.history.table.to-col')}</>,
                    accessor: 'dstChainId',
                    Cell: (cellProps: CellProps<CelerBridgeTransaction, CelerBridgeTransaction['dstChainId']>) => (
                        <FlexDivRowCentered>
                            {cellProps.cell.value && <NetworkIcon networkId={cellProps.cell.value} />}
                            {cellProps.cell.value ? SUPPORTED_NETWORK_IDS_MAP[cellProps.cell.value].name : ''}
                            {cellProps.cell.row.original.dstTx && (
                                <ViewEtherscanLink hash={cellProps.cell.row.original.dstTx} />
                            )}
                        </FlexDivRowCentered>
                    ),
                    sortable: true,
                },
                {
                    Header: <>{t('thales-token.bridge.history.table.received-col')}</>,
                    accessor: 'dstAmount',
                    Cell: (cellProps: CellProps<CelerBridgeTransaction, CelerBridgeTransaction['dstAmount']>) => (
                        <Text color={theme.tradeTypeColor.buy}>
                            {cellProps.cell.value
                                ? `+${formatCurrencyWithKey(THALES_CURRENCY, cellProps.cell.value)}`
                                : ''}
                        </Text>
                    ),
                    sortable: true,
                },
                {
                    Header: <>{t('thales-token.bridge.history.table.status-col')}</>,
                    accessor: 'status',
                    Cell: (cellProps: CellProps<CelerBridgeTransaction, CelerBridgeTransaction['status']>) => (
                        <p>{cellProps.cell.value}</p>
                    ),
                    sortable: true,
                },
            ]}
            data={transactions}
            isLoading={isLoading}
            noResultsMessage={noResultsMessage}
            hidePagination
        />
    );
});

const Text = styled.p<{ color?: string }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
`;

export default HistoryTable;
