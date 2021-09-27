import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumnCentered, Text } from 'theme/common';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getSynthName } from 'utils/snxJSConnector';
type UsersMintsProps = {
    usersMints: any[];
    market: any;
};

const UsersMints: React.FC<UsersMintsProps> = ({ usersMints, market }) => {
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
                    <Text className="bold" style={{ flex: 2 }}>
                        Strike Price
                    </Text>
                    <Text className="bold" style={{ flex: 2 }}>
                        Pool Size
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        Maturity Date
                    </Text>
                </Row>
                <Row className="text-m">
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                    <Text style={{ flex: 1 }}>{formatShortDate(market.maturityDate)}</Text>
                </Row>
                <Row
                    className="text-ms"
                    style={{
                        borderBottom: '1px solid #748bc6',
                        marginTop: 36,
                    }}
                >
                    <Text className="bold" style={{ flex: 2 }}>
                        Amount
                    </Text>
                    <Text className="bold" style={{ flex: 2 }}>
                        Side
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        Timestamp
                    </Text>
                </Row>
                {!showAll && (
                    <Row className="text-m">
                        <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, usersMints[0].amount)}</Text>
                        <Text style={{ flex: 2 }}>{usersMints[0].side}</Text>
                        <Text style={{ flex: 1 }}>{formatShortDate(new Date(usersMints[0].timestamp))}</Text>
                    </Row>
                )}
                {showAll &&
                    usersMints?.map((mint, index) => (
                        <Row className="text-m" key={index}>
                            <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, mint.amount)}</Text>
                            <Text style={{ flex: 1 }}>{mint.side}</Text>
                            <Text style={{ flex: 1 }}>{formatShortDate(new Date(mint.timestamp))}</Text>
                        </Row>
                    ))}
                <Row>
                    <Text style={{ flex: 3 }}></Text>
                    <FlexDivColumnCentered
                        style={{
                            flexGrow: 1,
                            alignItems: 'center',
                            flex: 0,
                        }}
                    >
                        <Button
                            className="primary"
                            style={{ background: 'transparent', padding: '24px 35px' }}
                            onClick={() => setShowAll(!showAll)}
                        >
                            View all
                        </Button>
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

export default UsersMints;
