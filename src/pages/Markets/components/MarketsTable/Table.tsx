import React, { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import SPAAnchor from 'components/SPAAnchor';
import { buildOptionsMarketLink } from 'utils/routes';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { currencyKeyToDataFeedSourceMap, USD_SIGN } from 'constants/currency';
import { getIsOVM, getIsPolygon } from 'utils/network';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import Currency from 'components/Currency/v2';
import PriceChart from 'components/Charts/PriceChart';
import Tooltip from 'components/Tooltip';
import Phase from 'components/Phase/Phase';
import TimeRemaining from 'components/TimeRemaining';
import { getSynthName, sortCurrencies } from 'utils/currency';
import { PaginationWrapper } from './MarketsTable';
import { UI_COLORS } from 'constants/ui';
import { OptionsMarkets } from 'types/options';

const assetSort = () => (rowA: any, rowB: any) => {
    return rowA.original.asset.localeCompare(rowB.original.asset);
};

const ammSort = () => (rowA: any, rowB: any, columnId: string, desc: boolean) => {
    if (desc) {
        return +rowA.values[columnId].props.red > +rowB.values[columnId].props.red ? 1 : -1;
    } else {
        return +rowA.values[columnId].props.green < +rowB.values[columnId].props.green ? 1 : -1;
    }
};

const ammPriceSort = () => (rowA: any, rowB: any, columnId: string, desc: boolean) => {
    const leftPrice = rowA.values[columnId].props.red.slice(1);
    const rightPrice = rowB.values[columnId].props.red.slice(1);
    if (desc) {
        return Math.abs(Number(leftPrice) - 0.5) < Math.abs(Number(rightPrice) - 0.5) ? 1 : -1;
    } else {
        return +rowA.values[columnId].props.green.slice(1) < +rowB.values[columnId].props.green.slice(1) ? 1 : -1;
    }
};

const Table: React.FC<{
    optionsMarkets: OptionsMarkets;
    showOnlyLiquid: any;
    assetFilters: any;
    searchText: any;
    exchangeRates: any;
    setAllAssets: any;
}> = ({ optionsMarkets, showOnlyLiquid, assetFilters, searchText, exchangeRates, setAllAssets }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2OrPolygon = getIsOVM(networkId) || getIsPolygon(networkId);

    const { t } = useTranslation();

    const columns: Array<any> = useMemo(() => {
        return [
            {
                id: 'asset',
                Header: t(`options.home.markets-table.asset-col`),
                accessor: (row: any) => {
                    return (
                        <>
                            <Currency.Name
                                currencyKey={row?.currencyKey}
                                showIcon={true}
                                iconProps={{ type: 'asset' }}
                                synthIconStyle={{ width: 32, height: 32 }}
                                spanStyle={{ float: 'left' }}
                                hideAssetName={true}
                            />
                            {currencyKeyToDataFeedSourceMap[row?.currencyKey]?.source == 'TWAP' && (
                                <Tooltip
                                    message={t('options.home.markets-table.twap-tooltip')}
                                    link={currencyKeyToDataFeedSourceMap[row?.currencyKey]?.link}
                                    type={'info'}
                                    iconColor={'var(--primary-color)'}
                                    container={{ width: '15px' }}
                                    interactive={true}
                                />
                            )}
                        </>
                    );
                },
                sortType: assetSort(),
            },
            {
                id: 'strikePrice',
                Header: t(`options.home.markets-table.strike-price-col`),
                accessor: 'strikePrice',
                Cell: (_props: any) => formatCurrencyWithSign(USD_SIGN, _props?.cell?.value),
            },
            {
                id: 'currentPrice',
                Header: t(`options.home.markets-table.current-asset-price-col`),
                accessor: 'currentPrice',
                Cell: (_props: any) => formatCurrencyWithSign(USD_SIGN, _props?.cell?.value),
            },
            {
                Header: t(`options.home.markets-table.time-remaining-col`),
                accessor: 'timeRemaining',
                Cell: (_props: any) => {
                    return <TimeRemaining end={_props?.cell?.value} fontSize={14} showFullCounter={true} />;
                },
            },
            ...(isL2OrPolygon
                ? [
                      {
                          Header: t(`options.home.markets-table.amm-size-col`),
                          accessor: (row: any) => {
                              if (Number(row.availableLongs) > 0 || Number(row.availableShorts) > 0) {
                                  return (
                                      <RatioText
                                          green={Number(row.availableLongs).toFixed(1)}
                                          red={Number(row.availableShorts).toFixed(1)}
                                      />
                                  );
                              }
                              return (
                                  <YellowText>
                                      {row?.phase !== 'maturity'
                                          ? t('options.home.markets-table.out-of-liquidity')
                                          : t('options.market.overview.maturity-label')}
                                  </YellowText>
                              );
                          },
                          sortType: ammSort(),
                      },
                  ]
                : []),
            ...(isL2OrPolygon
                ? [
                      {
                          Header: t(`options.home.markets-table.price-up-down-col`),
                          accessor: (row: any) => <RatioText green={row.longPrice} red={row.shortPrice} />,
                          sortType: ammPriceSort(),
                      },
                  ]
                : []),
            {
                Header: t(`options.home.markets-table.phase-col`),
                accessor: 'phase',
                Cell: (_props: any) => {
                    return <Phase phase={_props?.cell?.value?.toLowerCase()}></Phase>;
                },
            },
            {
                id: 'priceChart',
                Header: t(`options.home.markets-table.24h-change-col`),
                accessor: (row: any) => (
                    <PriceChart
                        currencyKey={row?.currencyKey}
                        height={30}
                        width={125}
                        showFooter={false}
                        showPercentageChangeOnSide={true}
                        containerStyle={{ marginTop: '6px', marginBottom: '6px', marginLeft: '10px' }}
                        footerStyle={{ fontSize: '10px' }}
                        isAnimationActive={false}
                    />
                ),
                disableSortBy: true,
            },
        ];
    }, [optionsMarkets]);

    const data = useMemo(() => {
        const set: Set<string> = new Set();
        const processedMarkets = optionsMarkets
            .map((market) => {
                if (!market.customMarket) set.add(market.currencyKey);
                return {
                    address: market.address,
                    asset: market.asset,
                    currencyKey: market.currencyKey,
                    assetFullName: getSynthName(market.currencyKey),
                    availableLongs: market.availableLongs,
                    availableShorts: market.availableShorts,
                    longPrice: formatCurrencyWithSign(USD_SIGN, market.longPrice, 2),
                    shortPrice: formatCurrencyWithSign(USD_SIGN, market.shortPrice, 2),
                    strikePrice: market.strikePrice,
                    currentPrice: exchangeRates?.[market.currencyKey] || 0,
                    timeRemaining: market.timeRemaining,
                    phase: market.phase,
                };
            })
            .filter((market) => {
                if (!showOnlyLiquid) return market;
                if (market.availableLongs > 0 || market.availableShorts > 0) {
                    return market;
                }
            })
            .filter((market) => {
                if (assetFilters?.length) {
                    return assetFilters.includes(market.currencyKey);
                }
                return market;
            });

        const result = new Set(Array.from(set).sort(sortCurrencies).slice(0, 11));
        setAllAssets(result);

        return processedMarkets;
    }, [optionsMarkets, showOnlyLiquid, assetFilters]);

    // Custom global search filter -> useTable
    const ourGlobalFilterFunction = useCallback((rows: any, _columnIds: string[], filterValue: any) => {
        if (!filterValue) return rows;

        return rows.filter(
            (row: any) =>
                row?.original?.asset.toLowerCase().includes(filterValue.toLowerCase()) ||
                row?.original?.assetFullName.toLowerCase().includes(filterValue.toLowerCase()) ||
                row?.original?.currentPrice.toFixed(2).includes(filterValue) ||
                row?.original?.phase.includes(filterValue) ||
                row?.original?.longPrice.includes(filterValue) ||
                row?.original?.shortPrice.includes(filterValue) ||
                row?.original?.strikePrice.toFixed(2).includes(filterValue)
        );
    }, []);

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
            data: data,
            initalState: {
                pageIndex: 1,
            },
            globalFilter: ourGlobalFilterFunction,
            autoResetPage: false,
            autoResetSortBy: false,
            autoResetGlobalFilter: false,
            autoResetRowState: false,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    useEffect(() => {
        setGlobalFilter(searchText);
    }, [searchText]);

    const { pageIndex, pageSize, globalFilter } = state;

    const handleChangePage = (_event: any, newPage: number) => {
        gotoPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setPageSize(parseInt(event.target.value, 10));
        gotoPage(0);
    };

    useEffect(() => {
        gotoPage(0);
    }, [globalFilter, showOnlyLiquid]);

    useEffect(() => {
        setPageSize(20);
    }, []);

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup: any, index: number) => (
                        <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column: any, index2: number) => (
                                <th key={index2} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {
                                        <Arrow
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
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row: any, index: number) => {
                        prepareRow(row);
                        return (
                            <SPAAnchor key={index} href={buildOptionsMarketLink(row.original.address)}>
                                <tr key={index} {...row.getRowProps()}>
                                    {row.cells.map((cell: any, index: number) => {
                                        return (
                                            <td key={index} {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </SPAAnchor>
                        );
                    })}
                </tbody>
            </table>
            <PaginationWrapper
                rowsPerPageOptions={[5, 10, 20, 25]}
                count={rows?.length ? rows.length : 0}
                rowsPerPage={pageSize}
                page={pageIndex}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

const Arrow = styled.i`
    margin-left: 5px;
    font-size: 15px;
    text-transform: none;
    color: var(--table-header-text-color);
`;

const Text = styled.span`
    font-family: Roboto !important;
    font-style: normal;
    text-align: right !important;
`;

const GreenText = styled(Text)`
    color: #50ce99;
`;

const RedText = styled(Text)`
    color: #c3244a;
`;

const YellowText = styled(Text)`
    color: ${UI_COLORS.YELLOW};
`;

const RatioText: React.FC<{ green: string; red: string }> = ({ green, red }) => {
    return (
        <span>
            <GreenText>{green}</GreenText> / <RedText>{red}</RedText>
        </span>
    );
};

export default Table;