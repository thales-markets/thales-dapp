import { POSITIONS } from 'constants/options';
import React, { useState } from 'react';
import Trading from './components/Trading/Trading';

const TradePage: React.FC = () => {
    // selectors

    // states
    const [_currencyKey, _setCurrencyKey] = useState('ETH');
    const [_maturityDate, _setMaturityDate] = useState<Date | undefined>();
    const [_positionType, _setPositionType] = useState(POSITIONS.UP);

    // queries

    // hooks

    return (
        <>
            <Trading
                currencyKey={_currencyKey}
                maturityDate={new Date(new Date().setDate(new Date().getDate() + 10))}
                positionType={_positionType}
                strikePrice={20900}
                marketAddress="0x7eed10dfc2c636fd6e8100c38769813ed3771cbe"
                positionAddress="0xa6D3368305d696D54D0b27C4925C5b7e5150655B"
            />
        </>
    );
};

export default TradePage;
