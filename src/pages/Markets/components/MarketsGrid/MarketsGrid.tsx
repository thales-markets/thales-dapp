import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { OptionsMarkets, GridFilters } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

import { FlexDiv } from 'theme/common';
import MarketCard from '../MarketsCard/MarketCard';
import { PaginationWrapper } from '../MarketsTable/MarketsTable';

import { getSynthName } from 'utils/currency';
import SPAAnchor from 'components/SPAAnchor';
import { buildOptionsMarketLink } from 'utils/routes';

type MarketsGridProps = {
    optionsMarkets: OptionsMarkets;
    exchangeRates: Rates | null;
    filters: GridFilters;
};

const MarketsGrid: React.FC<MarketsGridProps> = ({ optionsMarkets, exchangeRates, filters }) => {
    const [rowsPerPage, setRowsPerPage] = useState<number>(9);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [dataCount, setDataCount] = useState<number>(optionsMarkets?.length || 0);

    const options = useMemo(() => {
        let data = optionsMarkets;

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
                if (market?.asset.toLowerCase().includes(filters.searchQuery)) return market;
                if (market?.strikePrice.toString().includes(filters.searchQuery)) return market;
                if (getSynthName(market.currencyKey).toLowerCase().includes(filters.searchQuery)) return market;
            });
        }

        if (filters?.sort?.length) {
            filters.sort.forEach((sort) => {
                if (sort?.column && typeof (data as any)[0][sort.column] == 'number') {
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
    }, [optionsMarkets, exchangeRates, filters, pageIndex, rowsPerPage]);

    useEffect(() => {
        setPageIndex(0);
    }, [filters]);

    return (
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
    @media (max-width: 1250px) {
        max-width: 1140px;
    }
`;

export default MarketsGrid;
