import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivColumn, FlexDivColumnCentered, Text } from 'theme/common';
import { ExtendedTrade } from 'types/options';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useBinaryOptionsAllTradesQuery from 'queries/options/useBinaryOptionsAllTradesQuery';
import TradesTable from './TradesTable';

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const DEFAULT_ORDER_BY = 3; // market expiration time

const Trades: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);

    const tradesQuery = useBinaryOptionsAllTradesQuery(networkId, {
        enabled: isAppReady,
    });
    const trades: ExtendedTrade[] = tradesQuery.isSuccess && tradesQuery.data ? tradesQuery.data : [];

    const sortedTrades = useMemo(() => {
        return trades.sort(() => {
            switch (orderBy) {
                // case 2:
                //     return sortByMarketField(a.market, b.market, orderDirection, 'asset');
                // case 3:
                //     return sortByTime(a, b, orderDirection);
                // case 4:
                //     return sortByOrderField(a.displayOrder, b.displayOrder, orderDirection, 'fillableTotal');
                // case 5:
                //     return
                //         : sortByOrderField(a.displayOrder, b.displayOrder, orderDirection, 'fillableAmount');
                // case 6:
                //     return sortByField(a, b, orderDirection, 'walletBalance');
                default:
                    return 0;
            }
        });
    }, [trades, orderBy, orderDirection]);

    return (
        <FlexDivColumnCentered className="leaderboard__wrapper">
            <TradesTable
                trades={sortedTrades}
                isLoading={tradesQuery.isLoading}
                orderBy={orderBy}
                orderDirection={orderDirection}
                setOrderBy={setOrderBy}
                setOrderDirection={setOrderDirection}
            >
                <NoOrders>
                    <>
                        <Text className="text-l bold pale-grey">{t('options.quick-trading.no-orders-found')}</Text>
                    </>
                </NoOrders>
            </TradesTable>
        </FlexDivColumnCentered>
    );
};

// const sortByTime = (a: ExtendedOrderItem, b: ExtendedOrderItem, direction: OrderDirection) => {
//     if (direction === OrderDirection.ASC && a.market.phaseNum === b.market.phaseNum) {
//         return a.market.timeRemaining > b.market.timeRemaining ? -1 : 1;
//     }
//     if (direction === OrderDirection.DESC && a.market.phaseNum === b.market.phaseNum) {
//         return a.market.timeRemaining > b.market.timeRemaining ? 1 : -1;
//     }

//     return 0;
// };

// const sortByField = (
//     a: ExtendedOrderItem,
//     b: ExtendedOrderItem,
//     direction: OrderDirection,
//     field: keyof ExtendedOrderItem
// ) => {
//     if (direction === OrderDirection.ASC) {
//         return (a[field] as any) > (b[field] as any) ? 1 : -1;
//     }
//     if (direction === OrderDirection.DESC) {
//         return (a[field] as any) > (b[field] as any) ? -1 : 1;
//     }

//     return 0;
// };

// const sortByOrderField = (a: DisplayOrder, b: DisplayOrder, direction: OrderDirection, field: keyof DisplayOrder) => {
//     if (direction === OrderDirection.ASC) {
//         return (a[field] as any) > (b[field] as any) ? 1 : -1;
//     }
//     if (direction === OrderDirection.DESC) {
//         return (a[field] as any) > (b[field] as any) ? -1 : 1;
//     }

//     return 0;
// };

// const sortByMarketField = (
//     a: HistoricalOptionsMarketInfo,
//     b: HistoricalOptionsMarketInfo,
//     direction: OrderDirection,
//     field: keyof HistoricalOptionsMarketInfo
// ) => {
//     if (direction === OrderDirection.ASC) {
//         return (a[field] as any) > (b[field] as any) ? 1 : -1;
//     }
//     if (direction === OrderDirection.DESC) {
//         return (a[field] as any) > (b[field] as any) ? -1 : 1;
//     }

//     return 0;
// };

const NoOrders = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    align-items: center;
    .primary {
        align-self: center;
    }
    border-radius: 0 0 23px 23px;
`;

export default Trades;
