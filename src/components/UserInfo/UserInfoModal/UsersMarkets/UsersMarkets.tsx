import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import React from 'react';
import { LightTooltip, Text } from 'theme/common';
import { OptionsMarkets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
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
                    <Currency.Name
                        currencyKey={market.currencyKey}
                        showIcon={true}
                        iconProps={{ width: '32px', height: '32px', type: 'asset' }}
                    />
                    <LightTooltip title="Strike price">
                        <Text style={{ margin: '0 8px' }}>{USD_SIGN + market.strikePrice.toFixed(2)}</Text>
                    </LightTooltip>
                    <LightTooltip title="Maturity date">
                        <Text> {formatShortDate(market.maturityDate)}</Text>
                    </LightTooltip>
                    <LightTooltip title="Pool size">
                        <Text>{USD_SIGN + market.poolSize.toFixed(2)}</Text>
                    </LightTooltip>
                </MarketRow>
            ))}
        </>
    );
};

export default UsersMarkets;
