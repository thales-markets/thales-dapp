import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import useUserOrdersQuery from 'queries/user/useUserOrdersQuery';
import React, { useMemo } from 'react';
import { FlexDivCentered, Image, Text } from 'theme/common';
import { OptionsMarkets, Trade } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';
import { prepBuyOrder, prepSellOrder } from 'utils/formatters/order';
import { NetworkId } from 'utils/network';
import { navigateToOptionsMarket } from 'utils/routes';
import snxJSConnector from 'utils/snxJSConnector';
import long from 'assets/images/long.svg';
import short from 'assets/images/short.svg';
import { MarketRow, Row } from '../UserInfoModal';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import ReactCountryFlag from 'react-country-flag';
import { countryToCountryCode, eventToIcon } from 'pages/Options/Home/MarketsTable/MarketsTable';
import { useTranslation } from 'react-i18next';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';

type UsersOrdersProps = {
    optionsMarkets: OptionsMarkets;
    walletAddress: string;
    networkId: NetworkId;
    onClose: () => void;
};

const UsersOrders: React.FC<UsersOrdersProps> = ({ optionsMarkets, walletAddress, networkId, onClose }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;

    const ordersQuery = useUserOrdersQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const openOrdersQuery = fetchAllMarketOrders(networkId);
    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);

    const filteredOrders = useMemo(() => {
        if (ordersQuery.isSuccess && openOrdersQuery.isSuccess) {
            return optionsMarkets.reduce((acc, market: any) => {
                const openOrders = (openOrdersMap as any).get(market.address) || 0;
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
            <Row>
                <Text className="bold" style={{ flex: 3 }}>
                    {t(`user-info.table.asset-col`)}
                </Text>
                <Text className="bold" style={{ flex: 2 }}>
                    {t(`user-info.table.strike-price-col`)}
                </Text>
                <Text className="bold" style={{ flex: 3, textAlign: 'center' }}>
                    {t(`user-info.table.maturity-date-col`)}
                </Text>
                <Text className="bold" style={{ flex: 2, textAlign: 'right' }}>
                    {t(`user-info.table.amount-col`)}
                </Text>
                <Text className="bold" style={{ flex: 2, paddingRight: 8, textAlign: 'center' }}>
                    {t(`user-info.table.price-col`)}
                </Text>
                <Text className="bold" style={{ flex: 2 }}>
                    {t(`user-info.table.filled-col`)}
                </Text>
                <Text className="bold" style={{ flex: 2 }}>
                    {t(`user-info.table.expires-col`)}
                </Text>
            </Row>
            {filteredOrders?.map((order: any, index) => (
                <MarketRow
                    style={{
                        background: order.isBuy ? 'rgb(4, 193, 157, 0.12)' : 'rgb(255, 62, 36, 0.12)',
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
                        {order.market.customMarket ? (
                            <>
                                <ReactCountryFlag
                                    countryCode={countryToCountryCode(order.market.country as any)}
                                    style={{ width: 24, height: 24, marginRight: 10 }}
                                    svg
                                />
                                {order.market.country}
                            </>
                        ) : (
                            <Currency.Name
                                currencyKey={order.market.currencyKey}
                                showIcon={true}
                                synthIconStyle={{ width: 24, height: 24 }}
                                iconProps={{ type: 'asset' }}
                            />
                        )}
                    </FlexDivCentered>
                    <Text className="text-xxs" style={{ flex: 2 }}>
                        {order.market.customMarket ? (
                            <Image
                                style={{ width: 32, height: 32 }}
                                src={eventToIcon(order.market.eventName as any)}
                            ></Image>
                        ) : (
                            formatCurrencyWithSign(USD_SIGN, order.market.strikePrice)
                        )}
                    </Text>

                    <Text className="text-xxs" style={{ flex: 3, textAlign: 'center' }}>
                        {formatShortDate(order.market.maturityDate)}
                    </Text>

                    <Image style={{ width: 24 }} src={order.isLong ? long : short}></Image>

                    <Text className="text-xxs" style={{ flex: 2, textAlign: 'center' }}>
                        {formatCurrency(order.displayOrder.amount, DEFAULT_OPTIONS_DECIMALS)}
                    </Text>

                    <Text className="text-xxs" style={{ flex: 2, textAlign: 'center' }}>
                        {formatCurrencyWithSign(USD_SIGN, order.displayOrder.price, DEFAULT_OPTIONS_DECIMALS)}
                    </Text>

                    <Text className="text-xxs" style={{ flex: 2, textAlign: 'center' }}>
                        {formatPercentage(order.displayOrder.filled, 0)}
                    </Text>

                    <Text className="text-xxs" style={{ flex: 3, textAlign: 'center' }}>
                        <TimeRemaining end={order.displayOrder.timeRemaining} />
                    </Text>
                </MarketRow>
            ))}
        </>
    );
};

export default UsersOrders;
