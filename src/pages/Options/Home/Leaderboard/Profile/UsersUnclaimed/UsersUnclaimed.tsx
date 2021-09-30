import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumnCentered, Text } from 'theme/common';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getSynthName } from 'utils/snxJSConnector';

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
                <CurrencyIcon
                    currencyKey={market.currencyKey}
                    synthIconStyle={{ width: 100, height: 100, marginRight: 0 }}
                />
                <CryptoName>{getSynthName(market.currencyKey)}</CryptoName>
                <CryptoKey>{market.asset}</CryptoKey>
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
                        borderImage: 'linear-gradient(to right, #748BC6 80%, #04045A 20%) 100% 1',
                        marginTop: 36,
                    }}
                >
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.unclaimed.long')}
                    </Text>
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.unclaimed.short')}
                    </Text>
                </Row>
                {!showAll && (
                    <Row className="text-m">
                        <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, usersUnclaimed[0].long)}</Text>
                        <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, usersUnclaimed[0].short)}</Text>
                    </Row>
                )}
                <RowScrollable>
                    {showAll &&
                        usersUnclaimed?.map((unclaimed, index) => (
                            <Row className="text-m" key={index} style={{ width: '106.5%' }}>
                                <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, unclaimed.long)}</Text>
                                <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, unclaimed.short)}</Text>
                            </Row>
                        ))}
                </RowScrollable>
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
    max-height: 150px;
    max-width: 95%;
`;

export default UsersUnclaimed;
