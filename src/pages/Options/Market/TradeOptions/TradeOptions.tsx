import React from 'react';
import MyOrders from './MyOrders';
import Orderbook from './Orderbook';
import PlaceOrder from './PlaceOrder';

const TradeOptions: React.FC = () => {
    return (
        <>
            <Orderbook optionSide="long" />
            <PlaceOrder optionSide="long" />
            <MyOrders optionSide="long" />
            <Orderbook optionSide="short" />
            <PlaceOrder optionSide="short" />
            <MyOrders optionSide="short" />
        </>
    );
};

export default TradeOptions;
