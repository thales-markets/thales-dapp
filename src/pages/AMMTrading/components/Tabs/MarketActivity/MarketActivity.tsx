import React, { useMemo } from 'react';

import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import Table from 'components/TableV2';
import ViewEtherscanLink from 'components/ViewEtherscanLink';

import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';

import useBinaryOptionsTradesQuery from 'queries/options/useBinaryOptionsTradesQuery';
import useBinaryOptionsTransactionsQuery from 'queries/options/useBinaryOptionsTransactionsQuery';

import { useTranslation } from 'react-i18next';
import { uniqBy, orderBy } from 'lodash';
import { formatTxTimestamp } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';

import { COLORS_NEW } from 'constants/ui';
import { OPTIONS_CURRENCY_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { getStableCoinForNetwork } from '../../../../../utils/currency';

const MarketActivity: React.FC = () => {
    const { t } = useTranslation();

    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketTransactionsQuery = useBinaryOptionsTransactionsQuery(optionsMarket?.address, networkId, {
        enabled: isAppReady && !!optionsMarket?.address,
    });

    const marketTransactions = uniqBy(marketTransactionsQuery.data || [], (transaction) => transaction.hash);

    const tradesQuery = useBinaryOptionsTradesQuery(
        optionsMarket?.address,
        optionsMarket?.longAddress,
        optionsMarket?.shortAddress,
        networkId,
        { enabled: isAppReady && !!optionsMarket?.address }
    );

    const transactions = useMemo(
        () =>
            orderBy(
                [...(tradesQuery.data || []), ...marketTransactions],
                ['timestamp', 'blockNumber'],
                ['desc', 'desc']
            ),
        [marketTransactions, tradesQuery?.data]
    );

    const getCellColor = (type: string) => {
        switch (type) {
            case 'buy':
                return COLORS_NEW.LONG;
            case 'sell':
                return COLORS_NEW.SHORT;
            default:
                return 'var(--primary-color)';
        }
    };

    return (
        <>
            <Table
                data={transactions}
                columns={[
                    {
                        Header: <>{t('options.market.transactions-card.table.date-time-col')}</>,
                        accessor: 'timestamp',
                        Cell: (cellProps: any) => <p>{formatTxTimestamp(cellProps.cell.value)}</p>,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.type-col')}</>,
                        accessor: 'type',
                        Cell: (cellProps: any) => (
                            <p
                                style={{
                                    color: getCellColor(cellProps.cell.row.original.type),
                                    textTransform: 'uppercase',
                                }}
                            >
                                {t(`options.market.transactions-card.table.types.${cellProps.cell.value}`)}
                            </p>
                        ),
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.amount-col')}</>,
                        sortType: 'basic',
                        accessor: 'amount',
                        Cell: (cellProps: any) => (
                            <p style={{ color: getCellColor(cellProps.cell.row.original.type), fontWeight: 'bold' }}>
                                {cellProps.cell.row.original.type === 'buy' ||
                                cellProps.cell.row.original.type === 'sell'
                                    ? formatCurrencyWithKey(
                                          (OPTIONS_CURRENCY_MAP as any)[cellProps.cell.row.original.side],
                                          cellProps.cell.value
                                      )
                                    : cellProps.cell.row.original.type === 'mint'
                                    ? formatCurrency(cellProps.cell.value)
                                    : formatCurrencyWithKey(getStableCoinForNetwork(networkId), cellProps.cell.value)}
                            </p>
                        ),
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.price-col')}</>,
                        sortType: 'basic',
                        accessor: 'price',
                        Cell: (cellProps: any) => (
                            <p>
                                {cellProps.cell.row.original.type === 'buy' ||
                                cellProps.cell.row.original.type === 'sell'
                                    ? formatCurrencyWithKey(
                                          getStableCoinForNetwork(networkId),
                                          cellProps.cell.value ?? 0
                                      )
                                    : EMPTY_VALUE}
                            </p>
                        ),
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.tx-status-col')}</>,
                        id: 'tx-status',
                        Cell: (cellProps: any) =>
                            cellProps.cell.row.original.status && cellProps.cell.row.original.status === 'pending' ? (
                                <span>{t('common.tx-status.pending')}</span>
                            ) : (
                                <ViewEtherscanLink hash={cellProps.cell.row.original.hash} />
                            ),
                    },
                ]}
            />
        </>
    );
};

export default MarketActivity;
