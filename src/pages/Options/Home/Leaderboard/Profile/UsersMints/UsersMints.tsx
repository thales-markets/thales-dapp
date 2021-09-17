import { MarketRow, Row } from 'components/UserInfo/UserInfoModal/UserInfoModal';
import { USD_SIGN } from 'constants/currency';
import { FlexDivColumn, Text } from 'theme/common';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import React from 'react';
import Currency from 'components/Currency';
type UsersMintsProps = {
    usersMints: any[];
    market: any;
};

const UsersMints: React.FC<UsersMintsProps> = ({ usersMints, market }) => {
    console.log(usersMints);
    return (
        <FlexDivColumn>
            <Row>
                <Text className="bold" style={{ flex: 2 }}>
                    Asset
                </Text>
                <Text className="bold" style={{ flex: 1 }}>
                    Strike Price
                </Text>
                <Text className="bold" style={{ flex: 1 }}>
                    Maturity Date
                </Text>
                <Text className="bold" style={{ flex: 1 }}>
                    Pool Size
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
                <div style={{ flex: 2 }}>
                    <Currency.Name
                        currencyKey={market.currencyKey}
                        showIcon={true}
                        synthIconStyle={{ width: 24, height: 24 }}
                        iconProps={{ type: 'asset' }}
                    />
                </div>
                <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                <Text style={{ flex: 1 }}> {formatShortDate(market.maturityDate)}</Text>
                <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
            </MarketRow>
            <FlexDivColumn>
                <Row>
                    <Text className="bold" style={{ flex: 2 }}>
                        Amount
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        Side
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        Timestamp
                    </Text>
                </Row>
                {usersMints?.map((mint, index) => (
                    <Row className="text-xs" key={index}>
                        <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, mint.amount)}</Text>
                        <Text style={{ flex: 1 }}>{mint.side}</Text>
                        <Text style={{ flex: 1 }}>{formatShortDate(new Date(mint.timestamp))}</Text>
                    </Row>
                ))}
            </FlexDivColumn>
        </FlexDivColumn>
    );
};

export default UsersMints;
