/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { OptionsMarkets } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { useTranslation } from 'react-i18next';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
// import { getIsAppReady } from 'redux/modules/app';
// import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsOVM } from 'utils/network';

import Currency from 'components/Currency/v2';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { FlexDivRow } from 'theme/common';
import TableGridSwitch from '../../../components/Input/TableGridSwitch';
import SearchField from '../../../components/Input/SearchField';

import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';

import './main.scss';

type MarketsTableProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
    watchlistedMarkets?: string[];
};

const MarketPhase = {
    trading: '#50CE99',
    paused: '#C3244A',
    maturity: '#F7B91A',
};

enum PrimaryFiltersEnum {
    allMarkets = 'allMarkets',
    watchlist = 'watchlist',
    recentlyAdded = 'recentlyAdded',
}

const MarketsTable: React.FC<MarketsTableProps> = ({ exchangeRates, optionsMarkets }) => {
    // const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    // const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    // const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isL2 = getIsOVM(networkId);
    // const [structureType, setStructureType] = useState('table');

    const { t } = useTranslation();

    const primaryFiltersTranslation = {
        allMarkets: t('options.filters-labels.all-markets'),
        watchlist: t('options.filters-labels.watchlist'),
        recentlyAdded: t('options.filters-labels.recently-added'),
    };

    const [tableView, setTableView] = useState<boolean>(false);
    const [primaryFilter, setPrimaryFilter] = useState<'allMarkets' | 'watchlist' | 'recentlyAdded'>(
        PrimaryFiltersEnum.allMarkets
    );
    const labels = [t(`options.home.markets-table.menu.grid`), t(`options.home.markets-table.menu.table`)];

    const columns: Array<any> = useMemo(() => {
        return [
            {
                Header: t(`options.home.markets-table.asset-col`),
                accessor: 'asset',
                Cell: (_props: any) => {
                    return (
                        <Currency.Name
                            currencyKey={_props?.cell?.value}
                            showIcon={true}
                            iconProps={{ type: 'asset' }}
                            synthIconStyle={{ width: 32, height: 32 }}
                            spanStyle={{ float: 'left' }}
                        />
                    );
                },
            },
            ...(isL2
                ? [
                      {
                          Header: t(`options.home.markets-table.amm-size-col`),
                          accessor: (row: any) => <RatioText green={row.availableLongs} red={row.availableShorts} />,
                          disableSortBy: true,
                      },
                  ]
                : []),
            ...(isL2
                ? [
                      {
                          Header: t(`options.home.markets-table.price-up-down-col`),
                          accessor: (row: any) => <RatioText green={row.longPrice} red={row.shortPrice} />,
                          disableSortBy: true,
                      },
                  ]
                : []),
            {
                Header: t(`options.home.markets-table.strike-price-col`),
                accessor: 'strikePrice',
            },
            {
                Header: t(`options.home.markets-table.current-asset-price-col`),
                accessor: 'currentPrice',
            },
            {
                Header: t(`options.home.markets-table.time-remaining-col`),
                accessor: 'timeRemaining',
                Cell: (_props: any) => {
                    return <TimeRemaining end={_props?.cell?.value} fontSize={14} showFullCounter={true} />;
                },
            },
            {
                Header: t(`options.home.markets-table.phase-col`),
                accessor: 'phase',
                Cell: (_props: any) => {
                    return (
                        <Phase phase={_props?.cell?.value?.toLowerCase()}>
                            {_props?.cell?.value?.toLowerCase()} <Dot phase={_props?.cell?.value?.toLowerCase()} />
                        </Phase>
                    );
                },
            },
        ];
    }, [optionsMarkets]);

    const data = useMemo(() => {
        const processedMarkets = optionsMarkets.map((market) => {
            return {
                asset: market.asset,
                availableLongs: market.availableLongs,
                availableShorts: market.availableShorts,
                longPrice: formatCurrencyWithSign(USD_SIGN, market.longPrice, 2),
                shortPrice: formatCurrencyWithSign(USD_SIGN, market.shortPrice, 2),
                strikePrice: formatCurrencyWithSign(USD_SIGN, market.strikePrice),
                currentPrice: formatCurrencyWithSign(USD_SIGN, exchangeRates?.[market.currencyKey] || 0),
                timeRemaining: market.timeRemaining,
                phase: market.phase,
            };
        });

        return processedMarkets;
    }, [optionsMarkets]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter } = useTable(
        { columns, data, autoResetSortBy: false, autoResetGlobalFilter: false },
        useGlobalFilter,
        useSortBy
    );

    const { globalFilter } = state;

    return (
        <>
            <Wrapper>
                <FilterContainer>
                    {Object.keys(primaryFiltersTranslation).map((value: string) => {
                        return (
                            <Item
                                className={primaryFilter == value ? 'active' : ''}
                                onClick={() => {
                                    console.log('Test');
                                    setPrimaryFilter((PrimaryFiltersEnum as any)[value]);
                                }}
                            >
                                {(primaryFiltersTranslation as any)[value]}
                            </Item>
                        );
                    })}
                </FilterContainer>
                <FormContainer>
                    <TableGridSwitch
                        value={tableView}
                        labels={labels}
                        clickEventHandler={() => setTableView(!tableView)}
                    />
                    <SearchField text={globalFilter} handleChange={(value) => setGlobalFilter(value)} />
                </FormContainer>
            </Wrapper>
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
                    {rows.map((row: any) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell: any) => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

const Text = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    text-align: right !important;
`;

const GreenText = styled(Text)`
    color: #50ce99;
`;

const RedText = styled(Text)`
    color: #c3244a;
`;

const Phase = styled.span<{ phase: 'trading' | 'paused' | 'maturity' }>`
    color: ${(props: any) => (MarketPhase as any)[props.phase]};
    text-transform: capitalize;
`;

const Dot = styled.span<{ phase: 'trading' | 'paused' | 'maturity' }>`
    height: 7px;
    width: 7px;
    background-color: ${(props: any) => (MarketPhase as any)[props.phase]};
    border-radius: 50%;
    display: inline-block;
`;

const Arrow = styled.i`
    margin-left: 5px;
    font-size: 15px;
`;

const Wrapper = styled(FlexDivRow)`
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 39px;
    max-width: 1200px;
`;

const FormContainer = styled.div`
    color: #64d9fe;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const FilterContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Item = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    text-transform: uppercase;
    padding: 6px 14px 6px 14px;
    margin-right: 20px;
    color: white;
    cursor: pointer;
`;

const RatioText: React.FC<{ green: string; red: string }> = ({ green, red }) => {
    return (
        <span>
            <GreenText>{green}</GreenText> / <RedText>{red}</RedText>
        </span>
    );
};

export default MarketsTable;
