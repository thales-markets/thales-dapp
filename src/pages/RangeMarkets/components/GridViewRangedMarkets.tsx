import RangeMarketCard from 'components/RangeMarketCard';
import SPAAnchor from 'components/SPAAnchor';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import _ from 'lodash';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import { GridFilters, RangedMarketUI } from 'types/options';
import { get, set } from 'utils/localStore';
import { buildRangeMarketLink } from 'utils/routes';
import { PaginationWrapper } from './RangeMarketsTable';

type MarketsGridProps = {
    optionsMarkets: RangedMarketUI[];
    exchangeRates: Rates | null;
    filters: GridFilters;
};

const GridViewRangedMarkets: React.FC<MarketsGridProps> = ({ optionsMarkets, exchangeRates, filters }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [rowsPerPage, setRowsPerPage] = useState<number>(9);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [dataCount, setDataCount] = useState<number>(optionsMarkets?.length || 0);

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
                    return market.availableIn > 0 || market.availableOut > 0;
                });
            }

            if (filters?.searchQuery) {
                data = data.filter((market) => {
                    if (market?.asset.toLowerCase().includes(filters.searchQuery.toLowerCase())) return market;

                    if (exchangeRates && exchangeRates[market.currencyKey]) {
                        if (exchangeRates[market.currencyKey].toFixed(2).includes(filters.searchQuery)) return market;
                    }
                });
            }

            data = data.map((market) => {
                // currentAssetPrice and strikePrice is required because it is part of Sort Filters
                return {
                    ...market,
                    currentAssetPrice: exchangeRates?.[market?.currencyKey] || 0,
                    strikePrice: market.range,
                };
            });

            if (filters?.sort?.length) {
                filters.sort.forEach((sort) => {
                    if (sort?.column && typeof (data as any)[0][sort?.column] == 'number') {
                        if (sort.type == 'asc') data = _.orderBy(data, [sort.column], 'asc');
                        if (sort.type == 'desc') data = _.orderBy(data, [sort.column], 'desc');
                    }

                    if (sort?.column && typeof (data as any)[0][sort?.column] == 'string') {
                        if (sort.type == 'asc') data = _.orderBy(data, [sort.column], 'asc');
                        if (sort.type == 'desc') data = _.orderBy(data, [sort.column], 'desc');
                    }
                });
            }

            setDataCount(data?.length || 0);
            data = data.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);

            return data;
        }
    }, [optionsMarkets, exchangeRates, filters, pageIndex, rowsPerPage]);

    useEffect(() => {
        setPageIndex(0);
    }, [filters]);

    const pageSizeLocalStorageKey = LOCAL_STORAGE_KEYS.RANGED_MARKET_GRID_PAGE_SIZE + networkId;
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
        <Wrapper>
            {options &&
                options.map((optionMarket, index) => {
                    return (
                        <SPAAnchor key={index} href={buildRangeMarketLink(optionMarket.address)}>
                            <RangeMarketCard data={optionMarket} exchangeRates={exchangeRates} />{' '}
                        </SPAAnchor>
                    );
                })}
            <PaginationWrapper
                rowsPerPageOptions={[9, 12, 15, 18]}
                count={dataCount}
                rowsPerPage={rowsPerPage}
                page={pageIndex}
                onPageChange={(_event: any, newPage: number) => setPageIndex(newPage)}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Wrapper>
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

export default GridViewRangedMarkets;
