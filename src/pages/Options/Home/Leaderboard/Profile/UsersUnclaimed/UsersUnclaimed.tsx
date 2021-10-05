import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import { DisplayContentsAnchor } from 'pages/Options/Home/MarketsTable/components';
import { countryToCountryCode, eventToIcon } from 'pages/Options/Home/MarketsTable/MarketsTable';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumnCentered, Image, Text } from 'theme/common';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink } from 'utils/routes';
import { getSynthName } from 'utils/snxJSConnector';
import { COLORS } from 'constants/ui';

type UsersUnclaimedProps = {
    usersUnclaimed: any[];
    market: any;
};

const getCellColor = (type: string) => {
    switch (type) {
        case 'long':
            return COLORS.LONG;
        case 'short':
            return COLORS.SHORT;
        default:
            return COLORS.WHITE;
    }
};

const UsersUnclaimed: React.FC<UsersUnclaimedProps> = ({ usersUnclaimed, market }) => {
    const { t } = useTranslation();

    return (
        <FlexDiv className="leaderboard__profile__rowBorder">
            <FlexDivColumnCentered className="leaderboard__profile__rowBackground leaderboard__profile__rowBackground--left">
                <DisplayContentsAnchor
                    style={{
                        pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                    }}
                    href={buildOptionsMarketLink(market.address)}
                >
                    {market.customMarket ? (
                        <>
                            {countryToCountryCode(market.country as any) && (
                                <ReactCountryFlag
                                    countryCode={countryToCountryCode(market.country as any)}
                                    style={{ width: 100, height: 100, marginRight: 0 }}
                                    svg
                                />
                            )}
                            {!countryToCountryCode(market.country as any) && (
                                <CustomIcon src={eventToIcon(market.eventName as any)}></CustomIcon>
                            )}
                            {market.country}
                        </>
                    ) : (
                        <>
                            <CurrencyIcon
                                currencyKey={market.currencyKey}
                                synthIconStyle={{ width: 100, height: 100, marginRight: 0 }}
                            />
                            <CryptoName>{getSynthName(market.currencyKey)}</CryptoName>
                            <CryptoKey>{market.asset}</CryptoKey>
                        </>
                    )}
                </DisplayContentsAnchor>
            </FlexDivColumnCentered>
            <FlexDivColumnCentered className="text-ms leaderboard__profile__rowBackground leaderboard__profile__rowBackground--right">
                <Row>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.strike-price')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.pool-size')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.maturity-date')}
                    </Text>
                </Row>
                <Row className="text-m">
                    <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    <Text style={{ flex: 1 }}> {formatShortDate(market.maturityDate)}</Text>
                    <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                </Row>

                <Row className="text-ms leaderboard__profile__rowBackground__columns" style={{ borderBottom: 'none' }}>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.result')}
                    </Text>
                    <Text className="bold" style={{ flex: 2 }}>
                        {market.result === 'long'
                            ? t('options.leaderboard.profile.common.long')
                            : t('options.leaderboard.profile.common.short')}
                    </Text>
                </Row>
                <Row className="text-m">
                    <Text style={{ flex: 1, color: getCellColor(market.result) }}>{market.result.toUpperCase()}</Text>
                    <Text style={{ flex: 1, paddingLeft: 16 }}>
                        {market.result === 'long'
                            ? formatCurrencyWithSign(USD_SIGN, usersUnclaimed[0].long)
                            : formatCurrencyWithSign(USD_SIGN, usersUnclaimed[0].short)}
                    </Text>
                    <FlexDivColumnCentered style={{ flex: 1, alignItems: 'baseline', paddingRight: 35 }}>
                        <Button className="primary">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href={buildOptionsMarketLink(market.address)}
                                style={{ color: 'white', verticalAlign: 'top' }}
                            >
                                {t('options.leaderboard.profile.unclaimed.redeem')}
                            </a>
                        </Button>
                    </FlexDivColumnCentered>
                </Row>
                <Row>
                    <Text style={{ flex: 3 }}></Text>
                    <FlexDivColumnCentered className="text-ms leaderboard__profile__rowBackground__buttonContainer"></FlexDivColumnCentered>

                    <Text style={{ flex: 4 }}></Text>
                </Row>
            </FlexDivColumnCentered>
        </FlexDiv>
    );
};

export const CryptoKey = styled.p`
    font-family: Inter !important;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: #808191;
`;

export const Row = styled(FlexDiv)`
    color: #f6f6fe;
    line-height: 16px;
    font-weight: 600;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
`;

export const RowScrollable = styled(FlexDiv)`
    flex-direction: column;
    overflow-x: hidden;
    max-height: 245px;
    max-width: 95%;
`;

export const CustomIcon = styled(Image)`
    margin-right: 0px;
    width: 100px;
    height: 100px;
`;

export default UsersUnclaimed;
