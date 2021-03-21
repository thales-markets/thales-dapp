import React, { useMemo } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import OrderbookSide from './OrderbookSide';
import { Side } from 'types/options';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import { useMarketContext } from '../../contexts/MarketContext';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';

type OrderbookProps = {
    optionsSide: Side;
};

const Orderbook: React.FC<OrderbookProps> = ({ optionsSide }) => {
    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const optionsTokenAddress = optionsSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;

    const orderbookQuery = useBinaryOptionsMarketOrderbook(networkId, optionsTokenAddress, {
        enabled: isAppReady,
    });

    const buyOrders = useMemo(
        () => (orderbookQuery.isSuccess && orderbookQuery.data ? orderbookQuery.data.buyOrders : []),
        [orderbookQuery.data]
    );

    const sellOrders = useMemo(
        () => (orderbookQuery.isSuccess && orderbookQuery.data ? orderbookQuery.data.sellOrders : []),
        [orderbookQuery.data]
    );

    return (
        <>
            <Segment>
                <Header as="h2">{optionsSide === 'long' ? 'Trade Long options' : 'Trade Short options'}</Header>
                <Grid centered>
                    <Grid.Column width={8}>
                        <OrderbookSide orders={buyOrders} side="buy" />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <OrderbookSide orders={sellOrders} side="sell" />
                    </Grid.Column>
                </Grid>
            </Segment>
        </>
    );
};

export default Orderbook;
