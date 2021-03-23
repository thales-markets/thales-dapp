import React from 'react';
import Orderbook from './Orderbook';
import PlaceOrder from './PlaceOrder';

const TradeOptions: React.FC = () => {
    return (
        <>
            <Orderbook optionSide="long" />
            <PlaceOrder optionSide="long" />
            <Orderbook optionSide="short" />
            <PlaceOrder optionSide="short" />
        </>
    );
};

export default TradeOptions;
