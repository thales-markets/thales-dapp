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
import { OPTIONS_CURRENCY_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { getStableCoinForNetwork } from '../../../../../utils/currency';
import { OptionsMarketInfo, RangedMarketData } from 'types/options';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import { FlexDivColumn } from 'theme/common';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';
import styled from 'styled-components';

type MarketActivityProps = {
    isRangedMarket: boolean;
};

const MarketActivity: React.FC<MarketActivityProps> = ({ isRangedMarket }) => {
    const market = isRangedMarket ? useRangedMarketContext() : useMarketContext();
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketTransactionsQuery = useBinaryOptionsTransactionsQuery(market.address, networkId, {
        enabled: isAppReady,
    });

    const marketTransactions = uniqBy(marketTransactionsQuery.data || [], (transaction) => transaction.hash);

    const tradesQuery = useBinaryOptionsTradesQuery(
        market.address,
        isRangedMarket ? (market as RangedMarketData).inAddress : (market as OptionsMarketInfo).longAddress,
        isRangedMarket ? (market as RangedMarketData).outAddress : (market as OptionsMarketInfo).shortAddress,
        networkId,
        isRangedMarket,
        { enabled: isAppReady }
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
                return theme.tradeTypeColor.buy;
            case 'long':
                return theme.positionColor.up;
            case 'up':
                return theme.positionColor.up;
            case 'sell':
                return theme.tradeTypeColor.sell;
            case 'short':
                return theme.positionColor.down;
            case 'down':
                return theme.positionColor.down;
            case 'in':
                return theme.positionColor.in;
            case 'out':
                return theme.positionColor.out;
            default:
                return theme.textColor.primary;
        }
    };

    const priceSort = useMemo(
        () => (rowA: any, rowB: any, columnId: any, desc: any) => {
            let a = Number.parseFloat(rowA.values[columnId]);
            let b = Number.parseFloat(rowB.values[columnId]);
            if (Number.isNaN(a)) {
                // Blanks and non-numeric to bottom
                a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }
            if (Number.isNaN(b)) {
                b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }
            return a > b ? 1 : a < b ? -1 : 0;
        },
        []
    );

    return (
        <Container>
            <Table
                data={transactions}
                isLoading={marketTransactionsQuery.isLoading || tradesQuery.isLoading}
                defaultPageSize={10}
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
                        sortType: 'basic',
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.price-col')}</>,
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
                        sortType: priceSort,
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
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    width: 100%;
`;

export default MarketActivity;
