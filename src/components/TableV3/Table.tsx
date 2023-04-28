import React, { useMemo, DependencyList, CSSProperties, useEffect, useState } from 'react';
import { useTable, useSortBy, Column, Row, usePagination } from 'react-table';
import SimpleLoader from 'components/SimpleLoader';
import styled from 'styled-components';
import { SortDirection } from 'utils/options';
import { FlexDiv, FlexDivCentered } from 'theme/common';
import useExchangeRatesQuery, { Rates } from 'queries/rates/useExchangeRatesQuery';
import { OptionsMarkets } from 'types/options';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';

type CSSPropertiesWithMedia = { cssProperties: CSSProperties } & { mediaMaxWidth: string };

type ColumnWithSorting<D extends Record<string, unknown>> = Column<D> & {
    sortType?: string | ((rowA: any, rowB: any, columnId?: string, desc?: boolean) => number);
    sortable?: boolean;
    headStyle?: CSSPropertiesWithMedia;
    headTitleStyle?: CSSPropertiesWithMedia;
};

type TableProps = {
    data: Record<string, unknown>[];
    columns: ColumnWithSorting<Record<string, unknown>>[];
    columnsDeps?: DependencyList;
    options?: any;
    onTableRowClick?: (row: Row<any>) => void;
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
    expandedRow?: (row: Row<any>) => JSX.Element;
    stickyRow?: JSX.Element;
    showCurrentPrice?: boolean;
    hover?: string;
    selectedRowIndex?: number;
    selectedRowColor?: string;
    highlightMarkets?: Set<string>;
};

