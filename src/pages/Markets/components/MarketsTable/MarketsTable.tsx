/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { OptionsMarkets } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import { SortOption } from 'types/options';

import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { useTranslation } from 'react-i18next';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsOVM, getIsPolygon } from 'utils/network';

import Currency from 'components/Currency/v2';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import MarketsGrid from '../MarketsGrid';
import { FlexDivRow } from 'theme/common';
import TableGridSwitch from '../Input/TableGridSwitch';
import SearchField from '../Input/SearchField';
import PriceChart from 'components/Charts/PriceChart';
import { TablePagination } from '@material-ui/core';
import SortingMenu from 'components/SortingMenu';
import SPAAnchor from 'components/SPAAnchor';
import Tooltip from 'components/Tooltip';

import { formatCurrencyWithSign } from 'utils/formatters/number';
import { currencyKeyToDataFeedSourceMap, USD_SIGN } from 'constants/currency';
import { buildOptionsMarketLink } from 'utils/routes';

import { getSynthName } from 'utils/currency';

import './main.scss';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import Phase from '../Phase/Phase';
import { UI_COLORS } from 'constants/ui';

type MarketsTableProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
    watchlistedMarkets?: string[];
};

const MarketsTable: React.FC<MarketsTableProps> = ({ exchangeRates, optionsMarkets }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2OrPolygon = getIsOVM(networkId) || getIsPolygon(networkId);

    const { t } = useTranslation();

    const GridSortFilters: Array<SortOption> = [
        {
            property: 'asset',
            displayName: t(`options.home.markets-table.asset-col`),
            desc: false,
            asc: false,
        },
        {
            property: 'strikePrice',
            displayName: t(`options.home.markets-table.strike-price-col`),
            desc: false,
            asc: false,
        },
        {
            property: 'currentAssetPrice',
            displayName: t(`options.home.markets-table.current-asset-price-col`),
            desc: false,
            asc: false,
        },
        {
            property: 'timeRemaining',
            displayName: t(`options.home.markets-table.time-remaining-col`),
            desc: false,
            asc: false,
        },
        {
            property: 'phase',
            displayName: t(`options.home.markets-table.phase-col`),
            desc: false,
            asc: false,
        },
    ];
    const [allAssets, setAllAssets] = useState<Set<string>>(new Set());
    const [sortOptions, setSortOptions] = useState(GridSortFilters);
    const [tableView, setTableView] = useState<boolean>(window.innerWidth > 1250);
    const [showSorting, setShowSorting] = useState<boolean>(window.innerWidth > 768);
    const [assetFilters, setAssetFilters] = useState<string[]>([]);
    const [showOnlyLiquid, setOnlyLiquid] = useState<boolean>(true);
    // const [dataCount, setDataCount] = useState<number>(0);

    const labels = [t(`options.home.markets-table.menu.grid`), t(`options.home.markets-table.menu.table`)];
    const liquidSwitchLabels = [
        t(`options.home.markets-table.menu.only-liquid`),
        t(`options.home.markets-table.menu.all`),
    ];

    const updateSortOptions = (index: number) => {
        const newSortOptions = [...sortOptions];

        if (newSortOptions[index].asc) {
            newSortOptions[index].asc = false;
            newSortOptions[index].desc = true;
        } else if (newSortOptions[index].desc) {
            newSortOptions[index].asc = false;
            newSortOptions[index].desc = false;
        } else if (!newSortOptions[index].asc && !newSortOptions[index].desc) {
            newSortOptions[index].asc = true;
        }

        newSortOptions.forEach((item, itemIndex) => {
            if (index == itemIndex) return;
            item.asc = false;
            item.desc = false;
        });

        setSortOptions(newSortOptions);
    };

    const ammSort = useMemo(
        () => (rowA: any, rowB: any, columnId: string, desc: boolean) => {
            if (desc) {
                return +rowA.values[columnId].props.red > +rowB.values[columnId].props.red ? 1 : -1;
            } else {
                return +rowA.values[columnId].props.green < +rowB.values[columnId].props.green ? 1 : -1;
            }
        },
        []
    );

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
                                hideAssetName={true}
                                iconProps={{ type: 'asset' }}
                                synthIconStyle={{ width: 32, height: 32 }}
                                spanStyle={{ float: 'left' }}
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
                          sortType: ammSort,
                      },
                  ]
                : []),
            ...(isL2OrPolygon
                ? [
                      {
                          Header: t(`options.home.markets-table.price-up-down-col`),
                          accessor: (row: any) => <RatioText green={row.longPrice} red={row.shortPrice} />,
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

        const result = new Set(
            Array.from(set)
                .sort((a, b) => {
                    if (a === 'BTC' || a === 'sBTC') return -1;
                    if (b === 'BTC' || b === 'sETH') return 1;
                    if (a === 'ETH' || a === 'sETH') return -1;
                    if (b === 'ETH' || b === 'sETH') return 1;

                    if (a === 'SNX' || a === 'sSNX') return -1;
                    if (b === 'SNX' || b === 'sSNX') return 1;
                    if (a === 'LINK' || a === 'sLINK') return -1;
                    if (b === 'LINK' || b === 'sLINK') return 1;

                    return 0;
                })
                .slice(0, 11)
        );

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
    }, [globalFilter, showOnlyLiquid, assetFilters]);

    // useEffect(() => {
    //     setDataCount(data.length);
    // }, [data?.length, showOnlyLiquid, assetFilters, globalFilter]);

    useEffect(() => {
        setPageSize(20);
    }, []);

    const filters = useMemo(() => {
        return {
            searchQuery: globalFilter,
            sort: [
                ...sortOptions
                    .map((item) => {
                        if (item.asc || item.desc) {
                            return {
                                column: item.property as string,
                                type: item.asc ? ('asc' as const) : ('desc' as const),
                            };
                        }
                    })
                    .filter((item) => item),
            ],
            assetFilters: assetFilters,
            showOnlyLiquid,
        };
    }, [globalFilter, sortOptions, assetFilters, showOnlyLiquid]);

    return (
        <>
            <Wrapper>
                <FiltersButton onClick={() => setShowSorting(true)}>Filters</FiltersButton>
                <FilterContainer>
                    {allAssets.size > 0 &&
                        [...(allAssets as any)].map((value: string, index: number) => {
                            return (
                                <Item
                                    key={index}
                                    className={assetFilters.includes(value) ? 'active' : ''}
                                    onClick={() => {
                                        if (assetFilters.includes(value)) {
                                            const array = [...assetFilters];
                                            const index = array.indexOf(value);
                                            if (index !== -1) {
                                                array.splice(index, 1);
                                            }
                                            setAssetFilters(array);
                                        } else {
                                            setAssetFilters([...assetFilters, value]);
                                        }
                                    }}
                                >
                                    <CurrencyIcon
                                        synthIconStyle={{ marginRight: '0px !important' }}
                                        currencyKey={value}
                                    />
                                </Item>
                            );
                        })}
                </FilterContainer>
                <FormContainer>
                    <TableGridSwitch
                        value={!showOnlyLiquid}
                        labels={liquidSwitchLabels}
                        clickEventHandler={() => setOnlyLiquid(!showOnlyLiquid)}
                    />
                    <TableGridSwitch
                        value={tableView}
                        labels={labels}
                        clickEventHandler={() => setTableView(!tableView)}
                    />
                    <SearchField text={globalFilter} handleChange={(value) => setGlobalFilter(value)} />
                </FormContainer>
            </Wrapper>
            {!tableView && showSorting && (
                <SortingMenu
                    setShowSorting={setShowSorting}
                    items={sortOptions}
                    itemClickEventHandler={updateSortOptions}
                />
            )}
            {tableView && (
                <>
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map((headerGroup: any) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column: any) => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                                    <SPAAnchor href={buildOptionsMarketLink(row.original.address)}>
                                        <tr key={index} {...row.getRowProps()}>
                                            {row.cells.map((cell: any) => {
                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
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
            )}
            {!tableView && (
                <MarketsGrid optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} filters={filters} />
            )}
        </>
    );
};

export const PaginationWrapper = styled(TablePagination)`
    border: none !important;
    display: flex;
    width: 100%;
    max-width: 1200px;
    height: auto;
    color: var(--primary-color) !important;
    .MuiToolbar-root {
        padding: 0;
        display: flex;
        .MuiSelect-icon {
            color: #f6f6fe;
        }
        .MuiTablePagination-spacer {
            display: block;
        }
        .MuiTablePagination-caption {
            font-family: Roboto !important;
            font-style: normal;
        }
        .MuiTablePagination-toolbar {
            overflow: visible;
        }
    }

    .MuiTablePagination-selectRoot {
        font-family: Roboto !important;
        font-style: normal;
    }

    .MuiIconButton-root.Mui-disabled {
        color: var(--disabled-item);
    }
    .MuiTablePagination-toolbar > .MuiTablePagination-caption:last-of-type {
        display: block;
    }
    .MuiTablePagination-selectRoot {
        @media (max-width: 767px) {
            margin-left: 0px;
            margin-right: 0px;
        }
    }
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

const Arrow = styled.i`
    margin-left: 5px;
    font-size: 15px;
    text-transform: none;
    color: var(--table-header-text-color);
`;

const Wrapper = styled(FlexDivRow)`
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
    max-width: 1200px;
    align-items: flex-end;
    @media (max-width: 768px) {
        align-items: flex-start;
        max-width: 390px;
    }
`;

const FormContainer = styled.div`
    color: #64d9fe;
    display: flex;
    flex-direction: row;
    align-items: center;
    @media (max-width: 1250px) {
        display: none;
    }
`;

const FiltersButton = styled.div`
    display: none;
    padding: 6px 20px;
    border: 1.5px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 30px;
    background: transparent;
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 11px;
    text-transform: uppercase;
    color: #64d9fe;
    @media (max-width: 768px) {
        display: block;
    }
`;

const FilterContainer = styled.div`
    display: flex;
    align-items: stretch;
`;

const Item = styled.span`
    box-sizing: content-box;
    width: 50px;
    margin-bottom: -10px;
    color: var(--primary-color);
    cursor: pointer;
    text-align: center;
    opacity: 0.5;
    &.active {
        opacity: 1;
        box-shadow: 0px 4px var(--primary-filter-menu-active);
    }

    & > svg {
        width: 40px !important;
        height: 40px !important;
    }

    @media (max-width: 768px) {
        width: 32px;
        & > svg {
            width: 26px !important;
            height: 26px !important;
        }
    }
`;

const RatioText: React.FC<{ green: string; red: string }> = ({ green, red }) => {
    return (
        <span>
            <GreenText>{green}</GreenText> / <RedText>{red}</RedText>
        </span>
    );
};

export default MarketsTable;
