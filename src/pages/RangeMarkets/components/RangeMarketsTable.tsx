/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { RangedMarketInfo } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import { SortOption } from 'types/options';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { useTranslation } from 'react-i18next';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsOVM, getIsPolygon } from 'utils/network';
import Currency from 'components/Currency/v2';
import { FlexDivRow } from 'theme/common';
import PriceChart from 'components/Charts/PriceChart';
import { TablePagination } from '@material-ui/core';
import SortingMenu from 'components/SortingMenu';
import SPAAnchor from 'components/SPAAnchor';
import Tooltip from 'components/Tooltip';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { currencyKeyToDataFeedSourceMap, USD_SIGN } from 'constants/currency';
import { buildRangeMarketLink } from 'utils/routes';
import { getSynthName } from 'utils/currency';
import './main.scss';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import { UI_COLORS } from 'constants/ui';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import GridViewRangedMarkets from './GridViewRangedMarkets';
import { ReactComponent as PlusButton } from 'assets/images/asset-filters-plus.svg';
import OutsideClickHandler from 'react-outside-click-handler';
import { isMobile } from 'utils/device';
import TimeRemaining from 'components/TimeRemaining';
import AssetsDropdown from 'components/AssetsDropdown';
import TableGridSwitch from 'components/TableInputs/TableGridSwitch';
import SearchField from 'components/TableInputs/SearchField';
import PhaseComponent from 'components/Phase/Phase';
import { sortCurrencies } from 'utils/currency';
import { get, set } from 'utils/localStore';
import { mapGridToTableSort, mapTableToGridSort, TableColumnSort } from 'utils/table';
import { saveTableSort } from 'utils/table';

type RangeMarketsTableProps = {
    exchangeRates: Rates | null;
    optionsMarkets: RangedMarketInfo[];
    watchlistedMarkets?: string[];
};

const FILTERS_LENGTH = 6;
const DEFAULT_PAGE_SIZE = 20;
let scrolling: NodeJS.Timeout;

