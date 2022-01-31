import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { OptionsMarkets, GridFilters } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

import { FlexDiv } from 'theme/common';
import MarketCard from '../MarketCard/v2/MarketCard';
import { PaginationWrapper } from '../MarketsTable/v2/MarketsTable';

import { getSynthName } from 'utils/currency';

type MarketsGridProps = {
    optionsMarkets: OptionsMarkets;
    exchangeRates: Rates | null;
    watchlistedMarkets?: string[];
    filters: GridFilters;
};

const MarketsGrid: React.FC<MarketsGridProps> = ({ optionsMarkets, exchangeRates, watchlistedMarkets, filters }) => {
    const [rowsPerPage, setRowsPerPage] = useState<number>(9);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [dataCount, setDataCount] = useState<number>(optionsMarkets?.length || 0);

    const options = useMemo(() => {
        let data = optionsMarkets;

        if (filters?.primaryFilter == 'watchlist') {
            data = data.filter((market) => watchlistedMarkets?.includes(market.address));
        }

        if (filters?.searchQuery) {
            data = data.filter((market) => {
                if (market?.asset.toLowerCase().includes(filters.searchQuery)) return market;
                if (market?.strikePrice.toString().includes(filters.searchQuery)) return market;
                if (getSynthName(market.currencyKey).toLowerCase().includes(filters.searchQuery)) return market;
            });
        }

        // if(filters?.primaryFilter == 'recentlyAdded')

        if (filters?.sort) {
            if (filters.sort.column == 'byName') {
                if (filters.sort.type == 'asc')
                    data.sort((a, b) => (a.asset > b.asset ? 1 : b.asset > a.asset ? -1 : 0));
                if (filters.sort.type == 'desc')
                    data.sort((a, b) => (a.asset > b.asset ? -1 : b.asset > a.asset ? 1 : 0));
            } else if (filters.sort.column == 'byTimeRemaining') {
                if (filters.sort.type == 'asc') data.sort((a, b) => (a.timeRemaining > b.timeRemaining ? 1 : -1));
                if (filters.sort.type == 'desc') data.sort((a, b) => (a.timeRemaining > b.timeRemaining ? -1 : 1));
            }
        }

        setDataCount(data?.length || 0);
        data = data.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);

        return data;
    }, [optionsMarkets, exchangeRates, filters, pageIndex, rowsPerPage]);

    return (
        <Wrapper>
            {options &&
                options.map((optionMarket, index) => {
                    return <MarketCard key={index} optionMarket={optionMarket} exchangeRates={exchangeRates} />;
                })}
            <PaginationWrapper
                rowsPerPageOptions={[9, 12, 15, 18]}
                count={dataCount}
                rowsPerPage={rowsPerPage}
                page={pageIndex}
                onPageChange={(_event: any, newPage: number) => setPageIndex(newPage)}
                onRowsPerPageChange={(event: any) => setRowsPerPage(parseInt(event.target.value, 10))}
            />
        </Wrapper>
    );
};

const Wrapper = styled(FlexDiv)`
    flex-wrap: wrap;
    max-width: 1200px;
    justify-content: center;
`;

export default MarketsGrid;
