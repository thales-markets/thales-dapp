import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import useUserOrdersQuery from 'queries/user/useUserOrdersQuery';
import React, { useMemo } from 'react';
import { FlexDivCentered, Image, LightTooltip, Text } from 'theme/common';
import { OptionsMarkets, Trade } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';
import { prepBuyOrder, prepSellOrder } from 'utils/formatters/order';
import { NetworkId } from 'utils/network';
import { navigateToOptionsMarket } from 'utils/routes';
import snxJSConnector from 'utils/snxJSConnector';
import long from 'assets/images/long.svg';
import short from 'assets/images/short.svg';
import { MarketRow } from '../UserInfoModal';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import { openOrdersMapCache } from '../../../../queries/options/fetchMarketOrders';

type UsersOrdersProps = {
    optionsMarkets: OptionsMarkets;
    walletAddress: string;
    networkId: NetworkId;
    onClose: () => void;
};

const UsersOrders: React.FC<UsersOrdersProps> = ({ optionsMarkets, walletAddress, networkId, onClose }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;

    const ordersQuery = useUserOrdersQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    const filteredOrders = useMemo(() => {
        if (ordersQuery.isSuccess) {
            return optionsMarkets.reduce((acc, market: any) => {
                const openOrders = openOrdersMapCache?.[market.address] || 0;
                if (openOrders > 0) {
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
                            onClose();
                        }
                    }}
                >
                    <FlexDivCentered style={{ flex: 4, justifyContent: 'flex-start' }}>
                        <Currency.Name
                            currencyKey={order.market.currencyKey}
                            showIcon={true}
                            synthIconStyle={{ width: 24, height: 24 }}
                            iconProps={{ type: 'asset' }}
                        />
                    </FlexDivCentered>
                    <Text className="text-xxs" style={{ flex: 2 }}>
                        {formatCurrencyWithSign(USD_SIGN, order.market.strikePrice)}
                    </Text>
                    <LightTooltip title="Maturity date">
                        <Text className="text-xxs" style={{ flex: 3, textAlign: 'center' }}>
                            {formatShortDate(order.market.maturityDate)}
                        </Text>
                    </LightTooltip>
                    <Image style={{ width: 24 }} src={order.isLong ? long : short}></Image>
                    <LightTooltip title="Amount x Price">
                        <Text className="text-xxs" style={{ flex: 3, textAlign: 'center' }}>
                            {formatCurrency(order.displayOrder.amount, DEFAULT_OPTIONS_DECIMALS) + ' x '}
                            {formatCurrencyWithSign(USD_SIGN, order.displayOrder.price, DEFAULT_OPTIONS_DECIMALS)}
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