const RangeMarketsTable: React.FC<RangeMarketsTableProps> = ({ exchangeRates, optionsMarkets }) => {
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

    const showOnlyLiquidFromLocalStorage = localStorage.getItem(
        LOCAL_STORAGE_KEYS.RANGED_MARKET_SHOW_ONLY_LIQUID + networkId
    );
    const tableViewFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.RANGED_MARKET_TABLE_VIEW + networkId);
    const chosenAsset = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.RANGED_MARKET_CHOSEN_ASSET + networkId) || '[]'
    );

    const isWideDesktop = window.innerWidth > 1250;

    const [allAssets, setAllAssets] = useState<Set<string>>(new Set());
    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
    const [sortOptions, setSortOptions] = useState(GridSortFilters);
    const [tableView, setTableView] = useState<boolean>(
        isWideDesktop
            ? tableViewFromLocalStorage !== undefined
                ? tableViewFromLocalStorage === 'false'
                    ? false
                    : true
                : isWideDesktop
            : isWideDesktop
    );
    const [showSorting, setShowSorting] = useState<boolean>(window.innerWidth > 768);
    const [assetFilters, setAssetFilters] = useState<string[]>(chosenAsset);
    const [showOnlyLiquid, setOnlyLiquid] = useState<boolean>(
        showOnlyLiquidFromLocalStorage !== undefined
            ? showOnlyLiquidFromLocalStorage === 'false'
                ? false
                : true
            : true
    );
    const [assetsDropdownOpen, setAssetsDropdownOpen] = useState<boolean>(false);

    const labels = [t(`options.home.markets-table.menu.grid`), t(`options.home.markets-table.menu.table`)];
    const liquidSwitchLabels = [
        t(`options.home.markets-table.menu.only-liquid`),
        t(`options.home.markets-table.menu.all`),
    ];

    const safeSetSelectedAssets = useCallback(
        (assets) => {
            setSelectedAssets(assets);
            setAssetFilters(assetFilters.filter((filter) => assets.includes(filter)));
        },
        [setSelectedAssets, setAssetFilters, assetFilters]
    );

    useEffect(() => {
        const selectedAssetsLocalStorage = JSON.parse(localStorage.getItem(selectedAssetsLocalStorageKey) || '[]');
        if (!selectedAssetsLocalStorage.length) {
            setSelectedAssets([...(allAssets as any)].slice(0, FILTERS_LENGTH));
        }
    }, [allAssets]);

    useEffect(() => {
        setTableView(
            isWideDesktop
                ? tableViewFromLocalStorage !== undefined
                    ? tableViewFromLocalStorage === 'false'
                        ? false
                        : true
                    : isWideDesktop
                : isWideDesktop
        );
        setOnlyLiquid(
            showOnlyLiquidFromLocalStorage !== undefined
                ? showOnlyLiquidFromLocalStorage === 'false'
                    ? false
                    : true
                : true
        );

        const chosenAssetsLocalStorage = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEYS.RANGED_MARKET_CHOSEN_ASSET + networkId) || '[]'
        );
        chosenAssetsLocalStorage.length ? setAssetFilters(chosenAssetsLocalStorage) : setAssetFilters([]);
    }, [networkId]);

    const tableSortLocalStorageKey = LOCAL_STORAGE_KEYS.RANGED_MARKET_TABLE_SORTED_COLUMNS + networkId;
    const tableSortLocalStorageValue: TableColumnSort[] = get(tableSortLocalStorageKey) as [];

    useEffect(() => {
        if (tableSortLocalStorageValue) {
            const gridSortFilters = mapTableToGridSort(tableSortLocalStorageValue, GridSortFilters);
            setSortOptions(gridSortFilters);
        }
    }, [tableView]);

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

        const tableSortFormat = mapGridToTableSort(newSortOptions[index]);
        localStorage.setItem(tableSortLocalStorageKey, JSON.stringify(tableSortFormat));
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

    const ammPriceSort = useMemo(
        () => (rowA: any, rowB: any, columnId: string, desc: boolean) => {
            if (desc) {
                return +rowA.values[columnId].props.red.slice(1) > +rowB.values[columnId].props.red.slice(1) ? 1 : -1;
            } else {
                return +rowA.values[columnId].props.green.slice(1) < +rowB.values[columnId].props.green.slice(1)
                    ? 1
                    : -1;
            }
        },
        []
    );

    const columns: Array<any> = useMemo(() => {
        return [
            {
                id: 'asset',
                Header: t(`options.home.markets-table.asset-col`),
                accessor: 'asset',
                Cell: (_props: any) => {
                    return (
                        <>
                            <Currency.Name
                                currencyKey={_props?.value}
                                showIcon={true}
                                hideAssetName={true}
                                rangeMarket={true}
                                iconProps={{ type: 'asset' }}
                                synthIconStyle={{ width: 32, height: 32 }}
                                spanStyle={{ float: 'left' }}
                            />
                            {currencyKeyToDataFeedSourceMap[_props?.value]?.source == 'TWAP' && (
                                <Tooltip
                                    message={t('options.home.markets-table.twap-tooltip')}
                                    link={currencyKeyToDataFeedSourceMap[_props?.value]?.link}
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
            },
            {
                id: 'currentPrice',
                Header: t(`options.home.markets-table.current-asset-price-col`),
                accessor: 'currentPrice',
                Cell: (_props: any) => <span>{formatCurrencyWithSign(USD_SIGN, _props?.cell?.value)}</span>,
                sortType: 'basic',
            },
            {
                Header: t(`options.home.markets-table.time-remaining-col`),
                accessor: 'timeRemaining',
                Cell: (_props: any) => <TimeRemaining end={_props?.cell?.value} fontSize={14} showFullCounter={true} />,
            },
            ...(isL2OrPolygon
                ? [
                      {
                          Header: t(`options.home.markets-table.amm-size-col`),
                          accessor: (row: any) => {
                              if (Number(row.availableIn) > 0 || Number(row.availableOut) > 0) {
                                  return (
                                      <RatioText
                                          green={Number(row.availableIn).toFixed(1)}
                                          red={Number(row.availableOut).toFixed(1)}
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
                          Header: t(`options.home.markets-table.price-in-out-col`),
                          accessor: (row: any) => <RatioText green={row.inPrice} red={row.outPrice} />,
                          sortType: ammPriceSort,
                      },
                  ]
                : []),
            {
                Header: t(`options.home.markets-table.phase-col`),
                accessor: 'phase',
                Cell: (_props: any) => {
                    return <PhaseComponent phase={_props?.cell?.value?.toLowerCase()}></PhaseComponent>;
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

    const selectedAssetsLocalStorageKey = LOCAL_STORAGE_KEYS.RANGED_MARKET_SELECTED_ASSETS + networkId;

    const data = useMemo(() => {
        const set: Set<string> = new Set();
        const processedMarkets = optionsMarkets
            .filter((market) => {
                if (!showOnlyLiquid) return market;
                if (market.availableIn > 0 || market.availableOut > 0) {
                    return market;
                }
            })
            .map((market) => {
                set.add(market.currencyKey);
                return {
                    address: market.address,
                    asset: market.asset,
                    currencyKey: market.currencyKey,
                    assetFullName: getSynthName(market.currencyKey),
                    availableIn: market.availableIn,
                    availableOut: market.availableOut,
                    inPrice: formatCurrencyWithSign(USD_SIGN, market.inPrice, 2),
                    outPrice: formatCurrencyWithSign(USD_SIGN, market.outPrice, 2),
                    strikePrice: market.range,
                    currentPrice: exchangeRates?.[market.currencyKey] || 0,
                    timeRemaining: market.timeRemaining,
                    phase: market.phase,
                };
            })
            .filter((market) => {
                if (assetFilters?.length) {
                    return assetFilters.includes(market.currencyKey);
                }
                return market;
            });

        const allAssets = new Set(Array.from(set).sort(sortCurrencies));
        setAllAssets((prevAllAssets: Set<string>) => {
            if (prevAllAssets.size) {
                if (
                    prevAllAssets.size !== allAssets.size ||
                    !Array.from(prevAllAssets).every((element) => allAssets.has(element))
                ) {
                    return allAssets;
                }
            } else {
                return allAssets;
            }
            return prevAllAssets;
        });

        const selectedAssetsLocalStorage = JSON.parse(localStorage.getItem(selectedAssetsLocalStorageKey) || '[]');
        if (!selectedAssetsLocalStorage.length || allAssets.size > 0) {
            const chosenAssetsLocalStorage = JSON.parse(
                localStorage.getItem(LOCAL_STORAGE_KEYS.RANGED_MARKET_CHOSEN_ASSET + networkId) || '[]'
            );

            if (selectedAssetsLocalStorage.length && allAssets.size) {
                const newSelectedAssets: string[] = selectedAssetsLocalStorage.filter(
                    (asset: string) =>
                        allAssets.has(asset) ||
                        (chosenAssetsLocalStorage.length ? chosenAssetsLocalStorage.includes(asset) : false)
                );
                localStorage.setItem(selectedAssetsLocalStorageKey, JSON.stringify(newSelectedAssets));
                setSelectedAssets(newSelectedAssets);
            }
        }

        return processedMarkets;
    }, [optionsMarkets, showOnlyLiquid, assetFilters]);

    useEffect(() => {
        if (assetFilters !== chosenAsset) {
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.RANGED_MARKET_CHOSEN_ASSET + networkId,
                JSON.stringify(assetFilters?.length ? assetFilters : [])
            );
        }

        if (
            showOnlyLiquidFromLocalStorage == undefined ||
            showOnlyLiquidFromLocalStorage !== showOnlyLiquid.toString()
        ) {
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.RANGED_MARKET_SHOW_ONLY_LIQUID + networkId,
                JSON.stringify(showOnlyLiquid)
            );
        }

        if (tableViewFromLocalStorage == undefined || tableViewFromLocalStorage !== tableView.toString()) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.RANGED_MARKET_TABLE_VIEW + networkId, JSON.stringify(tableView));
        }
    }, [assetFilters, showOnlyLiquid, tableView]);

    // Custom global search filter -> useTable
    const ourGlobalFilterFunction = useCallback((rows: any, _columnIds: string[], filterValue: any) => {
        if (!filterValue) return rows;
        return rows.filter(
            (row: any) =>
                row?.original?.asset.toLowerCase().includes(filterValue.toLowerCase()) ||
                row?.original?.assetFullName.toLowerCase().includes(filterValue.toLowerCase()) ||
                row?.original?.currentPrice.toFixed(2).includes(filterValue) ||
                row?.original?.phase.includes(filterValue) ||
                row?.original?.inPrice.includes(filterValue) ||
                row?.original?.outPrice.includes(filterValue) ||
                row?.original?.strikePrice.includes(filterValue)
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
        setSortBy,
        disableMultiSort,
        isMultiSortEvent = (e: any) => e.shiftKey,
        gotoPage,
        setPageSize,
    } = useTable(
        {
            columns,
            data: data,
            initialState: {
                pageIndex: 0,
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
        const tableSortLocalStorageValue = get(tableSortLocalStorageKey) as [];
        if (tableSortLocalStorageValue) {
            setSortBy(tableSortLocalStorageValue);
        }
    }, [tableView]);

    const { pageIndex, pageSize, globalFilter } = state;

    const handleChangePage = (_event: any, newPage: number) => {
        gotoPage(newPage);
    };

    const pageSizeLocalStorageKey = LOCAL_STORAGE_KEYS.RANGED_MARKET_TABLE_PAGE_SIZE + networkId;
    const handleChangeRowsPerPage = (event: any) => {
        const userPageSize = parseInt(event.target.value, 10);
        setPageSize(userPageSize);
        gotoPage(0);
        set(pageSizeLocalStorageKey, userPageSize);
    };

    useEffect(() => {
        gotoPage(0);
    }, [globalFilter, showOnlyLiquid, assetFilters]);

    useEffect(() => {
        const userPageSize: number | undefined = get(pageSizeLocalStorageKey);
        setPageSize(userPageSize ? userPageSize : DEFAULT_PAGE_SIZE);
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
                <FiltersButton onClick={() => setShowSorting(true)}>Sort</FiltersButton>
                <FilterContainer>
                    <ArrowIcon
                        visible={selectedAssets.length > FILTERS_LENGTH}
                        onMouseOver={() => {
                            const scrollLeft = () => {
                                const filtersDiv = document.getElementById('asset-filters');
                                if (filtersDiv) {
                                    filtersDiv.scrollLeft = filtersDiv.scrollLeft - 2;
                                }
                            };
                            scrolling = setInterval(scrollLeft, 10);
                        }}
                        onMouseOut={() => {
                            clearInterval(scrolling);
                        }}
                        className={'icon icon--left'}
                    />
                    <Filters length={allAssets.size} id="asset-filters">
                        {selectedAssets.length > 0 &&
                            selectedAssets.map((value: string, index: number) => {
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
                    </Filters>
                    <ArrowIcon
                        visible={selectedAssets.length > FILTERS_LENGTH}
                        onMouseOver={() => {
                            const scrollRight = () => {
                                const filtersDiv = document.getElementById('asset-filters');
                                if (filtersDiv) {
                                    filtersDiv.scrollLeft = filtersDiv.scrollLeft + 2;
                                }
                            };
                            scrolling = setInterval(scrollRight, 10);
                        }}
                        onMouseOut={() => {
                            clearInterval(scrolling);
                        }}
                        className={'icon icon--right'}
                    />
                    <OutsideClickHandler onOutsideClick={() => setAssetsDropdownOpen(false)}>
                        <AssetsDropdownContainer>
                            <StyledPlusButton onClick={() => setAssetsDropdownOpen(!assetsDropdownOpen)} />
                            {assetsDropdownOpen && (
                                <AssetsDropdown
                                    assets={[...(allAssets as any)]}
                                    localStorageKey={LOCAL_STORAGE_KEYS.RANGED_MARKET_SELECTED_ASSETS}
                                    selectedAssets={selectedAssets}
                                    setSelectedAssets={safeSetSelectedAssets}
                                />
                            )}
                        </AssetsDropdownContainer>
                    </OutsideClickHandler>
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
                            {headerGroups.map((headerGroup: any, index: number) => (
                                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column: any, thIndex: number) => (
                                        <th
                                            key={thIndex}
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            onClick={
                                                column.canSort
                                                    ? (e) => {
                                                          e.persist();
                                                          const isMultiSort = !disableMultiSort && isMultiSortEvent(e);
                                                          column.toggleSortBy(undefined, isMultiSort);
                                                          saveTableSort(tableSortLocalStorageKey, {
                                                              id: column.id,
                                                              desc: column.isSortedDesc,
                                                              isMultiSort: isMultiSort,
                                                          });
                                                      }
                                                    : undefined
                                            }
                                        >
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
                                    <SPAAnchor key={'a' + index} href={buildRangeMarketLink(row.original.address)}>
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
                        rowsPerPageOptions={[10, 20, 30, 50]}
                        count={rows?.length ? rows.length : 0}
                        rowsPerPage={pageSize}
                        page={pageIndex}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
            {!tableView && (
                <GridViewRangedMarkets
                    optionsMarkets={optionsMarkets as any}
                    exchangeRates={exchangeRates}
                    filters={filters}
                />
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
    color: #b0ffe7;
`;

const RedText = styled(Text)`
    color: #bf7eff;
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
    margin-bottom: 5px;
    max-width: 1200px;
    align-items: center;
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
    align-items: center;
`;

const Filters = styled.div<{ length: number }>`
    width: ${(_props) =>
        (_props.length < FILTERS_LENGTH ? _props.length : FILTERS_LENGTH) * ((isMobile() ? 26 : 40) + 5)}px;
    overflow: hidden;
    display: flex;
    height: 60px;
    margin-bottom: -20px;
    @media (max-width: 768px) {
        height: 45px;
    }
`;

const Item = styled.span`
    box-sizing: content-box;
    width: 50px;
    height: 45px;
    margin-bottom: -10px;
    color: var(--primary-color);
    cursor: pointer;
    text-align: center;
    opacity: 0.5;
    padding-left: 5px;
    &.active {
        opacity: 1;
        box-shadow: 0px 4px var(--primary-filter-menu-active);
    }

    & svg {
        width: 40px !important;
        height: 40px !important;
    }

    @media (max-width: 768px) {
        width: 32px;
        & svg {
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

const ArrowIcon = styled.i<{ visible?: boolean; disabled?: boolean }>`
    visibility: ${(_props) => (_props?.visible ? 'visible' : 'hidden')};
    cursor: pointer;
    font-size: 20px;
    color: ${(_props) => (_props?.disabled ? 'var(--hotmarket-arrow-disable)' : 'var(--hotmarket-arrow-enabled)')};
    pointer-events: ${(_props) => (_props?.disabled ? 'none' : 'auto')};
`;

const StyledPlusButton = styled(PlusButton)`
    padding-left: 5px;
    cursor: pointer;
`;

const AssetsDropdownContainer = styled.div`
    position: relative;
    right: 0;
    top: 0;
`;

export default RangeMarketsTable;
