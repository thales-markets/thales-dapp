import React from 'react';
import Orderbook from './Orderbook';
import PlaceOrder from './PlaceOrder';

const TradeOptions: React.FC = () => {
    return (
        <>
            <Orderbook optionsSide="long" />
            <PlaceOrder optionsSide="long" />
            <Orderbook optionsSide="short" />
            <PlaceOrder optionsSide="short" />
        </>
    );
};

export default TradeOptions;
