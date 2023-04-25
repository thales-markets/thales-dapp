import { POSITIONS } from 'constants/options';
import React, { useState } from 'react';

const TradePage: React.FC = () => {
    // selectors

    // states
    const [currencyKey, setCurrencyKey] = useState('ETH');
    const [maturityDate, setMaturityDate] = useState<Date | undefined>();
    const [positionType, setPositionType] = useState(POSITIONS.UP);

    // queries

    // hooks

    return <></>;
};

export default TradePage;
