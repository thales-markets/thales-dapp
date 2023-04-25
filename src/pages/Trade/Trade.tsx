import { POSITIONS } from 'constants/options';
import React, { useState } from 'react';

const TradePage: React.FC = () => {
    // selectors

    // states
    const [_currencyKey, _setCurrencyKey] = useState('ETH');
    const [_maturityDate, _setMaturityDate] = useState<Date | undefined>();
    const [_positionType, _setPositionType] = useState(POSITIONS.UP);

    // queries

    // hooks

    return <></>;
};

export default TradePage;
