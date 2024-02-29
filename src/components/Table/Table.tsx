import SPAAnchor from 'components/SPAAnchor';
import SimpleLoader from 'components/SimpleLoader';
import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useExchangeRatesQuery, { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { CSSProperties, DependencyList, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Column, Row, usePagination, useSortBy, useTable } from 'react-table';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered } from 'styles/common';
import { OptionsMarkets } from 'types/options';
import { formatCurrencyWithSign } from 'thales-utils';

enum SortDirection {
    NONE,
    ASC,
    DESC,
}

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
    tableRowWrapperStyles?: CSSProperties;
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
    selectedRowIndex?: number;
    hoverColor?: string;
};

const Table: React.FC<TableProps> = ({
    columns = [],
    data = [],
    options = {},
    noResultsMessage = null,
    onTableRowClick = undefined,
    isLoading = false,
    tableRowHeadStyles = {},
    tableRowWrapperStyles = {},
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
    selectedRowIndex,
    hoverColor,
}) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [lastValidRates, setRates] = useState<Rates>();

    const containerRef = useRef('');
    const elementRef = useRef('');

    useEffect(() => {
        if (elementRef.current && containerRef.current) {
            const container: any = containerRef.current;
            const element: any = elementRef.current;

            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            const offset = elementRect.top - containerRect.top;
            container.scrollTop += offset;
        }
    }, []);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery(networkId, { enabled: isAppReady && showCurrentPrice });

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
    }, [state.sortBy, onSortByChanged]);

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
                            width={column.headWidth || column.width}
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
                    <TableBody ref={containerRef as any} {...getTableBodyProps()}>
                        {stickyRow ?? <></>}
                        {(currentPage !== undefined ? page : rows).map((row, rowIndex: any) => {
                            prepareRow(row);

                            return (
                                <TableRowWrapper key={rowIndex}>
                                    {(row.original as any).rank ? <Rank>{(row.original as any).rank}</Rank> : <></>}
                                    <ExpandableRow style={tableRowWrapperStyles}>
                                        {expandedRow ? (
                                            <ExpandableRowReact
                                                row={row}
                                                tableRowCellStyles={tableRowCellStyles}
                                                tableRowStyles={tableRowStyles}
                                                isVisible={false}
                                                hoverColor={hoverColor}
                                            >
                                                {expandedRow(row)}
                                            </ExpandableRowReact>
                                        ) : (
                                            <>
                                                {(row.original as any).url && selectedRowIndex === rowIndex ? (
                                                    <SPAAnchor href={(row.original as any).url} key={rowIndex}>
                                                        <TableRow
                                                            selected={selectedRowIndex === rowIndex}
                                                            style={tableRowStyles}
                                                            {...row.getRowProps()}
                                                            cursorPointer={!!onTableRowClick}
                                                            onClick={
                                                                onTableRowClick ? () => onTableRowClick(row) : undefined
                                                            }
                                                            hover={hoverColor}
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
                                                    </SPAAnchor>
                                                ) : (
                                                    <TableRow
                                                        selected={selectedRowIndex === rowIndex}
                                                        style={tableRowStyles}
                                                        {...row.getRowProps()}
                                                        cursorPointer={!!onTableRowClick}
                                                        onClick={
                                                            onTableRowClick ? () => onTableRowClick(row) : undefined
                                                        }
                                                        hover={hoverColor}
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
                                                )}

                                                {showCurrentPrice && indexForDrawingAndPrice?.index === rowIndex && (
                                                    <PriceWrapper ref={elementRef as any}>
                                                        <Price>
                                                            {(indexForDrawingAndPrice?.price as any) < 0.01
                                                                ? formatCurrencyWithSign(
                                                                      USD_SIGN,
                                                                      indexForDrawingAndPrice?.price ?? 0
                                                                  )
                                                                : formatCurrencyWithSign(
                                                                      USD_SIGN,
                                                                      indexForDrawingAndPrice?.price ?? 0,
                                                                      2
                                                                  )}
                                                        </Price>
                                                        <DirectedArrowIcon
                                                            className="icon icon--caret-up"
                                                            top="-12px"
                                                        />
                                                        <DirectedArrowIcon className="icon icon--caret-down" top="0" />
                                                    </PriceWrapper>
                                                )}
                                            </>
                                        )}
                                    </ExpandableRow>
                                </TableRowWrapper>
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
    border-top: 1px dashed ${(props) => props.theme.borderColor.tertiary};
    margin: 9px 0 10px 0;
    position: relative;
`;

const Rank = styled.div`
    width: 50px;
    height: 50px;
    min-width: 50px;
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%;
    align-self: flex-start;
    margin-right: 4px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 30px;
        height: 30px;
        min-width: 30px;
    }
`;

const Price = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 80px;
    border-radius: 22px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 3px 10px;
    background-color: ${(props) => props.theme.background.primary};
    display: flex;
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-weight: 700;
    font-size: 10px;

    text-align: center;
    color: ${(props) => props.theme.borderColor.tertiary};
`;

const ExpandableRowReact: React.FC<{
    isVisible: boolean;
    row: Row<any>;
    tableRowStyles: React.CSSProperties;
    tableRowCellStyles: React.CSSProperties;
    hoverColor?: string;
}> = ({ isVisible, row, tableRowStyles, tableRowCellStyles, children, hoverColor }) => {
    const [hidden, setHidden] = useState<boolean>(!isVisible);

    return (
        <>
            <TableRow
                {...row.getRowProps()}
                cursorPointer={true}
                style={tableRowStyles}
                onClick={setHidden.bind(this, !hidden)}
                hover={hoverColor}
            >
                {row.cells.map((cell, cellIndex: any) => {
                    if (cell.column.id === 'rank') return;
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

const TableRowWrapper = styled(FlexDiv)`
    margin-bottom: 4px;
`;

const TableRow = styled(FlexDiv)<{ cursorPointer?: boolean; background?: string; selected?: boolean; hover?: string }>`
    cursor: ${(props) => (props.cursorPointer ? 'pointer' : 'default')};
    background-color: ${(props) => (props.selected ? props.theme.background.quaternary : 'transparent')};
    &:hover {
        background-color: ${(props) =>
            props.selected ? props.theme.background.quaternary : props.hover ?? 'transparent'};
    }

    justify-content: space-between;
    align-items: center;
    height: 100%;
    height: 48px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: 28px;
    }
`;

const TableRowHead = styled(TableRow)`
    &:hover {
        background-color: transparent !important;
    }
`;

const TableCell = styled(FlexDivCentered)<{ width?: number | string; id: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => (props.width ? props.width : 'initial')};
    &#multiplier {
        @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
            display: none;
        }
    }
`;

const TableCellHead = styled(FlexDivCentered)<{
    width?: string;
    id: string;
    cssProp?: CSSPropertiesWithMedia;
}>`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    width: ${(props) => (props.width ? props.width : 'initial')};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
        &#multiplier {
            display: none;
        }
    }
    @media (max-width: ${(props) => (props.cssProp ? props.cssProp.mediaMaxWidth : '600px')}) {
        ${(props) => (props.cssProp ? { ...props.cssProp.cssProperties } : '')}
    }
    user-select: none;
    &#rank {
        max-width: 50px;
        @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
            max-width: 30px;
        }
    }
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
    margin-left: 4px;
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
    display: flex;
    font-size: ${(props) => (props.selected && props.sortDirection !== SortDirection.NONE ? 10 : 14)}px;
    color: ${(props) => props.theme.textColor.primary};
    &:before {
        font-family: Icons !important;
        content: ${(props) =>
            props.selected
                ? props.sortDirection === SortDirection.ASC
                    ? "'\\0022'"
                    : props.sortDirection === SortDirection.DESC
                    ? "'\\0021'"
                    : "'\\0023'"
                : "'\\0023'"};
    }
    @media (max-width: 512px) {
        font-size: ${(props) => (props.selected && props.sortDirection !== SortDirection.NONE ? 8 : 10)}px;
    }
`;

const ExpandableRow = styled.div`
    display: block;
`;

const DirectedArrowIcon = styled.i<{ top: string }>`
    position: absolute;
    top: ${(props) => props.top};
    right: 0;
    color: ${(props) => props.theme.borderColor.tertiary};
    font-size: 11px;
`;

export default Table;
