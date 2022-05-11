import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, FlexDivRow, Image, Text } from 'theme/common';
import { ExtendedTrades, ExtendedTrade, HistoricalOptionsMarketInfo, OptionSide } from 'types/options';
import { formatCurrency, formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { CryptoKey, CryptoName } from '../../MarketCard/MarketCard';
import { navigateToOptionsMarket } from 'utils/routes';
import { countryToCountryCode, eventToIcon } from 'components/OldVersion/old-utils';
import ReactCountryFlag from 'react-country-flag';
import { formatShortDate, formatTxTimestamp } from 'utils/formatters/date';
import longIcon from 'assets/images/long_small.svg';
import shortIcon from 'assets/images/short_small.svg';
import { getSynthName } from 'utils/currency';
import ViewEtherscanLink from 'components/ViewEtherscanLink';

type TradeCardMobileProps = {
    trades: ExtendedTrades;
};

const TradeCardMobile: React.FC<TradeCardMobileProps> = ({ trades }) => {
    const { t } = useTranslation();

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
            {trades.map((trade: ExtendedTrade, index) => {
                return (
                    <CardWrapper className="cardWrapper" key={index}>
                        <Container>
                            <FlexDivRow
                                style={{ marginBottom: 16 }}
                                onClick={() => navigateToOptionsMarket(trade.marketItem.address, trade.optionSide)}
                            >
                                <FlexDivCentered style={{ alignItems: 'center' }}>
                                    {trade.marketItem.customMarket ? (
                                        <>
                                            <ReactCountryFlag
                                                countryCode={countryToCountryCode(trade.marketItem.country as any)}
                                                style={{ width: 32, height: 32, marginRight: 10 }}
                                                svg
                                            />
                                            <FlexDivColumnCentered style={{ flex: 0 }}>
                                                <FlexDivRow style={{ alignItems: 'center' }}>
                                                    {trade.marketItem.customMarket &&
                                                        !countryToCountryCode(trade.marketItem.country as any) && (
                                                            <CustomIcon
                                                                src={eventToIcon(trade.marketItem.eventName as any)}
                                                            ></CustomIcon>
                                                        )}
                                                    <Text
                                                        className="text-m pale-grey"
                                                        style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}
                                                    >
                                                        {`${trade.marketItem.country} ${orderbookSign(
                                                            trade.marketItem,
                                                            trade.optionSide
                                                        )} ${formatCurrency(
                                                            trade.marketItem.outcome || 0,
                                                            trade.marketItem.eventName === 'Flippening Markets' ||
                                                                trade.marketItem.eventName ===
                                                                    'ETH/BTC market cap ratio'
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
                                                currencyKey={trade.marketItem.currencyKey}
                                                synthIconStyle={{ width: 36, height: 36 }}
                                            />
                                            <FlexDivColumnCentered style={{ flex: 0 }}>
                                                <CryptoName
                                                    style={{ fontSize: 16, marginBottom: 0, whiteSpace: 'nowrap' }}
                                                >
                                                    {getSynthName(trade.marketItem.currencyKey)}
                                                </CryptoName>
                                                <CryptoKey style={{ fontSize: 14 }}>{trade.marketItem.asset}</CryptoKey>
                                            </FlexDivColumnCentered>
                                            <FlexDivCentered>
                                                <Sign>{orderbookSign(trade.marketItem, trade.optionSide)}</Sign>
                                            </FlexDivCentered>
                                            <FlexDivColumnCentered style={{ flex: 0, alignItems: 'flex-start' }}>
                                                <Price>
                                                    {formatCurrencyWithSign(USD_SIGN, trade.marketItem.strikePrice)}
                                                </Price>
                                                <MaturityDate>
                                                    {`@ ${formatShortDate(trade.marketItem.maturityDate)}`}
                                                </MaturityDate>
                                            </FlexDivColumnCentered>
                                        </>
                                    )}
                                </FlexDivCentered>
                                <FlexDivCentered style={{ textAlign: 'right' }}>
                                    <Sign>
                                        {trade.optionSide === 'long' ? (
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
                                        {t('options.leaderboard.trades.table.date-time-col')}
                                    </Text>
                                    <Text className="text-ms pale-grey">{formatTxTimestamp(trade.timestamp)}</Text>
                                </FlexDivColumnCentered>
                                <FlexDivColumnCentered style={{ textAlign: 'right' }}>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {t('options.leaderboard.trades.table.type-col')}
                                    </Text>
                                    <Text className={`text-ms color-${trade.orderSide} uppercase`}>
                                        {trade.orderSide}
                                    </Text>
                                </FlexDivColumnCentered>
                            </FlexDivRow>

                            <FlexDivRow style={{ marginBottom: 8, alignItems: 'flex-start' }}>
                                <FlexDivColumnCentered>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {t('options.leaderboard.trades.table.amount-col')}
                                    </Text>
                                    <Text className={`text-ms color-${trade.orderSide}`}>
                                        {formatCurrencyWithKey(
                                            OPTIONS_CURRENCY_MAP[trade.optionSide],
                                            trade.orderSide === 'buy' ? trade.makerAmount : trade.takerAmount
                                        )}
                                    </Text>
                                </FlexDivColumnCentered>
                                <FlexDivColumnCentered style={{ textAlign: 'right' }}>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {t('options.leaderboard.trades.table.price-col')}
                                    </Text>
                                    <Text className={`text-ms color-${trade.orderSide}`}>
                                        {formatCurrencyWithKey(
                                            SYNTHS_MAP.sUSD,
                                            trade.orderSide === 'buy'
                                                ? trade.takerAmount / trade.makerAmount
                                                : trade.makerAmount / trade.takerAmount
                                        )}
                                    </Text>
                                </FlexDivColumnCentered>
                            </FlexDivRow>
                            <FlexDivColumnCentered style={{ textAlign: 'center' }}>
                                <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                    {t('options.leaderboard.trades.table.tx-status-col')}
                                </Text>
                                <Text className="text-ms pale-grey">
                                    <ViewEtherscanLink hash={trade.transactionHash} />
                                </Text>
                            </FlexDivColumnCentered>
                        </Container>
                    </CardWrapper>
                );
            })}
        </Wrapper>
    );
};

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

const MaturityDate = styled.span`
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #ffffff;
    white-space: nowrap;
`;

export default TradeCardMobile;
