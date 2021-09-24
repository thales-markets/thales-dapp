import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { MarketRow, Row } from 'components/UserInfo/UserInfoModal/UserInfoModal';
import { USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import React from 'react';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumnCentered, Text } from 'theme/common';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getSynthName } from 'utils/snxJSConnector';

type UsersTradesProps = {
    usersTrades: any[];
    market: any;
};

const UsersTrades: React.FC<UsersTradesProps> = ({ usersTrades, market }) => {
    console.log(market.asset);
    return (
        // <FlexDivColumn>
        <FlexDiv style={{ flex: 1, border: '1px solid white' }}>
            <FlexDivColumnCentered style={{ flexGrow: 1 }}>
                <CurrencyIcon currencyKey={market.currencyKey} synthIconStyle={{ width: 100, height: 100 }} />
                <CryptoName>{getSynthName(market.currencyKey)}</CryptoName>
                <CryptoKey>{market.asset}</CryptoKey>
            </FlexDivColumnCentered>
            <FlexDivColumnCentered style={{ flexGrow: 8 }}>
                <Row>
                    <Text className="bold" style={{ flex: 1 }}>
                        Strike Price
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        Pool Size
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        Maturity Date
                    </Text>
                </Row>
                <MarketRow
                    className="text-xs"
                    // onClick={() => {
                    //     if (market.phase !== 'expiry') {
                    //         navigateToOptionsMarket(market.address);
                    //         onClose();
                    //     }
                    // }}
                >
                    <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                    <Text style={{ flex: 1 }}> {formatShortDate(market.maturityDate)}</Text>
                </MarketRow>
                <Row style={{ backgroundColor: '#748bc6' }}>
                    <Text className="bold" style={{ flex: 1 }}>
                        Maker amount
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        Taker amount
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        Timestamp
                    </Text>
                </Row>
                {usersTrades?.map((trade, index) => (
                    <Row className="text-xs" key={index}>
                        <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, trade.makerAmount)}</Text>
                        <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, trade.takerAmount)}</Text>
                        <Text style={{ flex: 1 }}>{formatShortDate(new Date(trade.timestamp))}</Text>
                    </Row>
                ))}
            </FlexDivColumnCentered>
        </FlexDiv>
        // </FlexDivColumn>
    );
};

export const CryptoKey = styled.p`
    font-family: Inter !important;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: #808191;
`;

export default UsersTrades;
