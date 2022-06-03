/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';

import { OptionsMarkets } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

import { useTranslation } from 'react-i18next';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';

import { FlexDivRow } from 'theme/common';
import TableGridSwitch from 'components/TableInputs/TableGridSwitch';
import SearchField from 'components/TableInputs/SearchField';

import { TablePagination } from '@material-ui/core';

import './main.scss';

const MarketsGrid = lazy(() => import(/* webpackChunkName: "MarketsGrid" */ '../MarketsGrid'));

type MarketsTableProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
    watchlistedMarkets?: string[];
};

import Cookies from 'universal-cookie';

import AssetFilters from '../AssetFillters/AssetFilters';
import Table from './Table';

const cookies = new Cookies();

const MarketsTable: React.FC<MarketsTableProps> = ({ exchangeRates, optionsMarkets }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const { t } = useTranslation();

    const showOnlyLiquidFromCookie = cookies.get('showOnlyLiquid' + networkId);
    const tableViewFromCookie = cookies.get('showTableView' + networkId);
    const [allAssets, setAllAssets] = useState<Set<string>>(new Set());

    const [globalFilter, setGlobalFilter] = useState('');
    const [tableView, setTableView] = useState<boolean>(tableViewFromCookie === 'false' ? false : true);

    const [showOnlyLiquid, setOnlyLiquid] = useState<boolean>(
        showOnlyLiquidFromCookie !== undefined ? (showOnlyLiquidFromCookie === 'false' ? false : true) : true
    );

    const labels = [t(`options.home.markets-table.menu.grid`), t(`options.home.markets-table.menu.table`)];
    const liquidSwitchLabels = [
        t(`options.home.markets-table.menu.only-liquid`),
        t(`options.home.markets-table.menu.all`),
    ];

    const chosenAsset = cookies.get('chosenAsset' + networkId);
    const [assetFilters, setAssetFilters] = useState<string[]>(chosenAsset ? chosenAsset : []);

    useEffect(() => {
        if (assetFilters !== chosenAsset || chosenAsset == undefined) {
            cookies.set('chosenAsset' + networkId, assetFilters?.length ? assetFilters : '', {
                path: '/',
            });
        }
    }, [assetFilters]);

    useEffect(() => {
        if (showOnlyLiquidFromCookie !== showOnlyLiquid || showOnlyLiquidFromCookie == undefined) {
            cookies.set('showOnlyLiquid' + networkId, showOnlyLiquid, {
                path: '/',
            });
        }

        if (tableViewFromCookie !== tableView || tableViewFromCookie == undefined) {
            cookies.set('showTableView' + networkId, tableView, {
                path: '/',
            });
        }
    }, [showOnlyLiquid, tableView]);

    const filters = useMemo(() => {
        return {
            searchQuery: globalFilter,
            assetFilters: assetFilters,

            showOnlyLiquid,
        };
    }, [globalFilter, assetFilters, showOnlyLiquid]);

    return (
        <>
            <Wrapper>
                <AssetFilters
                    allAssets={allAssets}
                    setAssetFilters={setAssetFilters}
                    assetFilters={assetFilters}
                ></AssetFilters>
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
            {tableView && (
                <Table
                    optionsMarkets={optionsMarkets}
                    exchangeRates={exchangeRates}
                    showOnlyLiquid={showOnlyLiquid}
                    assetFilters={filters.assetFilters}
                    setAllAssets={setAllAssets}
                    searchText={globalFilter}
                ></Table>
            )}
            {!tableView && (
                <Suspense fallback={<></>}>
                    <MarketsGrid optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} filters={filters} />
                </Suspense>
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

export default MarketsTable;
