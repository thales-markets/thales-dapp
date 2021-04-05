import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { OptionSide } from 'types/options';
import MyOrders from './MyOrders';
import Orderbook from './Orderbook';
import PlaceOrder from './PlaceOrder';

type TradeOptionsSideProps = {
    optionSide: OptionSide;
};

const TradeOptionsSide: React.FC<TradeOptionsSideProps> = ({ optionSide }) => {
    return (
        <Segment color={optionSide === 'long' ? 'green' : 'red'}>
            <Grid centered>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Orderbook optionSide={optionSide} />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <PlaceOrder optionSide={optionSide} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <MyOrders optionSide={optionSide} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default TradeOptionsSide;
