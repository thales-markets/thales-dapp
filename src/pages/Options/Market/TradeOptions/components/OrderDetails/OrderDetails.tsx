import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'semantic-ui-react';
import { DisplayOrder } from 'types/options';
import { SYNTHS_MAP } from 'constants/currency';
import { formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';

type OrderDetailsProps = {
    order: DisplayOrder;
};

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
    const { t } = useTranslation();

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{t('options.market.trade-options.order-details.title')}</Card.Header>
                <Card.Description>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('options.market.trade-options.order-details.price-label')}</span>
                        <span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.price)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('options.market.trade-options.order-details.amount-label')}</span>
                        <span>{formatCurrencyWithKey('sOPT', order.amount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('options.market.trade-options.order-details.total-label')}</span>
                        <span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.total)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('options.market.trade-options.order-details.filled-label')}</span>
                        <span>{formatPercentage(order.filled)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('options.market.trade-options.order-details.remaining-amount-label')}</span>
                        <span>
                            <strong>{formatCurrencyWithKey('sOPT', order.fillableAmount)}</strong>
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('options.market.trade-options.order-details.remaining-amount-susd-label')}</span>
                        <span>
                            <strong>
                                {formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.fillableAmount * order.price)}
                            </strong>
                        </span>
                    </div>
                </Card.Description>
            </Card.Content>
        </Card>
    );
};

export default OrderDetails;
