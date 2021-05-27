import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import React from 'react';
import { Text } from 'theme/common';
import { OptionsMarkets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { navigateToOptionsMarket } from 'utils/routes';
import { MarketRow } from '../UserInfoModal';

type UsersMarketsProps = {
    usersMarkets: OptionsMarkets;
};

const UsersMarkets: React.FC<UsersMarketsProps> = ({ usersMarkets }) => {
    return (
        <>
            {usersMarkets?.map((market, index) => (
                <MarketRow
                    key={index}
                    onClick={() => {
                        if (market.phase !== 'expiry') {
                            navigateToOptionsMarket(market.address);
                        }
                    }}
                >
                    <Currency.Name
                        currencyKey={market.currencyKey}
                        showIcon={true}
                        iconProps={{ width: '32px', height: '32px', type: 'asset' }}
                    />
                    <Text style={{ margin: '0 8px' }}>{market.strikePrice.toFixed(2) + USD_SIGN}</Text>
                    <Text> by {formatShortDate(market.maturityDate)}</Text>
                    <Text>{market.poolSize.toFixed(2) + USD_SIGN}</Text>
                </MarketRow>
            ))}
        </>
    );
};

export default UsersMarkets;
