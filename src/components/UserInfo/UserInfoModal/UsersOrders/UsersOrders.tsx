import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import useUserOrdersQuery from 'queries/user/useUserOrdersQuery';
import React, { useMemo } from 'react';
import { FlexDivCentered, LightTooltip, Text } from 'theme/common';
import { OptionsMarkets, Trade } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatPercentage } from 'utils/formatters/number';
import { prepBuyOrder, prepSellOrder } from 'utils/formatters/order';
import { NetworkId } from 'utils/network';
import { navigateToOptionsMarket } from 'utils/routes';
import snxJSConnector from 'utils/snxJSConnector';
import { MarketRow } from '../UserInfoModal';

type UsersOrdersProps = {
    optionsMarkets: OptionsMarkets;
    walletAddress: string;
    networkId: NetworkId;
};

const UsersOrders: React.FC<UsersOrdersProps> = ({ optionsMarkets, walletAddress, networkId }) => {
    const ordersQuery = useUserOrdersQuery(networkId, walletAddress);
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;

    const filteredOrders = useMemo(() => {
        if (ordersQuery.isSuccess) {
            return optionsMarkets.reduce((acc, market: any) => {
                if (market.openOrders > 0) {
                    const userOrdersForMarket: [] = ordersQuery.data.records.reduce((temp: any, data: any) => {
                        const rawOrder: Trade = data.order;
                        const isBuy: boolean = rawOrder.makerToken.toLowerCase() === SynthsUSD.address.toLowerCase();
                        let isLong = false;
                        if (
                            (isBuy && market.longAddress.toLowerCase() === rawOrder.takerToken.toLowerCase()) ||
                            (!isBuy && market.longAddress.toLowerCase() === rawOrder.makerToken.toLowerCase())
                        ) {
                            isLong = true;
                        } else if (
                            (isBuy && market.shortAddress.toLowerCase() === rawOrder.takerToken.toLowerCase()) ||
                            (!isBuy && market.shortAddress.toLowerCase() === rawOrder.makerToken.toLowerCase())
                        ) {
                            isLong = false;
                        } else {
                            return temp;
                        }
                        const displayOrder = isBuy ? prepBuyOrder(data) : prepSellOrder(data);

                        temp.push({
                            ...displayOrder,
                            market,
                            isBuy,
                            isLong,
                        });
                        return temp;
                    }, []);
                    acc.push(...userOrdersForMarket);
                }
                return acc;
            }, []);
        } else return [];
    }, [ordersQuery]);

    return (
        <>
            {filteredOrders?.map((order: any, index) => (
                <MarketRow
                    style={{
                        background: order.isBuy ? 'rgb(61, 186, 162, 0.4)' : 'rgb(255, 122, 104, 0.4)',
                    }}
                    key={index}
                    onClick={() => {
                        if (order.market.phase !== 'expiry') {
                            navigateToOptionsMarket(order.market.address);
                        }
                    }}
                >
                    <FlexDivCentered style={{ flex: 8, justifyContent: 'flex-start' }}>
                        <Currency.Name
                            currencyKey={order.market.currencyKey}
                            showIcon={true}
                            iconProps={{ width: '32px', height: '32px', type: 'asset' }}
                        />
                        <Text className="text-xxs" style={{ margin: '0 8px' }}>
                            {order.isLong ? ' > ' : ' < '}
                            {formatCurrency(order.market.strikePrice) + USD_SIGN + ' '}
                            by {formatShortDate(order.market.maturityDate)}
                        </Text>
                    </FlexDivCentered>
                    <LightTooltip title="Amount x Price">
                        <Text className="text-xxs" style={{ flex: 3, textAlign: 'center' }}>
                            {order.displayOrder.amount.toFixed(2) + ' x '}
                            {order.displayOrder.price.toFixed(2) + USD_SIGN}
                        </Text>
                    </LightTooltip>
                    <LightTooltip title="Filled">
                        <Text className="text-xxs" style={{ flex: 1, textAlign: 'center' }}>
                            {formatPercentage(order.displayOrder.filled, 0)}
                        </Text>
                    </LightTooltip>
                    <LightTooltip title="Time Remaining">
                        <Text className="text-xxs" style={{ flex: 3, textAlign: 'center' }}>
                            <TimeRemaining end={order.displayOrder.timeRemaining} />
                        </Text>
                    </LightTooltip>
                </MarketRow>
            ))}
        </>
    );
};

export default UsersOrders;
