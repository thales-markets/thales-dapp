import React, { CSSProperties, useEffect } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, useFlexLayout } from 'react-table';

import TableView, { NoDataContainer, NoDataText } from './styled-components/Table';
import Pagination from './styled-components/Pagination';
import { FlexDivColumn } from 'theme/common';

type TableProps = {
    data: any;
    columns: any;
    searchQuery?: string;
    hidePagination?: boolean;
    resultsPerPage?: Array<number>;
    containerStyle?: CSSProperties;
};

const Table: React.FC<TableProps> = ({
    data,
    columns,
    searchQuery,
    hidePagination,
    resultsPerPage,
    containerStyle,
}) => {
    useEffect(() => {
        setGlobalFilter(searchQuery);
    }, [searchQuery]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        setGlobalFilter,
        gotoPage,
        setPageSize,
    } = useTable(
        {
            columns,
            data,
            initalState: {
                pageIndex: 1,
            },
            autoResetPage: false,
            autoResetSortBy: false,
            autoResetGlobalFilter: false,
            autoResetRowState: false,
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useFlexLayout
    );

    const { pageIndex, pageSize } = state;

    const handleChangePage = (_event: any, newPage: number) => {
        gotoPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setPageSize(parseInt(event.target.value, 10));
        gotoPage(0);
    };

    return (
        <>
            {data?.length && (
                <FlexDivColumn>
                    <TableView {...getTableProps()} style={{ ...containerStyle }}>
                        <TableView.Header>
                            {headerGroups.map((headerGroup: any, headerGroupIndex) => (
                                <TableView.Row key={headerGroupIndex} {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column: any, columnIndex: number) => (
                                        <TableView.Cell
                                            key={columnIndex}
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                        >
                                            {column.render('Header')}
                                            {
                                                <TableView.Arrow
                                                    className={`icon ${
                                                        column.canSort
                                                            ? column.isSorted
                                                                ? column.isSortedDesc
                                                                    ? 'icon--arrow-down'
                                                                    : 'icon--arrow-up'
                                                                : 'icon--double-arrow'
                                                            : ''
                                                    }`}
                                                />
                                            }
                                        </TableView.Cell>
                                    ))}
                                </TableView.Row>
                            ))}
                        </TableView.Header>
                        <TableView.Body {...getTableBodyProps()}>
                            {page.map((row: any, index: number) => {
                                prepareRow(row);
                                return (
                                    <TableView.Row key={index} {...row.getRowProps()}>
                                        {row.cells.map((cell: any, cellIndex: number) => {
                                            return (
                                                <TableView.Cell
                                                    defaultFontWeight={'bold'}
                                                    key={cellIndex}
                                                    {...cell.getCellProps()}
                                                >
                                                    {cell.render('Cell')}
                                                </TableView.Cell>
                                            );
                                        })}
                                    </TableView.Row>
                                );
                            })}
                        </TableView.Body>
                    </TableView>
                    {!hidePagination && (
                        <Pagination
                            rowsPerPageOptions={resultsPerPage ? resultsPerPage : [5, 10, 25]}
                            count={data.length}
                            rowsPerPage={pageSize}
                            page={pageIndex}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </FlexDivColumn>
            )}
            {!data.length && (
                <NoDataContainer>
                    <NoDataText>No data available</NoDataText>
                </NoDataContainer>
            )}
        </>
    );
};

export default Table;
