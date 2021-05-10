import React, { useMemo, DependencyList } from 'react';
import { useTable, useSortBy, Column, Row } from 'react-table';
import { ReactComponent as SortDownIcon } from 'assets/images/sort-down.svg';
import { ReactComponent as SortUpIcon } from 'assets/images/sort-up.svg';
import { ReactComponent as SortIcon } from 'assets/images/sort.svg';
import { Loader } from 'semantic-ui-react';
import { FlexDiv, FlexDivCentered } from 'theme/common';
import styled from 'styled-components';

type ColumnWithSorting<D extends Record<string, unknown>> = Column<D> & {
    sortType?: string;
    sortable?: boolean;
};

type TableProps = {
    data: Record<string, unknown>[];
    columns: ColumnWithSorting<Record<string, unknown>>[];
    columnsDeps?: DependencyList;
    options?: any;
    onTableRowClick?: (row: Row<any>) => void;
    isLoading?: boolean;
    noResultsMessage?: React.ReactNode;
};

const Table: React.FC<TableProps> = ({
    columns = [],
    columnsDeps = [],
    data = [],
    options = {},
    noResultsMessage = null,
    onTableRowClick = undefined,
    isLoading = false,
}) => {
    const memoizedColumns = useMemo(() => columns, columnsDeps);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns: memoizedColumns,
            data,
            ...options,
        },
        useSortBy
    );

    return (
        <ReactTable {...getTableProps()}>
            {headerGroups.map((headerGroup, headerGroupIndex: any) => (
                <TableRow {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                    {headerGroup.headers.map((column: any, headerIndex: any) => (
                        <TableCellHead
                            {...column.getHeaderProps(column.sortable ? column.getSortByToggleProps() : undefined)}
                            key={headerIndex}
                            style={column.sortable ? { cursor: 'pointer' } : {}}
                        >
                            {column.render('Header')}
                            {column.sortable && (
                                <SortIconContainer>
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <SortDownIcon width="12px" />
                                        ) : (
                                            <SortUpIcon width="12px" />
                                        )
                                    ) : (
                                        <SortIcon width="12px" />
                                    )}
                                </SortIconContainer>
                            )}
                        </TableCellHead>
                    ))}
                </TableRow>
            ))}
            {isLoading ? (
                <Loader active />
            ) : noResultsMessage != null ? (
                <NoResultContainer>{noResultsMessage}</NoResultContainer>
            ) : (
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, rowIndex: any) => {
                        prepareRow(row);

                        return (
                            <TableRow
                                {...row.getRowProps()}
                                onClick={onTableRowClick ? () => onTableRowClick(row) : undefined}
                                key={rowIndex}
                            >
                                {row.cells.map((cell, cellIndex: any) => (
                                    <TableCell {...cell.getCellProps()} key={cellIndex}>
                                        {cell.render('Cell')}
                                    </TableCell>
                                ))}
                            </TableRow>
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
`;

const TableBody = styled.div``;

const TableRow = styled(FlexDiv)`
    height: 40px;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    border-top: 1px solid rgba(228, 228, 228, 0.1);
`;

const TableCell = styled(FlexDivCentered)`
    flex: 1;
    min-width: 0px;
    width: 150px;
    justify-content: left;
    &:first-child {
        padding-left: 18px;
    }
    &:last-child {
        padding-right: 18px;
    }
`;

const TableCellHead = styled(TableCell)`
    text-transform: uppercase;
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 0.5px;
    color: #4564ae;
    user-select: none;
`;

const SortIconContainer = styled.span`
    display: flex;
    align-items: center;
    margin-left: 5px;
`;

const NoResultContainer = styled(TableRow)`
    height: 60px;
    padding-top: 20px;
    padding-left: 18px;
    font-size: 14px;
`;

export default Table;
