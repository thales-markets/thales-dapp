import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import React from 'react';
import { LightTooltip, Text } from 'theme/common';
import { OptionsMarkets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { navigateToOptionsMarket } from 'utils/routes';
import { MarketRow } from '../UserInfoModal';

type UsersMarketsProps = {
    usersMarkets: OptionsMarkets;
    onClose: () => void;
};

const UsersMarkets: React.FC<UsersMarketsProps> = ({ usersMarkets, onClose }) => {
    return (
        <>
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

                    <LightTooltip title="Strike price">
                        <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    </LightTooltip>
                    <LightTooltip title="Maturity date">
                        <Text style={{ flex: 1 }}> {formatShortDate(market.maturityDate)}</Text>
                    </LightTooltip>
                    <LightTooltip title="Pool size">
                        <Text style={{ flex: 1 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                    </LightTooltip>
                </MarketRow>
            ))}
        </>
    );
};

export default UsersMarkets;
