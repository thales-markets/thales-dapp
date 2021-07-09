import React, { useMemo, DependencyList } from 'react';
import { useTable, useSortBy, Column, Row } from 'react-table';
import SimpleLoader from 'components/SimpleLoader';
import { FlexDiv, FlexDivCentered } from 'theme/common';
import styled from 'styled-components';
import { OrderItem, OrderSide } from 'types/options';
import { COLORS } from 'constants/ui';

type ColumnWithSorting<D extends Record<string, unknown>> = Column<D> & {
    sortType?: string;
    sortable?: boolean;
};

type OrderbookTableProps = {
    data: Record<string, unknown>[];
    columns: ColumnWithSorting<Record<string, unknown>>[];
    columnsDeps?: DependencyList;
    options?: any;
    onTableRowClick?: (row: Row<any>) => void;
    isLoading?: boolean;
    noResultsMessage?: React.ReactNode;
    orderSide: OrderSide;
};

const OrderbookTable: React.FC<OrderbookTableProps> = ({
    columns = [],
    columnsDeps = [],
    data = [],
    options = {},
    noResultsMessage = null,
    onTableRowClick = undefined,
    isLoading = false,
    orderSide,
}) => {
    const memoizedColumns = useMemo(() => columns, columnsDeps);
    const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable(
        {
            columns: memoizedColumns,
            data,
            ...options,
        },
        useSortBy
    );

    return (
        <ReactTable {...getTableProps()}>
            {isLoading ? (
                <SimpleLoader />
            ) : noResultsMessage != null ? (
                <NoResultContainer>{noResultsMessage}</NoResultContainer>
            ) : (
                <TableBody {...getTableBodyProps()} orderSide={orderSide}>
                    {rows.map((row, rowIndex: any) => {
                        prepareRow(row);

                        return (
                            <TableRowBody
                                {...row.getRowProps()}
                                onClick={onTableRowClick ? () => onTableRowClick(row) : undefined}
                                key={rowIndex}
                            >
                                <InnerTableRow
                                    width={(row.original as OrderItem).displayOrder.percentageOfMaximum ?? 0}
                                    orderSide={orderSide}
                                />
                                {row.cells.map((cell, cellIndex: any) => (
                                    <TableCell
                                        {...cell.getCellProps()}
                                        key={cellIndex}
                                        style={{ width: cell.column.width }}
                                        justifyContent={
                                            cell.column.id === 'displayOrder.timeRemaining' ? 'center' : 'left'
                                        }
                                    >
                                        {cell.render('Cell')}
                                    </TableCell>
                                ))}
                            </TableRowBody>
                        );
                    })}
                </TableBody>
            )}
        </ReactTable>
    );
};

const ReactTable = styled.div`
    width: 100%;
    height: 100%;
    overflow-x: auto;
    position: relative;
    display: flex;
`;

const TableBody = styled.div<{ orderSide: OrderSide }>`
    display: flex;
    flex-direction: ${(props) => (props.orderSide === 'buy' ? 'column' : 'column-reverse')};
    overflow: auto;
    ::-webkit-scrollbar {
        width: 5px;
    }
    ::-webkit-scrollbar-track {
        background: #04045a;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 15px;
        background: #355dff;
    }
    ::-webkit-scrollbar-thumb:active {
        background: #44e1e2;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgb(67, 116, 255);
    }
`;

export const TableRow = styled(FlexDiv)`
    min-height: 32px;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    position: relative;
`;

export const TableRowBody = styled(TableRow)`
    &:hover {
        cursor: pointer;
        background: #116;
    }
`;

const InnerTableRow = styled(FlexDiv)<{ width: number; orderSide: OrderSide }>`
    min-height: 32px;
    background: ${(props) => (props.orderSide === 'buy' ? COLORS.BUY : COLORS.SELL)};
    mix-blend-mode: normal;
    opacity: 0.12;
    width: ${(props) => `${props.width}%`};
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
`;

export const TableCell = styled(FlexDivCentered)<{ justifyContent?: string }>`
    min-width: 0px;
    justify-content: ${(props) => props.justifyContent || 'left'};
    &:first-child {
        padding-left: 18px;
    }
    &:last-child {
        padding-right: 18px;
    }
`;

const NoResultContainer = styled(TableRow)`
    min-height: 10px;
    height: 60px;
    padding-left: 18px;
    font-size: 14px;
    display: flex;
    height: 100%;
    overflow: hidden;
`;

export default OrderbookTable;
