import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, FlexDivRow, Image, Text } from 'theme/common';
import { ExtendedOrders, ExtendedOrderItem, HistoricalOptionsMarketInfo, OptionSide } from 'types/options';
import {
    formatCurrency,
    formatCurrencyWithSign,
    formatPercentage,
    getPercentageDifference,
    truncToDecimals,
} from 'utils/formatters/number';
import { getSynthName } from 'utils/snxJSConnector';
import { CryptoKey, CryptoName } from '../../MarketCard/MarketCard';
import arrowUp from 'assets/images/arrow-up.svg';
import arrowDown from 'assets/images/arrow-down.svg';
import { navigateToOptionsMarket } from 'utils/routes';
import { countryToCountryCode, eventToIcon } from '../../MarketsTable/MarketsTable';
import ReactCountryFlag from 'react-country-flag';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import { DefaultSubmitButton, LightTooltip, SubmitButton } from 'pages/Options/Market/components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { EMPTY_VALUE } from 'constants/placeholder';
import PlaceOrderModal from 'pages/Options/QuickTrading/PlaceOrderModal';
import FillOrderModal from 'pages/Options/Market/TradeOptions/Orderbook/FillOrderModal';
import CancelOrderModal from 'pages/Options/Market/TradeOptions/Orderbook/CancelOrderModal';
import longIcon from 'assets/images/long_small.svg';
import shortIcon from 'assets/images/short_small.svg';

type OrderCardMobileProps = {
    orders: ExtendedOrders;
    exchangeRates: Rates | null;
    isBuyMode: boolean;
};

