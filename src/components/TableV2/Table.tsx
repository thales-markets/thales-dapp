import React, { useEffect, useMemo, useState, DependencyList } from 'react';
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
    useFlexLayout,
    SortByFn,
    DefaultSortTypes,
    Column,
    Row,
    Cell,
} from 'react-table';
import {
    TableView,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableRowMobile,
    TableArrow,
    LoaderContainer,
    NoDataContainer,
    PaginationContainer,
} from './styled-components/Table';
import Pagination from './styled-components/Pagination';
import SPAAnchor from 'components/SPAAnchor';
import { useTranslation } from 'react-i18next';
import MobileDropdownMenu from 'components/MobileDropdownMenu';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';

const DEFAULT_PAGE_SIZE = 20;

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
    initialState?: any;
    searchQuery?: string;
    hidePagination?: boolean;
    hasStickyRow?: boolean;
};

const Table: React.FC<TableProps> = ({
    data = [],
    columns = [],
    columnsDeps = [],
    options = {},
    onTableRowClick = undefined,
    onTableCellClick = undefined,
    isLoading = false,
    noResultsMessage = null,
    initialState = {},
    searchQuery,
    hidePagination,
    hasStickyRow,
}) => {
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);

    const memoizedColumns = useMemo(() => columns, [...columnsDeps, t]);

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
            columns: memoizedColumns,
            data,
            ...options,
            initialState,
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

    const { pageIndex, pageSize, sortBy } = state;

    const handleChangePage = (_event: any, newPage: number) => {
        gotoPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setPageSize(Number(event.target.value));
        gotoPage(0);
    };

    useEffect(() => {
        setPageSize(DEFAULT_PAGE_SIZE);
    }, []);

    useEffect(() => {
        gotoPage(0);
    }, [sortBy, searchQuery]);

    const handleResize = () => {
        if (window.innerWidth <= columns.length * 150 * 0.9) {
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
            headerGroup.headers.map((column: any) => {
                if (column.toggleSortBy) {
                    menuItems.push({
                        active: false,
                        onClick: column.toggleSortBy,
                        title: column.render('Header'),
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
            <>
                {isMobile ? (
                    <MobileDropdownMenu
                        buttonTitle={t('options.filters-labels.sort-menu')}
                        dropdownTitle={t('options.filters-labels.sort-menu')}
                        items={sortHeaderMenus}
                    />
                ) : (
                    <TableHeader>
                        {headerGroups.map((headerGroup: any, headerGroupIndex) => (
                            <TableRow key={headerGroupIndex} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column: any, columnIndex: number) => (
                                    <TableCell
                                        key={columnIndex}
                                        {...column.getHeaderProps(
                                            column.sortable ? column.getSortByToggleProps() : undefined
                                        )}
                                    >
                                        {column.render('Header')}
                                        {column.sortable && (
                                            <TableArrow
                                                className={`icon ${
                                                    column.isSorted
                                                        ? column.isSortedDesc
                                                            ? 'icon--arrow-down'
                                                            : 'icon--arrow-up'
                                                        : 'icon--double-arrow'
                                                }`}
                                            />
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                )}
                <TableView {...getTableProps()}>
                    {isLoading ? (
                        <LoaderContainer>
                            <SimpleLoader />
                        </LoaderContainer>
                    ) : data.length === 0 ? (
                        <NoDataContainer>{noResultsMessage || t('common.no-data')}</NoDataContainer>
                    ) : (
                        <TableBody {...getTableBodyProps()} isMobile={isMobile}>
                            {hasStickyRow &&
                                rows.map((row: any, rowIndex: number) => {
                                    prepareRow(row);
                                    if (row.original.sticky) {
                                        return (
                                            <TableRow
                                                key={rowIndex}
                                                {...row.getRowProps()}
                                                isMobile={isMobile}
                                                isSticky={row.original.sticky}
                                            >
                                                {row.cells.map((cell: any, cellIndex: number) => {
                                                    return isMobile ? (
                                                        <TableRowMobile
                                                            key={`msrm${rowIndex}${cellIndex}`}
                                                            isSticky={row.original.sticky}
                                                        >
                                                            <TableCell key={`msh${cellIndex}`} {...cell.getCellProps()}>
                                                                {cell.render('Header')}
                                                            </TableCell>
                                                            <TableCell key={`msc${cellIndex}`} {...cell.getCellProps()}>
                                                                {cell.render('Cell')}
                                                            </TableCell>
                                                        </TableRowMobile>
                                                    ) : (
                                                        <TableCell key={cellIndex} {...cell.getCellProps()}>
                                                            {cell.render('Cell')}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    }
                                })}
                            {page.map((row: any, rowIndex: number) => {
                                prepareRow(row);
                                const rowComponent = (
                                    <TableRow
                                        key={rowIndex}
                                        {...row.getRowProps()}
                                        onClick={onTableRowClick ? () => onTableRowClick(row) : undefined}
                                        isMobile={isMobile}
                                        isClaimed={row.original.claimed}
                                        isClaimable={row.original.claimable}
                                    >
                                        {row.cells.map((cell: any, cellIndex: number) => {
                                            return isMobile ? (
                                                <TableRowMobile key={`mrm${rowIndex}${cellIndex}`}>
                                                    <TableCell key={`mh${cellIndex}`} {...cell.getCellProps()}>
                                                        {cell.render('Header')}
                                                    </TableCell>
                                                    <TableCell {...cell.getCellProps()} key={`mc${cellIndex}`}>
                                                        {cell.render('Cell')}
                                                    </TableCell>
                                                </TableRowMobile>
                                            ) : (
                                                <TableCell
                                                    key={cellIndex}
                                                    {...cell.getCellProps()}
                                                    onClick={
                                                        onTableCellClick ? () => onTableCellClick(row, cell) : undefined
                                                    }
                                                >
                                                    {cell.render('Cell')}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );

                                if (row.original.link) {
                                    return (
                                        <SPAAnchor href={row.original.link} key={rowIndex}>
                                            {rowComponent}
                                        </SPAAnchor>
                                    );
                                }

                                if (row.original.sticky) return;

                                return rowComponent;
                            })}
                        </TableBody>
                    )}
                </TableView>
            </>
            {!hidePagination && data.length > 0 && (
                <PaginationContainer>
                    <tbody>
                        <tr>
                            <Pagination
                                rowsPerPageOptions={[10, 20, 50, 100]}
                                count={data.length ? data.length : 0}
                                rowsPerPage={pageSize}
                                page={pageIndex}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage={t('common.pagination.rows-per-page')}
                            />
                        </tr>
                    </tbody>
                </PaginationContainer>
            )}
        </>
    );
};

export default Table;
