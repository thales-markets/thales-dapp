import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumnCentered, Text, Image } from 'theme/common';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getSynthName } from 'utils/snxJSConnector';
import ReactCountryFlag from 'react-country-flag';
import { DisplayContentsAnchor } from 'pages/Options/Home/MarketsTable/components';
import { countryToCountryCode, eventToIcon } from 'pages/Options/Home/MarketsTable/MarketsTable';
import { buildOptionsMarketLink } from 'utils/routes';

type UsersUnclaimedProps = {
    usersUnclaimed: any[];
    market: any;
};

const UsersUnclaimed: React.FC<UsersUnclaimedProps> = ({ usersUnclaimed, market }) => {
    const { t } = useTranslation();
    const [showAll, setShowAll] = useState<boolean>(false);

    return (
        <FlexDiv
            style={{
                flex: 1,
                background: 'linear-gradient(#ca91dc, #6ac1d5)',
                border: '1px solid transparent',
                borderRadius: 23,
                marginBottom: 16,
            }}
        >
            <FlexDivColumnCentered
                style={{
                    flexGrow: 1,
                    alignItems: 'center',
                    background: '#04045A',
                    borderBottomLeftRadius: 23,
                    borderTopLeftRadius: 23,
                }}
            >
                <DisplayContentsAnchor
                    style={{
                        pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                    }}
                    href={buildOptionsMarketLink(market.address)}
                >
                    {market.customMarket ? (
                        <>
                            <ReactCountryFlag
                                countryCode={countryToCountryCode(market.country as any)}
                                style={{ width: 100, height: 100, marginRight: 0 }}
                                svg
                            />
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
            <FlexDivColumnCentered
                className="text-ms"
                style={{
                    flexGrow: 8,
                    paddingTop: 36,
                    background: '#04045A',
                    borderBottomRightRadius: 23,
                    borderTopRightRadius: 23,
                }}
            >
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
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.result')}
                    </Text>
                </Row>
                <Row className="text-m">
                    <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    <Text style={{ flex: 1 }}> {formatShortDate(market.maturityDate)}</Text>
                    <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                    <Text style={{ flex: 1 }}>{market.result}</Text>
                </Row>

                <Row
                    className="text-ms"
                    style={{
                        borderBottom: '1px solid',
                        borderImage: 'linear-gradient(to right, #748BC6 1%, #04045A 20%) 100% 1',
                        marginTop: 36,
                    }}
                >
                    <Text className="bold" style={{ flex: 2 }}>
                        {market.result === 'long'
                            ? t('options.leaderboard.profile.unclaimed.long')
                            : t('options.leaderboard.profile.unclaimed.short')}
                    </Text>
                </Row>
                <Row className="text-m">
                    <Text style={{ flex: 8 }}>
                        {market.result === 'long'
                            ? formatCurrencyWithSign(USD_SIGN, usersUnclaimed[0].long)
                            : formatCurrencyWithSign(USD_SIGN, usersUnclaimed[0].short)}
                    </Text>
                    <Button className="primary" style={{ flex: 1, marginRight: 740 }}>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={buildOptionsMarketLink(market.address)}
                            style={{ color: 'white', verticalAlign: 'top' }}
                        >
                            {t('options.leaderboard.profile.filters.redeem')}
                        </a>
                    </Button>
                </Row>
                <Row>
                    <Text style={{ flex: 3 }}></Text>
                    <FlexDivColumnCentered
                        style={{
                            flexGrow: 1,
                            alignItems: 'center',
                            flex: 0,
                            height: 72,
                        }}
                    >
                        {usersUnclaimed.length > 1 && (
                            <Button
                                className="primary"
                                style={{ background: 'transparent', padding: '24px 35px' }}
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll
                                    ? t('options.leaderboard.profile.common.view-less')
                                    : t('options.leaderboard.profile.common.view-all')}
                            </Button>
                        )}
                    </FlexDivColumnCentered>

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
