import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { OptionsMarkets, GridFilters, SortOption } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

import { FlexDiv } from 'theme/common';
import MarketCard from 'components/MarketCard/MarketCard';
import { PaginationWrapper } from '../MarketsTable/MarketsTable';

import SPAAnchor from 'components/SPAAnchor';
import { buildOptionsMarketLink } from 'utils/routes';
import { getSynthName, sortCurrencies } from 'utils/currency';
import { useTranslation } from 'react-i18next';
import SortingMenu from 'components/SortingMenu';

import { get, set } from 'utils/localStore';
import { mapGridToTableSort, mapTableToGridSort, TableColumnSort } from 'utils/table';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { NetworkId } from 'utils/network';

type MarketsGridProps = {
    networkId: NetworkId;
    optionsMarkets: OptionsMarkets;
    exchangeRates: Rates | null;
    filters: GridFilters;
    setAllAssets: any;
};

const MarketsGrid: React.FC<MarketsGridProps> = ({
    networkId,
    optionsMarkets,
    exchangeRates,
    filters,
    setAllAssets,
}) => {
    const [rowsPerPage, setRowsPerPage] = useState<number>(9);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [dataCount, setDataCount] = useState<number>(optionsMarkets?.length || 0);

    const [showSorting, setShowSorting] = useState<boolean>(window.innerWidth > 768);

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

    const [sortOptions, setSortOptions] = useState(GridSortFilters);

    const options = useMemo(() => {
        let data = optionsMarkets;
        if (data.length > 0) {
            if (filters?.assetFilters?.length) {
                data = data.filter((market) => {
                    return filters.assetFilters.includes(market.currencyKey);
                });
            }

            if (filters?.showOnlyLiquid) {
                data = data.filter((market) => {
                    return market.availableLongs > 0 || market.availableShorts > 0;
                });
            }

            if (filters?.searchQuery) {
                data = data.filter((market) => {
                    if (market?.asset.toLowerCase().includes(filters.searchQuery.toLowerCase())) return market;
                    const assetFullName = getSynthName(market.currencyKey).toLowerCase();
                    if (assetFullName.includes(filters.searchQuery.toLowerCase())) return market;
                    if (market?.strikePrice.toFixed(2).includes(filters.searchQuery)) return market;
                    if (exchangeRates && exchangeRates[market.currencyKey]) {
                        if (exchangeRates[market.currencyKey].toFixed(2).includes(filters.searchQuery)) return market;
                    }
                    if (market?.phase.includes(filters.searchQuery)) return market;
                });
            }

            data = data.map((market) => {
                // currentAssetPrice is required because it is part of GridSortFilters
                return { ...market, currentAssetPrice: exchangeRates?.[market?.currencyKey] || 0 };
            });

            if (data.length) {
                sortOptions.forEach((sort) => {
                    if (sort?.property && typeof (data as any)[0][sort.property] == 'number') {
                        if (sort.asc) data = _.orderBy(data, [sort.property], 'asc');
                        if (sort.desc) data = _.orderBy(data, [sort.property], 'desc');
                    }

                    if (sort?.property && typeof (data as any)[0][sort?.property] == 'string') {
                        if (sort.asc) data = _.orderBy(data, [sort.property], 'asc');
                        if (sort.desc) data = _.orderBy(data, [sort.property], 'desc');
                    }
                });
            }

            setDataCount(data?.length || 0);
            data = data.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);

            return data;
        }
    }, [optionsMarkets, exchangeRates, filters, pageIndex, rowsPerPage, sortOptions]);

    useEffect(() => {
        let allAssets: Set<string> = new Set();
        optionsMarkets
            .filter((market) => {
                if (!filters.showOnlyLiquid) return market;
                if (market.availableLongs > 0 || market.availableShorts > 0) {
                    return market;
                }
            })
            .forEach((market) => {
                if (!market.customMarket) allAssets.add(market.currencyKey);
            });
        allAssets = new Set(Array.from(allAssets).sort(sortCurrencies));
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
    }, [networkId, optionsMarkets, filters.showOnlyLiquid]);

    useEffect(() => {
        setPageIndex(0);
    }, [filters]);

    const tableSortLocalStorageKey = LOCAL_STORAGE_KEYS.MARKET_TABLE_SORTED_COLUMNS + networkId;
    const tableSortLocalStorageValue: TableColumnSort[] = get(tableSortLocalStorageKey) as [];

    useEffect(() => {
        if (tableSortLocalStorageValue) {
            const gridSortFilters = mapTableToGridSort(tableSortLocalStorageValue, GridSortFilters);
            setSortOptions(gridSortFilters);
        }
    }, []);

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

    const pageSizeLocalStorageKey = LOCAL_STORAGE_KEYS.MARKET_GRID_PAGE_SIZE + networkId;
    const handleChangeRowsPerPage = (event: any) => {
        const userPageSize = parseInt(event.target.value, 10);
        setRowsPerPage(userPageSize);
        setPageIndex(0);
        set(pageSizeLocalStorageKey, userPageSize);
    };

    useEffect(() => {
        const userPageSize: number | undefined = get(pageSizeLocalStorageKey);
        if (userPageSize) {
            setRowsPerPage(userPageSize);
        }
    }, []);

    return (
        <>
            <ButtonWrapper>
                <FiltersButton onClick={() => setShowSorting(true)}>Sort</FiltersButton>
            </ButtonWrapper>
            {showSorting && (
                <SortingMenu
                    setShowSorting={setShowSorting}
                    items={sortOptions}
                    itemClickEventHandler={updateSortOptions}
                />
            )}
            <Wrapper>
                {options &&
                    options.map((optionMarket, index) => {
                        return (
                            <SPAAnchor key={index} href={buildOptionsMarketLink(optionMarket.address)}>
                                <MarketCard optionMarket={optionMarket} exchangeRates={exchangeRates} />{' '}
                            </SPAAnchor>
                        );
                    })}
                <PaginationWrapper
                    rowsPerPageOptions={[9, 12, 15, 18]}
                    count={dataCount}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage={t('common.pagination.rows-per-page')}
                    page={pageIndex}
                    onPageChange={(_event: any, newPage: number) => setPageIndex(newPage)}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Wrapper>
        </>
    );
};

const Wrapper = styled(FlexDiv)`
    flex-wrap: wrap;
    max-width: 1200px;
    justify-content: center;
    @media (max-width: 1250px) {
        max-width: 1140px;
    }
`;

const ButtonWrapper = styled.div`
    width: 100%;
    position: relative;
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
    color: var(--color-highlight);
    @media (max-width: 768px) {
        display: block;
        position: absolute;
        left: 0;
        top: -30px;
    }
`;

export default MarketsGrid;
