import React, { CSSProperties, useEffect } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, useFlexLayout } from 'react-table';
import TableView from './styled-components/Table';
import Pagination from './styled-components/Pagination';
import { FlexDivColumn, NoDataText, NoDataContainer } from 'theme/common';
import SPAAnchor from 'components/SPAAnchor';
import { useTranslation } from 'react-i18next';

type TableProps = {
    data: any;
    columns: any;
    searchQuery?: string;
    hidePagination?: boolean;
    resultsPerPage?: Array<number>;
    containerStyle?: CSSProperties;
    leaderboardView?: boolean;
};

const Table: React.FC<TableProps> = ({
    data,
    columns,
    searchQuery,
    hidePagination,
    resultsPerPage,
    containerStyle,
    leaderboardView,
}) => {
    const { t } = useTranslation();
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

    useEffect(() => {
        setPageSize(20);
    }, []);

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
                        <TableView.Body {...getTableBodyProps()} leaderboardView={leaderboardView}>
                            {page.map((row: any, index: number) => {
                                prepareRow(row);
                                if (row.original.link) {
                                    return (
                                        <SPAAnchor href={row.original.link}>
                                            <TableView.Row
                                                isUser={leaderboardView ? row.original.isUser : false}
                                                key={index}
                                                {...row.getRowProps()}
                                                leaderboardRank={
                                                    leaderboardView
                                                        ? row?.values?.rank
                                                            ? row?.values?.rank
                                                            : undefined
                                                        : undefined
                                                }
                                            >
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
                                        </SPAAnchor>
                                    );
                                } else {
                                    return (
                                        <TableView.Row
                                            isUser={leaderboardView ? row.original.isUser : false}
                                            key={index}
                                            {...row.getRowProps()}
                                            leaderboardRank={
                                                leaderboardView
                                                    ? row?.values?.rank
                                                        ? row?.values?.rank
                                                        : undefined
                                                    : undefined
                                            }
                                        >
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
                                }
                            })}
                        </TableView.Body>
                    </TableView>
                    {!hidePagination && (
                        <Pagination
                            rowsPerPageOptions={resultsPerPage ? resultsPerPage : [5, 10, 20, 25]}
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
                    <NoDataText>{t('common.no-data')}</NoDataText>
                </NoDataContainer>
            )}
        </>
    );
};

export default Table;
