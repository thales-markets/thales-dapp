import { MarketRow, Row } from 'components/UserInfo/UserInfoModal/UserInfoModal';
import { USD_SIGN } from 'constants/currency';
import { FlexDivColumn, Text } from 'theme/common';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import React from 'react';
import Currency from 'components/Currency';

type UsersUnclaimedProps = {
    usersUnclaimed: any[];
    market: any;
};

const UsersUnclaimed: React.FC<UsersUnclaimedProps> = ({ usersUnclaimed, market }) => {
    console.log(usersUnclaimed);
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
                <Text style={{ flex: 1 }}>{market.result}</Text>
            </MarketRow>
            <FlexDivColumn>
                <Row>
                    <Text className="bold" style={{ flex: 2 }}>
                        Long
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        Short
                    </Text>
                </Row>
                {usersUnclaimed?.map((unclaimed, index) => (
                    <Row className="text-xs" key={index}>
                        <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, unclaimed.long)}</Text>
                        <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, unclaimed.short)}</Text>
                    </Row>
                ))}
            </FlexDivColumn>
        </FlexDivColumn>
    );
};

export default UsersUnclaimed;
