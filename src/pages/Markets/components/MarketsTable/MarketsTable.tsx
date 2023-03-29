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

import AssetFilters from '../AssetFillters/AssetFilters';
import { getUISize, UISize } from 'redux/modules/ui';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';

import './main.scss';

const MarketsGrid = lazy(() => import(/* webpackChunkName: "MarketsGrid" */ '../MarketsGrid'));
const Table = lazy(() => import(/* webpackChunkName:"Table" */ './Table'));

type MarketsTableProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
    watchlistedMarkets?: string[];
};

const MarketsTable: React.FC<MarketsTableProps> = ({ exchangeRates, optionsMarkets }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const screenSize = useSelector((state: RootState) => getUISize(state));
    const { t } = useTranslation();

    const showOnlyLiquidFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.MARKET_SHOW_ONLY_LIQUID + networkId);
    const tableViewFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.MARKET_TABLE_VIEW + networkId);
    const [allAssets, setAllAssets] = useState<Set<string>>(new Set());

    const [globalFilter, setGlobalFilter] = useState('');
    const [tableView, setTableView] = useState<boolean>(
        screenSize === UISize.Large ? (tableViewFromLocalStorage === 'false' ? false : true) : false
    );

    const [showOnlyLiquid, setOnlyLiquid] = useState<boolean>(
        showOnlyLiquidFromLocalStorage !== undefined
            ? showOnlyLiquidFromLocalStorage === 'false'
                ? false
                : true
            : true
    );

    const labels = [t(`options.home.markets-table.menu.grid`), t(`options.home.markets-table.menu.table`)];
    const liquidSwitchLabels = [
        t(`options.home.markets-table.menu.only-liquid`),
        t(`options.home.markets-table.menu.all`),
    ];

    const chosenAsset = localStorage.getItem(LOCAL_STORAGE_KEYS.MARKET_CHOSEN_ASSET + networkId);
    const [assetFilters, setAssetFilters] = useState<string[]>(chosenAsset ? JSON.parse(chosenAsset) : []);

    useEffect(() => {
        const selectedAssetsLocalStorage = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEYS.MARKET_SELECTED_ASSETS + networkId) || '[]'
        );
        if (!selectedAssetsLocalStorage.length || allAssets.size > 0) {
            const newAssetFilters = assetFilters.filter(
                (asset: string) => allAssets.has(asset) || (assetFilters.length ? assetFilters.includes(asset) : false)
            );
            localStorage.setItem(LOCAL_STORAGE_KEYS.MARKET_CHOSEN_ASSET + networkId, JSON.stringify(newAssetFilters));
        }
    }, [allAssets, assetFilters]);

    useEffect(() => {
        if (showOnlyLiquidFromLocalStorage !== '' + showOnlyLiquid || showOnlyLiquidFromLocalStorage == undefined) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.MARKET_SHOW_ONLY_LIQUID + networkId, '' + showOnlyLiquid);
        }

        if (tableViewFromLocalStorage !== '' + tableView || tableViewFromLocalStorage == undefined) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.MARKET_TABLE_VIEW + networkId, '' + tableView);
        }
    }, [showOnlyLiquid, tableView]);

    useEffect(() => {
        setTableView(screenSize === UISize.Large ? (tableViewFromLocalStorage === 'false' ? false : true) : false);
        setOnlyLiquid(
            showOnlyLiquidFromLocalStorage !== undefined
                ? showOnlyLiquidFromLocalStorage === 'false'
                    ? false
                    : true
                : true
        );
    }, [networkId]);

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
                <Suspense fallback={<></>}>
                    <Table
                        optionsMarkets={optionsMarkets}
                        exchangeRates={exchangeRates}
                        showOnlyLiquid={showOnlyLiquid}
                        assetFilters={filters.assetFilters}
                        setAllAssets={setAllAssets}
                        searchText={globalFilter}
                    ></Table>
                </Suspense>
            )}
            {!tableView && (
                <Suspense fallback={<></>}>
                    <MarketsGrid
                        networkId={networkId}
                        optionsMarkets={optionsMarkets}
                        exchangeRates={exchangeRates}
                        filters={filters}
                        setAllAssets={setAllAssets}
                    />
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
    color: var(--color-highlight);
    display: flex;
    flex-direction: row;
    align-items: center;
    @media (max-width: 1250px) {
        display: none;
    }
`;

export default MarketsTable;
