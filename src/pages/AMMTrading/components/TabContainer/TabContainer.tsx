import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// import OptionPriceTab from '../Tabs/OptionPriceTab';
import Table from 'components/TableV2';
import Currency from 'components/Currency/v2';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';

import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';

const TabContainer: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);

    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);

    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            const markets = openOrdersMap
                ? marketsQuery.data.map((m) => ({
                      ...m,
                      openOrders: (openOrdersMap as any).get(m.address.toLowerCase())?.ordersCount ?? '0',
                      availableLongs: (openOrdersMap as any).get(m.address.toLowerCase())?.availableLongs ?? '0',
                      availableShorts: (openOrdersMap as any).get(m.address.toLowerCase())?.availableShorts ?? '0',
                      longPrice: (openOrdersMap as any).get(m.address.toLowerCase())?.longPrice ?? '0',
                      shortPrice: (openOrdersMap as any).get(m.address.toLowerCase())?.shortPrice ?? '0',
                  }))
                : marketsQuery.data;
            return markets;
        }
        return [];
    }, [marketsQuery]);

    const columns = useMemo(() => {
        return [
            {
                Header: t(`options.home.markets-table.asset-col`),
                accessor: 'currencyKey',
                disableSortBy: true,
                show: false,
                minWidth: 150,
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
            {
                Header: t(`options.home.markets-table.strike-price-col`),
                accessor: 'strikePrice',
                minWidth: 50,
            },
            {
                Header: t(`options.home.markets-table.current-asset-price-col`),
                accessor: 'longAddress',
                minWidth: 150,
            },
            {
                Header: t(`options.home.markets-table.time-remaining-col`),
                accessor: 'timestamp',
                minWidth: 150,
            },
        ];
    }, [optionsMarkets]);

    return (
        <Container>
            <MenuContainer>
                <MenuItem active={true}>{t('options.market.widgets.chart-options-price-widget')}</MenuItem>
                <MenuItem>{t('options.market.widgets.your-transactions-widget')}</MenuItem>
                <MenuItem>{t('options.market.widgets.chart-trading-view-widget')}</MenuItem>
                <MenuItem>{t('options.market.widgets.recent-transactions-widget')}</MenuItem>
            </MenuContainer>
            <Tab>
                <Table columns={columns} data={optionsMarkets} />
            </Tab>
        </Container>
    );
};

const Container = styled.div`
    width: 70%;
    display: flex;
    flex-direction: column;
`;

const MenuContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    border-bottom: 4px solid var(--table-border-color);
    border-radius: 3px;
`;

const Tab = styled.div`
    width: 100%;
    display: flex;
`;

const MenuItem = styled.div<{ active?: boolean }>`
    text-align: center;
    flex: 1;
    font-family: Titillium Regular !important;
    font-style: normal;
    color: var(--primary-color);
    box-shadow: ${(_props) => (_props?.active ? '0px 4px var(--primary-filter-menu-active)' : '')};
    text-transform: uppercase;
    padding: 12px 5px;
`;

export default TabContainer;
