import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// import OptionPriceTab from '../Tabs/OptionPriceTab';
import Table from 'components/TableV2';
import Currency from 'components/Currency/v2';

import Container from './styled-components/Container';

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
            <Container.Main>
                <Container.Main.Item active={true}>
                    {t('options.market.widgets.chart-options-price-widget')}
                </Container.Main.Item>
                <Container.Main.Item>{t('options.market.widgets.your-transactions-widget')}</Container.Main.Item>
                <Container.Main.Item>{t('options.market.widgets.chart-trading-view-widget')}</Container.Main.Item>
                <Container.Main.Item>{t('options.market.widgets.recent-transactions-widget')}</Container.Main.Item>
            </Container.Main>
            <Container.Tab>
                <Table columns={columns} data={optionsMarkets} />
            </Container.Tab>
        </Container>
    );
};

export default TabContainer;
