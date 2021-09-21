import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import React from 'react';
import { Text } from 'theme/common';
import { OptionsMarkets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { navigateToOptionsMarket } from 'utils/routes';
import { MarketRow, Row } from '../UserInfoModal';
import { useTranslation } from 'react-i18next';

type UsersMarketsProps = {
    usersMarkets: OptionsMarkets;
    onClose: () => void;
};

const UsersMarkets: React.FC<UsersMarketsProps> = ({ usersMarkets, onClose }) => {
    const { t } = useTranslation();
    return (
        <>
            <Row>
                <Text className="bold" style={{ flex: 2 }}>
                    {t(`user-info.table.asset-col`)}
                </Text>
                <Text className="bold" style={{ flex: 1 }}>
                    {t(`user-info.table.strike-price-col`)}
                </Text>
                <Text className="bold" style={{ flex: 1 }}>
                    {t(`user-info.table.maturity-date-col`)}
                </Text>
                <Text className="bold" style={{ flex: 1 }}>
                    {t(`user-info.table.pool-size-col`)}
                </Text>
            </Row>
            {usersMarkets?.map((market, index) => (
                <MarketRow
                    className="text-xs"
                    key={index}
                    onClick={() => {
                        if (market.phase !== 'expiry') {
                            navigateToOptionsMarket(market.address);
                            onClose();
                        }
                    }}
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
            ))}
        </>
    );
};

export default UsersMarkets;
