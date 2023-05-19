import React, { useMemo, DependencyList, CSSProperties, useEffect } from 'react';
import { useTable, useSortBy, Column, Row, SortByFn, DefaultSortTypes, usePagination, Cell } from 'react-table';
import { ReactComponent as SortDownIcon } from 'assets/images/sort-down.svg';
import { ReactComponent as SortUpIcon } from 'assets/images/sort-up.svg';
import { ReactComponent as SortIcon } from 'assets/images/sort.svg';
import SimpleLoader from 'components/SimpleLoader';
import { FlexDiv, FlexDivCentered } from 'theme/common';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

type ColumnWithSorting<D extends Record<string, unknown>> = Column<D> & {
    sortType?: string | SortByFn<D> | DefaultSortTypes;
    sortable?: boolean;
};

type TableProps = {
    data: Record<string, unknown>[];
    columns: ColumnWithSorting<Record<string, unknown>>[];
    columnsDeps?: DependencyList;
    options?: any;
    onTableRowClick?: (row: Row<any>) => void;
    onTableCellClick?: (row: Row<any>, cell: Cell<any>) => void;
    isLoading?: boolean;
    noResultsMessage?: React.ReactNode;
    tableRowHeadStyles?: CSSProperties;
    tableRowStyles?: CSSProperties;
    tableHeadCellStyles?: CSSProperties;
    tableRowCellStyles?: CSSProperties;
    initialState?: any;
    onSortByChanged?: any;
    currentPage?: number;
    rowsPerPage?: number;
    // expandedRow?: (row: Row<any>) => JSX.Element;
    // stickyRow?: JSX.Element;
};

const Table: React.FC<TableProps> = ({
    columns = [],
    columnsDeps = [],
    data = [],
    options = {},
    noResultsMessage = null,
    onTableRowClick = undefined,
    onTableCellClick = undefined,
    isLoading = false,
    tableRowHeadStyles = {},
    tableRowStyles = {},
    tableHeadCellStyles = {},
    tableRowCellStyles = {},
    initialState = {},
    onSortByChanged = undefined,
    currentPage,
    rowsPerPage,
    // expandedRow,
    // stickyRow,
}) => {
    const { t } = useTranslation();

    const memoizedColumns = useMemo(() => columns, [...columnsDeps, t]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        gotoPage,
        setPageSize,
        page,
    } = useTable(
        {
            columns: memoizedColumns,
            data,
            ...options,
            initialState,
            autoResetSortBy: false,
        },
        useSortBy,
        usePagination
    );

    useEffect(() => {
        onSortByChanged && onSortByChanged();
    }, [state.sortBy]);

    useEffect(() => {
        if (currentPage !== undefined) {
            gotoPage(currentPage);
        }
    }, [currentPage, gotoPage]);

    useEffect(() => {
        if (rowsPerPage !== undefined) {
            setPageSize(rowsPerPage || 0);
        }
    }, [rowsPerPage, setPageSize]);

    return (
        <>
            {headerGroups.map((headerGroup, headerGroupIndex: any) => (
                <TableRowHead style={tableRowHeadStyles} {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                    {headerGroup.headers.map((column: any, headerIndex: any) => (
                        <TableCellHead
                            {...column.getHeaderProps(column.sortable ? column.getSortByToggleProps() : undefined)}
                            key={headerIndex}
                            style={
                                column.sortable
                                    ? { cursor: 'pointer', ...tableHeadCellStyles }
                                    : { ...tableHeadCellStyles }
                            }
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
                </TableRowHead>
            ))}
            <ReactTable {...getTableProps()}>
                {isLoading ? (
                    <LoaderContainer>
                        <SimpleLoader />
                    </LoaderContainer>
                ) : noResultsMessage != null && data.length === 0 ? (
                    <NoResultContainer>{noResultsMessage}</NoResultContainer>
                ) : (
                    <TableBody {...getTableBodyProps()}>
                        {(currentPage !== undefined ? page : rows).map((row, rowIndex: any) => {
                            prepareRow(row);

                            return (
                                <TableRow
                                    {...row.getRowProps()}
                                    onClick={onTableRowClick ? () => onTableRowClick(row) : undefined}
                                    key={rowIndex}
                                    style={tableRowStyles}
                                >
                                    {row.cells.map((cell, cellIndex: any) => (
                                        <TableCell
                                            style={tableRowCellStyles}
                                            {...cell.getCellProps()}
                                            key={cellIndex}
                                            onClick={onTableCellClick ? () => onTableCellClick(row, cell) : undefined}
                                        >
                                            {cell.render('Cell')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                )}
            </ReactTable>
        </>
    );
};

const ReactTable = styled.div`
    width: 100%;
    height: 100%;
    overflow-x: auto;
    position: relative;
    display: flex;
`;

const TableBody = styled.div`
    display: flex;
    overflow: auto;
    flex-direction: column;
    width: 100%;
    ::-webkit-scrollbar {
        width: 5px;
    }
    ::-webkit-scrollbar-track {
        background: ${(props) => props.theme.background.secondary};
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 15px;
        background: ${(props) => props.theme.background.tertiary};
    }
    ::-webkit-scrollbar-thumb:active {
        background: ${(props) => props.theme.background.tertiary};
    }
    ::-webkit-scrollbar-thumb:hover {
        background: ${(props) => props.theme.background.tertiary};
    }
`;

const TableRow = styled(FlexDiv)`
    min-height: 35px;
    font-weight: 600;
    font-size: 12px;
    @media (max-width: 512px) {
        min-height: 30px;
        font-size: 10px;
        & > div {
            justify-content: center;
            text-align: center;
            img {
                width: 20px;
                height: 20px;
            }
        }
        & > div:last-child {
            padding-right: 0;
        }
        & > div:first-child {
            padding-left: 6px;
        }
    }
    line-height: 16px;
    letter-spacing: 0.25px;
    color: ${(props) => props.theme.textColor.primary};
    border-bottom: 1px solid ${(props) => props.theme.borderColor.tertiary};
`;

const TableRowHead = styled(TableRow)`
    border-top: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-bottom: 1px solid ${(props) => props.theme.borderColor.tertiary};
`;

const TableCell = styled(FlexDivCentered)`
    flex: 1;
    min-width: 0px;
    width: 150px;
    justify-content: center;
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
    @media (max-width: 767px) {
        span {
            display: none;
        }
    }
    @media (max-width: 512px) {
        font-size: 10px;
        justify-content: center;
        text-align: center;
        &:last-child {
            padding-right: 0;
        }
    }
    color: ${(props) => props.theme.textColor.secondary};
    user-select: none;
`;

const SortIconContainer = styled.span`
    display: flex;
    align-items: center;
    margin-left: 5px;
    svg {
        path {
            fill: ${(props) => props.theme.textColor.secondary};
        }
    }
`;

const NoResultContainer = styled(TableRow)`
    height: 60px;
    padding-top: 20px;
    padding-left: 18px;
    font-size: 14px;
    border: none;
`;

const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 220px;
    width: 100%;
`;

export default Table;