const OrderCardMobile: React.FC<OrderCardMobileProps> = ({ orders, exchangeRates, isBuyMode }) => {
    const { t } = useTranslation();
    const [fillOrderModalVisible, setFillOrderModalVisible] = useState<boolean>(false);
    const [placeOrderModalVisible, setPlaceOrderModalVisible] = useState<boolean>(false);
    const [cancelOrderModalVisible, setCancelOrderModalVisible] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<ExtendedOrderItem | null>(null);
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const openFillOrderModal = useCallback((order: ExtendedOrderItem) => {
        setFillOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);
    const openPlaceOrderModal = useCallback((order: ExtendedOrderItem) => {
        setPlaceOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);

    const openCancelOrderModal = useCallback((order: ExtendedOrderItem) => {
        setCancelOrderModalVisible(true);
        setSelectedOrder(order);
    }, []);

    const orderbookSign = (optionsMarket: HistoricalOptionsMarketInfo, optionSide: OptionSide) =>
        optionsMarket.customMarket
            ? optionSide === 'long'
                ? optionsMarket.eventName === 'XYZ airdrop claims' ||
                  optionsMarket.eventName === 'ETH burned count' ||
                  optionsMarket.eventName === 'Flippening Markets' ||
                  optionsMarket.eventName === 'ETH/BTC market cap ratio'
                    ? '>='
                    : '=='
                : optionsMarket.eventName === 'XYZ airdrop claims' ||
                  optionsMarket.eventName === 'ETH burned count' ||
                  optionsMarket.eventName === 'Flippening Markets' ||
                  optionsMarket.eventName === 'ETH/BTC market cap ratio'
                ? '<'
                : '!='
            : optionSide === 'long'
            ? '>'
            : '<';

    return (
        <Wrapper>
            {orders.map((order: ExtendedOrderItem, index) => {
                const currentAssetPrice = exchangeRates?.[order.market.currencyKey] || 0;
                const strikeAndAssetPriceDifference = getPercentageDifference(
                    currentAssetPrice,
                    order.market.strikePrice
                );
                return (
                    <CardWrapper className="cardWrapper" key={index}>
                        <Container>
                            <FlexDivRow
                                style={{ marginBottom: 16 }}
                                onClick={() => navigateToOptionsMarket(order.market.address, order.optionSide)}
                            >
                                <FlexDivCentered style={{ alignItems: 'flex-start' }}>
                                    {order.market.customMarket ? (
                                        <>
                                            <ReactCountryFlag
                                                countryCode={countryToCountryCode(order.market.country as any)}
                                                style={{ width: 32, height: 32, marginRight: 10 }}
                                                svg
                                            />
                                            <FlexDivColumnCentered style={{ flex: 0 }}>
                                                <FlexDivRow style={{ alignItems: 'center' }}>
                                                    {order.market.customMarket &&
                                                        !countryToCountryCode(order.market.country as any) && (
                                                            <CustomIcon
                                                                src={eventToIcon(order.market.eventName as any)}
                                                            ></CustomIcon>
                                                        )}
                                                    <Text
                                                        className="text-m pale-grey"
                                                        style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}
                                                    >
                                                        {`${order.market.country} ${orderbookSign(
                                                            order.market,
                                                            order.optionSide
                                                        )} ${formatCurrency(
                                                            order.market.outcome || 0,
                                                            order.market.eventName === 'Flippening Markets' ||
                                                                order.market.eventName === 'ETH/BTC market cap ratio'
                                                                ? 2
                                                                : 0
                                                        )}`}
                                                    </Text>
                                                </FlexDivRow>
                                            </FlexDivColumnCentered>
                                        </>
                                    ) : (
                                        <>
                                            <CurrencyIcon
                                                currencyKey={order.market.currencyKey}
                                                synthIconStyle={{ width: 36, height: 36 }}
                                            />
                                            <FlexDivColumnCentered style={{ flex: 0 }}>
                                                <CryptoName
                                                    style={{ fontSize: 16, marginBottom: 0, whiteSpace: 'nowrap' }}
                                                >
                                                    {getSynthName(order.market.currencyKey)}
                                                </CryptoName>
                                                <CryptoKey style={{ fontSize: 14 }}>{order.market.asset}</CryptoKey>
                                            </FlexDivColumnCentered>
                                            <FlexDivCentered>
                                                <Sign>{orderbookSign(order.market, order.optionSide)}</Sign>
                                            </FlexDivCentered>
                                            <FlexDivColumnCentered style={{ flex: 0, alignItems: 'center' }}>
                                                <Price>
                                                    {formatCurrencyWithSign(USD_SIGN, order.market.strikePrice)}
                                                </Price>
                                                <LightTooltip
                                                    title={t('options.quick-trading.difference-text-tooltip')}
                                                >
                                                    {currentAssetPrice > order.market.strikePrice ? (
                                                        <RedText
                                                            style={{
                                                                display: isFinite(strikeAndAssetPriceDifference)
                                                                    ? 'flex'
                                                                    : 'none',
                                                            }}
                                                        >
                                                            <PriceArrow src={arrowDown} />
                                                            <span>{strikeAndAssetPriceDifference.toFixed(2)}%</span>
                                                        </RedText>
                                                    ) : (
                                                        <GreenText
                                                            style={{
                                                                display: isFinite(strikeAndAssetPriceDifference)
                                                                    ? 'flex'
                                                                    : 'none',
                                                            }}
                                                        >
                                                            <PriceArrow src={arrowUp} />
                                                            <span>{strikeAndAssetPriceDifference.toFixed(2)}%</span>
                                                        </GreenText>
                                                    )}
                                                </LightTooltip>
                                            </FlexDivColumnCentered>
                                        </>
                                    )}
                                </FlexDivCentered>
                                <FlexDivCentered style={{ textAlign: 'right' }}>
                                    <Sign>
                                        {order.optionSide === 'long' ? (
                                            <SideImage src={longIcon} />
                                        ) : (
                                            <SideImage src={shortIcon} />
                                        )}
                                    </Sign>
                                </FlexDivCentered>
                            </FlexDivRow>
                            <FlexDivRow style={{ marginBottom: 8, alignItems: 'flex-start' }}>
                                <FlexDivColumnCentered>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {t('options.quick-trading.table.when-col')}
                                    </Text>
                                    <Text className="text-ms pale-grey">
                                        {formatShortDateWithTime(order.market.maturityDate)}
                                    </Text>
                                </FlexDivColumnCentered>
                                <FlexDivColumnCentered style={{ textAlign: isBuyMode ? 'center' : 'right' }}>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {isBuyMode
                                            ? t('options.quick-trading.table.deposit-amount-col')
                                            : t('options.quick-trading.table.receive-amount-col')}
                                    </Text>
                                    <Text className="text-ms pale-grey">
                                        {formatCurrencyWithSign(
                                            USD_SIGN,
                                            order.displayOrder.fillableTotal,
                                            DEFAULT_OPTIONS_DECIMALS
                                        )}
                                    </Text>
                                </FlexDivColumnCentered>
                                {isBuyMode && (
                                    <FlexDivColumnCentered style={{ textAlign: 'right' }}>
                                        <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                            {t('options.quick-trading.table.return-col')}
                                        </Text>
                                        <Text className="text-ms pale-grey">
                                            {isBuyMode
                                                ? `${formatCurrencyWithSign(
                                                      USD_SIGN,
                                                      order.displayOrder.potentialReturnAmount +
                                                          order.displayOrder.fillableTotal,
                                                      DEFAULT_OPTIONS_DECIMALS
                                                  )} (${formatPercentage(order.displayOrder.potentialReturn)})`
                                                : formatCurrency(
                                                      order.displayOrder.fillableAmount,
                                                      DEFAULT_OPTIONS_DECIMALS
                                                  )}
                                        </Text>
                                    </FlexDivColumnCentered>
                                )}
                            </FlexDivRow>

                            {!isBuyMode && (
                                <FlexDivRow style={{ marginBottom: 8, alignItems: 'flex-start' }}>
                                    <FlexDivColumnCentered>
                                        <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                            {t('options.quick-trading.table.options-to-sell-col')}
                                        </Text>
                                        <Text className="text-ms pale-grey">
                                            {formatCurrency(
                                                order.displayOrder.fillableAmount,
                                                DEFAULT_OPTIONS_DECIMALS
                                            )}
                                        </Text>
                                    </FlexDivColumnCentered>
                                    <FlexDivColumnCentered style={{ textAlign: 'right' }}>
                                        <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                            {t('options.quick-trading.table.options-in-wallet-col')}
                                        </Text>
                                        <Text className="text-ms pale-grey">
                                            {isWalletConnected
                                                ? formatCurrency(order.walletBalance || 0, DEFAULT_OPTIONS_DECIMALS)
                                                : EMPTY_VALUE}
                                        </Text>
                                    </FlexDivColumnCentered>
                                </FlexDivRow>
                            )}
                            {order.rawOrder.maker.toLowerCase() !== walletAddress.toLowerCase() && isWalletConnected && (
                                <FlexDivRow style={{ marginBottom: 8 }}>
                                    <FlexDivColumnCentered>
                                        <>
                                            <BuySellButton
                                                onClick={() => {
                                                    openFillOrderModal(order);
                                                }}
                                                isBuy={isBuyMode}
                                                disabled={order.walletBalance === 0}
                                            >
                                                {isBuyMode ? t('common.buy') : t('common.sell')}
                                            </BuySellButton>
                                        </>
                                    </FlexDivColumnCentered>
                                    <FlexDivColumnCentered style={{ textAlign: 'right' }}>
                                        <>
                                            <LightTooltip
                                                title={t('options.quick-trading.counter-offer-button-tooltip')}
                                            >
                                                <CounterOfferButton
                                                    onClick={() => {
                                                        openPlaceOrderModal(order);
                                                    }}
                                                    disabled={order.walletBalance === 0}
                                                >
                                                    {t('options.quick-trading.counter-offer-button-label')}
                                                </CounterOfferButton>
                                            </LightTooltip>
                                        </>
                                    </FlexDivColumnCentered>
                                </FlexDivRow>
                            )}
                            {order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase() && isWalletConnected && (
                                <FlexDivRow style={{ marginBottom: 8 }}>
                                    <FlexDivColumnCentered style={{ textAlign: 'center', alignItems: 'center' }}>
                                        <LightTooltip title={t('options.quick-trading.cancel-tooltip')}>
                                            <CounterOfferButton
                                                onClick={() => {
                                                    openCancelOrderModal(order);
                                                }}
                                                style={{ width: 150 }}
                                            >
                                                {t('options.quick-trading.cancel-button-label')}
                                            </CounterOfferButton>
                                        </LightTooltip>
                                    </FlexDivColumnCentered>
                                </FlexDivRow>
                            )}
                        </Container>
                    </CardWrapper>
                );
            })}

            {fillOrderModalVisible && selectedOrder !== null && (
                <FillOrderModal
                    order={selectedOrder}
                    optionSide={selectedOrder.optionSide}
                    orderSide={isBuyMode ? 'sell' : 'buy'}
                    onClose={() => setFillOrderModalVisible(false)}
                    market={selectedOrder.market}
                />
            )}
            {placeOrderModalVisible && selectedOrder !== null && (
                <PlaceOrderModal
                    optionSide={selectedOrder.optionSide}
                    orderSide={isBuyMode ? 'buy' : 'sell'}
                    onClose={() => setPlaceOrderModalVisible(false)}
                    market={selectedOrder.market}
                    defaultPrice={truncToDecimals(selectedOrder.displayOrder.price, DEFAULT_OPTIONS_DECIMALS)}
                    defaultAmount={truncToDecimals(selectedOrder.displayOrder.fillableAmount, DEFAULT_OPTIONS_DECIMALS)}
                />
            )}
            {cancelOrderModalVisible && selectedOrder !== null && (
                <CancelOrderModal
                    order={selectedOrder}
                    baseToken={
                        selectedOrder.optionSide === 'long'
                            ? selectedOrder.market.longAddress
                            : selectedOrder.market.shortAddress
                    }
                    optionSide={selectedOrder.optionSide}
                    onClose={() => setCancelOrderModalVisible(false)}
                />
            )}
        </Wrapper>
    );
};

export default OrderCardMobile;

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    margin: 20px 0;
    .cardWrapper:nth-child(even) {
        justify-self: end;
    }
    @media (max-width: 767px) {
        grid-template-columns: repeat(1, 1fr);
        .cardWrapper {
            justify-self: center !important;
        }
    }
`;

const CardWrapper = styled(FlexDiv)`
    width: 100%;
    align-items: center;
    position: relative;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    height: 192px;
    padding: 1px;
    border-radius: 23px;
    @media (max-width: 767px) {
        max-width: 400px;
        height: 100%;
    }
`;

const Container = styled.div`
    border-radius: 23px;
    background: #04045a;
    width: 100%;
    height: 100%;
    padding: 14px 30px;
`;

// const Phase = styled.p`
//     &.trading {
//         background: #01b977;
//     }
//     &.maturity {
//         background: #355dff;
//     }
//     &.expiry {
//         background: #c62937;
//     }
//     border-radius: 15px;
//     font-weight: 600;
//     font-size: 14px;
//     line-height: 16px;
//     letter-spacing: 0.25px;
//     color: #f6f6fe;
//     padding: 10px 34px;
//     text-transform: uppercase;
//     height: 36px;
// `;

// const DifferenceWrapper = styled(FlexDivCentered)`
//     position: relative;
//     height: 0;
//     display: flex;
//     justify-content: flex-end;
//     top: 14px;
// `;

const BuySellButton = styled(SubmitButton)`
    margin-right: 15px;
    margin-left: 5px;
    margin-top: 22px;
    text-transform: capitalize;
`;

const CounterOfferButton = styled(DefaultSubmitButton)`
    margin-right: 5px;
    margin-left: 15px;
    margin-top: 22px;
`;

const PriceArrow = styled(Image)`
    width: 14px;
    height: 14px;
    margin-bottom: -2px;
`;

const GreenText = styled.span`
    color: #01b977;
    font-size: 14px;
    display: flex;
    align-items: center;
`;

const RedText = styled.span`
    color: #be2727;
    font-size: 14px;
    display: flex;
    align-items: center;
`;

const Sign = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    text-align: right;
    letter-spacing: 0.5px;
    color: #ffffff;
    margin-left: 4px;
    margin-right: 4px;
`;

const Price = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
`;

export const CustomIcon = styled(Image)`
    margin-right: 6px;
    width: 24px;
    height: 24px;
`;

const SideImage = styled.img`
    width: 44px;
    margin-left: 4px;
`;
