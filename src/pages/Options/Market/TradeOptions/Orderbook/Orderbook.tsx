import React, { useMemo } from 'react';
import { Header, Table } from 'semantic-ui-react';
import OrderbookSide from './OrderbookSide';
import { OptionSide } from 'types/options';
import useBinaryOptionsMarketOrderbook from 'queries/options/useBinaryOptionsMarketOrderbook';
import { useMarketContext } from '../../contexts/MarketContext';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { formatShortDate } from 'utils/formatters/date';

type OrderbookProps = {
    optionSide: OptionSide;
};

const Orderbook: React.FC<OrderbookProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const optionsTokenAddress = optionSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;
    const orderbookSign = optionSide === 'long' ? '>' : '<';

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

    const marketHeading = optionsMarket
        ? `${optionsMarket.asset} ${orderbookSign} ${formatCurrencyWithSign(
              USD_SIGN,
              optionsMarket.strikePrice
          )} @ ${formatShortDate(optionsMarket.maturityDate)}`
        : null;

    return (
        <>
            <Header as="h3">
                {t(`options.market.trade-options.orderbook.title`)} {marketHeading}
            </Header>
            <Table compact selectable fixed striped size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textAlign="right">
                            {t('options.market.trade-options.orderbook.table.price-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="right">
                            {t('options.market.trade-options.orderbook.table.amount-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="right">
                            {t('options.market.trade-options.orderbook.table.total-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="right" width={3}>
                            {t('options.market.trade-options.orderbook.table.filled-col')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {t('options.market.trade-options.orderbook.table.time-remaining-col')}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            </Table>
            <OrderbookSide orders={buyOrders} orderSide="buy" optionSide={optionSide} />
            <OrderbookSide orders={sellOrders} orderSide="sell" optionSide={optionSide} />
        </>
    );
};

export default Orderbook;