const Table: React.FC<TableProps> = ({
    columns = [],

    data = [],
    options = {},
    noResultsMessage = null,
    onTableRowClick = undefined,
    isLoading = false,
    tableRowHeadStyles = {},
    tableRowStyles = {},
    tableHeadCellStyles = {},
    tableRowCellStyles = {},
    initialState = {},
    onSortByChanged = undefined,
    currentPage,
    rowsPerPage,
    expandedRow,
    stickyRow,
    showCurrentPrice,
    hover,
    selectedRowIndex,
    selectedRowColor,
    highlightMarkets,
}) => {
    const [lastValidRates, setRates] = useState<Rates>();

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery({ enabled: showCurrentPrice });

    useEffect(() => {
        if (exchangeRatesMarketDataQuery.isSuccess && exchangeRatesMarketDataQuery.data) {
            setRates(exchangeRatesMarketDataQuery.data);
        }
    }, [exchangeRatesMarketDataQuery.isSuccess, exchangeRatesMarketDataQuery.data]);

    const exchangeRates: Rates | undefined = useMemo(() => {
        if (exchangeRatesMarketDataQuery.isSuccess && exchangeRatesMarketDataQuery.data) {
            return exchangeRatesMarketDataQuery.data;
        }
        return lastValidRates;
    }, [exchangeRatesMarketDataQuery.isSuccess, exchangeRatesMarketDataQuery.data, lastValidRates]);

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
            columns: columns,
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

    const indexForDrawingAndPrice = useMemo(() => {
        if (exchangeRates) {
            const markets: OptionsMarkets = data as OptionsMarkets;
            if (markets.length > 0) {
                const currentPrice = exchangeRates[markets[0].currencyKey];
                let indexOfElement = 0;
                for (let i = 0; i < markets.length; i++) {
                    if (i === markets.length - 1) {
                        indexOfElement = i;
                        break;
                    }
                    if (markets[i].strikePrice > currentPrice && markets[i + 1].strikePrice < currentPrice) {
                        indexOfElement = i;
                        break;
                    }
                }
                return { index: indexOfElement, price: currentPrice };
            }
        }
    }, [exchangeRates, data]);

    return (
        <>
            {headerGroups.map((headerGroup, headerGroupIndex: any) => (
                <TableRowHead style={tableRowHeadStyles} {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                    {headerGroup.headers.map((column: any, headerIndex: any) => (
                        <TableCellHead
                            {...column.getHeaderProps(column.sortable ? column.getSortByToggleProps() : undefined)}
                            cssProp={column.headStyle}
                            key={headerIndex}
                            style={
                                column.sortable
                                    ? { cursor: 'pointer', ...tableHeadCellStyles }
                                    : { ...tableHeadCellStyles }
                            }
                            width={column.width}
                            id={column.id}
                        >
                            <HeaderTitle cssProp={column.headTitleStyle}>{column.render('Header')}</HeaderTitle>
                            {column.sortable && (
                                <SortIconContainer>
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <SortIcon selected sortDirection={SortDirection.DESC} />
                                        ) : (
                                            <SortIcon selected sortDirection={SortDirection.ASC} />
                                        )
                                    ) : (
                                        <SortIcon selected={false} sortDirection={SortDirection.NONE} />
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
                ) : noResultsMessage != null && !data?.length ? (
                    <NoResultContainer>{noResultsMessage}</NoResultContainer>
                ) : (
                    <TableBody {...getTableBodyProps()}>
                        {stickyRow ?? <></>}
                        {(currentPage !== undefined ? page : rows).map((row, rowIndex: any) => {
                            const highlight = highlightMarkets?.has((row.original as any).address.toLowerCase());

                            prepareRow(row);

                            return (
                                <ExpandableRow key={rowIndex}>
                                    {expandedRow ? (
                                        <ExpandableRowReact
                                            row={row}
                                            tableRowCellStyles={tableRowCellStyles}
                                            isVisible={false}
                                            tableRowStyles={tableRowStyles}
                                        >
                                            {expandedRow(row)}
                                        </ExpandableRowReact>
                                    ) : (
                                        <>
                                            <TableRow
                                                background={
                                                    highlight
                                                        ? 'var(--color-highlight-2)'
                                                        : selectedRowIndex && selectedRowIndex === rowIndex
                                                        ? selectedRowColor
                                                        : 'transparent'
                                                }
                                                hover={
                                                    selectedRowIndex && selectedRowIndex === rowIndex
                                                        ? selectedRowColor
                                                        : hover
                                                }
                                                style={tableRowStyles}
                                                {...row.getRowProps()}
                                                cursorPointer={!!onTableRowClick}
                                                onClick={onTableRowClick ? () => onTableRowClick(row) : undefined}
                                            >
                                                {row.cells.map((cell, cellIndex: any) => {
                                                    return (
                                                        <TableCell
                                                            style={tableRowCellStyles}
                                                            {...cell.getCellProps()}
                                                            key={cellIndex}
                                                            width={cell.column.width}
                                                            id={cell.column.id}
                                                        >
                                                            {cell.render('Cell')}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                            {showCurrentPrice && indexForDrawingAndPrice?.index === rowIndex && (
                                                <PriceWrapper>
                                                    <Price>
                                                        {formatCurrencyWithSign(
                                                            USD_SIGN,
                                                            indexForDrawingAndPrice?.price ?? 0,
                                                            2
                                                        )}
                                                    </Price>
                                                </PriceWrapper>
                                            )}
                                        </>
                                    )}
                                </ExpandableRow>
                            );
                        })}
                    </TableBody>
                )}
            </ReactTable>
        </>
    );
};

const PriceWrapper = styled.div`
    width: 100%;
    height: 0;
    border-top: 1px dashed #fff;
    margin: 8px 0;
    position: relative;
`;

const Price = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    border-radius: 28px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 4px 12px;
    background-color: var(--color-highlight);
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ExpandableRowReact: React.FC<{
    isVisible: boolean;
    tableRowStyles: React.CSSProperties;
    row: Row<any>;
    tableRowCellStyles: React.CSSProperties;
}> = ({ isVisible, tableRowStyles, row, tableRowCellStyles, children }) => {
    const [hidden, setHidden] = useState<boolean>(!isVisible);

    return (
        <>
            <TableRow
                style={{ ...tableRowStyles, borderBottom: hidden ? '' : 'none' }}
                {...row.getRowProps()}
                cursorPointer={true}
                onClick={setHidden.bind(this, !hidden)}
            >
                {row.cells.map((cell, cellIndex: any) => (
                    <TableCell
                        style={tableRowCellStyles}
                        {...cell.getCellProps()}
                        key={cellIndex}
                        width={cell.column.width}
                        id={cell.column.id}
                    >
                        {cell.render('Cell')}
                    </TableCell>
                ))}
                <ArrowIcon className={hidden ? 'icon icon--arrow-down' : 'icon icon--arrow-up'} />
            </TableRow>
            <ExpandableRow style={{ display: hidden ? 'none' : 'block' }}>{children}</ExpandableRow>
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
`;

const TableRow = styled(FlexDiv)<{ cursorPointer?: boolean; hover?: string; background?: string }>`
    cursor: ${(props) => (props.cursorPointer ? 'pointer' : 'default')};
    min-height: 38px;
    font-weight: 600;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0.25px;
    border-bottom: 2px dotted #111221;
    background-color: ${(props) => (props.background ? props.background : 'transparent')};
    &:hover {
        background-color: ${(props) => (props.hover ? props.hover : 'transparent')};
    }
`;

const TableRowHead = styled(TableRow)`
    min-height: 40px;
`;

const TableCell = styled(FlexDivCentered)<{ width?: number | string; id: string }>`
    flex: 1;
    min-width: 0px;
    max-width: ${(props) => (props.width ? props.width : 'initial')};
    justify-content: ${(props) => CellAlignment[props.id] || 'left'};
    &:first-child {
        padding-left: 18px;
    }
    &:last-child {
        padding-right: 18px;
    }
    @media (max-width: 767px) {
        font-size: 12px;
        &:first-child {
            padding-left: 6px;
        }
        &:last-child {
            padding-right: 6px;
        }
    }
    @media (max-width: 512px) {
        font-size: 10px;
        &:first-child {
            padding-left: 6px;
        }
        &:last-child {
            padding-right: 0;
        }
    }
`;

const TableCellHead = styled(TableCell)<{ cssProp?: CSSPropertiesWithMedia }>`
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.5px;
    @media (max-width: 767px) {
        font-size: 13px;
    }
    @media (max-width: ${(props) => (props.cssProp ? props.cssProp.mediaMaxWidth : '600px')}) {
        ${(props) => (props.cssProp ? { ...props.cssProp.cssProperties } : '')}
    }
    @media (max-width: 512px) {
        font-size: 10px;
    }
    user-select: none;
`;

const HeaderTitle = styled.span<{ cssProp?: CSSPropertiesWithMedia }>`
    text-transform: uppercase;
    @media (max-width: ${(props) => (props.cssProp ? props.cssProp.mediaMaxWidth : '600px')}) {
        ${(props) => (props.cssProp ? { ...props.cssProp.cssProperties } : '')}
    }
`;

const SortIconContainer = styled.span`
    display: flex;
    align-items: center;
`;

const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 228px;
    width: 100%;
`;

const NoResultContainer = styled(TableRow)`
    height: 60px;
    padding-top: 20px;
    padding-left: 18px;
    font-size: 14px;
    border: none;
    margin: auto;
`;

const SortIcon = styled.i<{ selected: boolean; sortDirection: SortDirection }>`
    font-size: ${(props) => (props.selected && props.sortDirection !== SortDirection.NONE ? 22 : 19)}px;
    &:before {
        font-family: ExoticIcons !important;
        content: ${(props) =>
            props.selected
                ? props.sortDirection === SortDirection.ASC
                    ? "'\\0046'"
                    : props.sortDirection === SortDirection.DESC
                    ? "'\\0047'"
                    : "'\\0045'"
                : "'\\0045'"};
    }
    @media (max-width: 512px) {
        font-size: ${(props) => (props.selected && props.sortDirection !== SortDirection.NONE ? 17 : 14)}px;
    }
`;

const CellAlignment: Record<string, string> = {
    wallet: 'center',
    points: 'center',
    rewards: 'center',
    finishTime: 'center',
};

const ExpandableRow = styled.div`
    display: block;
`;

const ArrowIcon = styled.i`
    font-size: 9px;
    display: flex;
    align-items: center;
    margin-right: 6px;
`;

export default Table;
