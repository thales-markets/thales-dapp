import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, useFlexLayout } from 'react-table';
import TableView from './styled-components/Table';
import Pagination from './styled-components/Pagination';
import { FlexDivColumn, NoDataText, NoDataContainer } from 'theme/common';
import SPAAnchor from 'components/SPAAnchor';
import { useTranslation } from 'react-i18next';
import MobileDropdownMenu from 'components/MobileDropdownMenu';

type TableProps = {
    data: any;
    columns: any;
    searchQuery?: string;
    hidePagination?: boolean;
    resultsPerPage?: Array<number>;
    defaultPage?: number;
    containerStyle?: CSSProperties;
    leaderboardView?: boolean;
    hasStickyRow?: boolean;
};

const Table: React.FC<TableProps> = ({
    data,
    columns,
    searchQuery,
    hidePagination,
    resultsPerPage,
    defaultPage,
    containerStyle,
    leaderboardView,
    hasStickyRow,
}) => {
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setGlobalFilter(searchQuery);
    }, [searchQuery]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        rows,
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
        setPageSize(defaultPage ? defaultPage : resultsPerPage?.length ? resultsPerPage[0] : 20);
    }, []);

    const handleResize = () => {
        if (window.innerWidth <= columns?.length * 150 * 0.9) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const sortHeaderMenus = useMemo(() => {
        const menuItems: any = [];

        headerGroups.forEach((headerGroup: any) => {
            headerGroup?.headers?.map((column: any) => {
                if (column.toggleSortBy) {
                    menuItems.push({
                        active: false,
                        onClick: column.toggleSortBy,
                        title: column?.render('Header'),
                        sortableIndex: 0,
                        sortable: true,
                        clearSort: column.clearSortBy,
                    });
                }
            });
        });
        return menuItems;
    }, [headerGroups]);

    return (
        <>
            {data?.length && (
                <FlexDivColumn>
                    {isMobile && (
                        <MobileDropdownMenu
                            buttonTitle={t('options.filters-labels.sort-menu')}
                            dropdownTitle={t('options.filters-labels.sort-menu')}
                            items={sortHeaderMenus}
                        />
                    )}
                    {!isMobile && (
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
                                {hasStickyRow &&
                                    rows.map((row: any, index: number) => {
                                        prepareRow(row);
                                        if (row?.original?.sticky) {
                                            return (
                                                <TableView.Row
                                                    {...row.getRowProps()}
                                                    key={index}
                                                    isUser={leaderboardView ? row.original.sticky : false}
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
                                {page.map((row: any, index: number) => {
                                    prepareRow(row);
                                    const rowComponent = (
                                        <TableView.Row
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

                                    if (row.original.link) {
                                        return <SPAAnchor href={row.original.link}>{rowComponent}</SPAAnchor>;
                                    }

                                    return rowComponent;
                                })}
                            </TableView.Body>
                        </TableView>
                    )}
                    {isMobile && (
                        <TableView.Body {...getTableBodyProps()} leaderboardView={leaderboardView} isMobile={isMobile}>
                            {hasStickyRow &&
                                rows.map((row: any, index: number) => {
                                    prepareRow(row);
                                    if (row?.original?.sticky) {
                                        return (
                                            <TableView.Row
                                                {...row.getRowProps()}
                                                key={'msr' + index}
                                                isUser={leaderboardView ? row.original.sticky : false}
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
                                                        <TableView.RowMobile key={`ms${index}${cellIndex}`}>
                                                            <TableView.Cell
                                                                key={`msc${cellIndex}`}
                                                                defaultFontWeight={'bold'}
                                                                justifyContent={'flex-start'}
                                                                padding={'0 0 0 20px'}
                                                                {...cell.getCellProps()}
                                                            >
                                                                {cell.render('Header')}
                                                            </TableView.Cell>
                                                            <TableView.Cell
                                                                defaultFontWeight={'bold'}
                                                                {...cell.getCellProps()}
                                                                key={`mscv${cellIndex}`}
                                                            >
                                                                {cell.render('Cell')}
                                                            </TableView.Cell>
                                                        </TableView.RowMobile>
                                                    );
                                                })}
                                            </TableView.Row>
                                        );
                                    }
                                })}
                            {page.map((row: any, index: number) => {
                                prepareRow(row);
                                const rowComponent = (
                                    <TableView.Row
                                        key={'mr' + index}
                                        {...row.getRowProps()}
                                        isMobile={true}
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
                                                <TableView.RowMobile key={`mrm${index}${cellIndex}`}>
                                                    <TableView.Cell
                                                        key={`mc${cellIndex}`}
                                                        defaultFontWeight={'bold'}
                                                        justifyContent={'flex-start'}
                                                        padding={'0 0 0 20px'}
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.render('Header')}
                                                    </TableView.Cell>
                                                    <TableView.Cell
                                                        defaultFontWeight={'bold'}
                                                        {...cell.getCellProps()}
                                                        key={`mcv${cellIndex}`}
                                                    >
                                                        {cell.render('Cell')}
                                                    </TableView.Cell>
                                                </TableView.RowMobile>
                                            );
                                        })}
                                    </TableView.Row>
                                );

                                if (row.original.link) {
                                    return <SPAAnchor href={row.original.link}>{rowComponent}</SPAAnchor>;
                                }

                                return rowComponent;
                            })}
                        </TableView.Body>
                    )}
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
