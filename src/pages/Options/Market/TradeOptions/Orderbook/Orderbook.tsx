import React, { useMemo } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import OrderbookSide from './OrderbookSide';
import { OptionSide } from 'types/options';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import { useMarketContext } from '../../contexts/MarketContext';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { useTranslation } from 'react-i18next';

type OrderbookProps = {
    optionSide: OptionSide;
};

const Orderbook: React.FC<OrderbookProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const optionsTokenAddress = optionSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;

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
            <Segment color={optionSide === 'long' ? 'green' : 'red'}>
                <Header as="h2">{t(`options.market.trade-options.orderbook.${optionSide}.title`)}</Header>
                <Grid centered>
                    <Grid.Column width={8}>
                        <OrderbookSide orders={buyOrders} orderSide="buy" />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <OrderbookSide orders={sellOrders} orderSide="sell" />
                    </Grid.Column>
                </Grid>
            </Segment>
        </>
    );
};

export default Orderbook;
