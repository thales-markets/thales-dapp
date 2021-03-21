import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { Side } from 'types/options';
import { useMarketContext } from '../../contexts/MarketContext';
import PlaceOrderSide from './PlaceOrderSide';

type PlaceOrderProps = {
    optionsSide: Side;
};

const PlaceOrder: React.FC<PlaceOrderProps> = ({ optionsSide }) => {
    const optionsMarket = useMarketContext();
    const baseToken = optionsSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;

    return (
        <>
            <Segment>
                <Header as="h2">{optionsSide === 'long' ? 'Place Long order' : 'Place Short order'}</Header>
                <Grid centered>
                    <Grid.Column width={8}>
                        <PlaceOrderSide baseToken={baseToken} side="buy" />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <PlaceOrderSide baseToken={baseToken} side="sell" />
                    </Grid.Column>
                </Grid>
            </Segment>
        </>
    );
};

export default PlaceOrder;
