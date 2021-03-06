// @ts-nocheck
import React, { useMemo, DependencyList } from 'react';
import { useTable, useSortBy, Column, Row } from 'react-table';
import { ReactComponent as SortDownIcon } from 'assets/images/sort-down.svg';
import { ReactComponent as SortUpIcon } from 'assets/images/sort-up.svg';
import { ReactComponent as SortIcon } from 'assets/images/sort.svg';
import { Loader, Table as SemanticTable } from 'semantic-ui-react';

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
        <SemanticTable {...getTableProps()} selectable>
            {headerGroups.map((headerGroup) => (
                <SemanticTable.Header {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                    <SemanticTable.Row>
                        {headerGroup.headers.map((column: any, headerIndex: any) => (
                            <SemanticTable.HeaderCell
                                {...column.getHeaderProps(column.sortable ? column.getSortByToggleProps() : undefined)}
                                key={headerIndex}
                            >
                                {column.render('Header')}
                                {column.sortable && (
                                    <>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <SortDownIcon />
                                            ) : (
                                                <SortUpIcon />
                                            )
                                        ) : (
                                            <SortIcon />
                                        )}
                                    </>
                                )}
                            </SemanticTable.HeaderCell>
                        ))}
                    </SemanticTable.Row>
                </SemanticTable.Header>
            ))}
            {isLoading ? (
                <Loader />
            ) : noResultsMessage != null ? (
                noResultsMessage
            ) : (
                <SemanticTable.Body {...getTableBodyProps()}>
                    {rows.map((row, rowIndex: any) => {
                        prepareRow(row);

                        return (
                            <SemanticTable.Row
                                className="table-body-row"
                                {...row.getRowProps()}
                                onClick={onTableRowClick ? () => onTableRowClick(row) : undefined}
                                key={rowIndex}
                            >
                                {row.cells.map((cell, cellIndex: any) => (
                                    <SemanticTable.Cell {...cell.getCellProps()} key={cellIndex}>
                                        {cell.render('Cell')}
                                    </SemanticTable.Cell>
                                ))}
                            </SemanticTable.Row>
                        );
                    })}
                </SemanticTable.Body>
            )}
        </SemanticTable>
    );
};

export default Table;
