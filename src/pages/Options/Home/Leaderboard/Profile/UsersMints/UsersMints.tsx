import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import { DisplayContentsAnchor } from 'pages/Options/Home/MarketsTable/components';
import { countryToCountryCode, eventToIcon } from 'pages/Options/Home/MarketsTable/MarketsTable';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumnCentered, Text, Image } from 'theme/common';
import { formatShortDate, formatTxTimestamp } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink } from 'utils/routes';
import { getSynthName } from 'utils/snxJSConnector';
import ReactCountryFlag from 'react-country-flag';
import '../media.scss';

type UsersMintsProps = {
    usersMints: any[];
    market: any;
};

const UsersMints: React.FC<UsersMintsProps> = ({ usersMints, market }) => {
    const { t } = useTranslation();
    const [showAll, setShowAll] = useState<boolean>(false);

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
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.markets.strike-price')}
                    </Text>
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.markets.pool-size')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.maturity-date')}
                    </Text>
                </Row>
                <Row className="text-m">
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                    <Text style={{ flex: 1 }}>{formatShortDate(market.maturityDate)}</Text>
                </Row>
                <Row className="text-ms leaderboard__profile__rowBackground__columns">
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.common.amount')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.common.timestamp')}
                    </Text>
                </Row>
                {!showAll && (
                    <Row className="text-m">
                        <Text style={{ flex: 1 }}>{usersMints[0].amount}</Text>
                        <Text style={{ flex: 1 }}>{formatTxTimestamp(new Date(usersMints[0].timestamp))}</Text>
                    </Row>
                )}
                <RowScrollable>
                    {showAll &&
                        usersMints?.map((mint, index) => (
                            <Row className="text-m" key={index} style={{ width: '106.5%' }}>
                                <Text style={{ flex: 1 }}>{mint.amount}</Text>
                                <Text style={{ flex: 1 }}>{formatTxTimestamp(new Date(mint.timestamp))}</Text>
                            </Row>
                        ))}
                </RowScrollable>

                <Row>
                    <Text style={{ flex: 3 }}></Text>
                    <FlexDivColumnCentered className="text-ms leaderboard__profile__rowBackground__buttonContainer">
                        {usersMints.length > 1 && (
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

export default UsersMints;
