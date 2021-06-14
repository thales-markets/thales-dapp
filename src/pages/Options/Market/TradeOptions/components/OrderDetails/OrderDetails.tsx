import React from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayOrder, OptionSide } from 'types/options';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';
import { SummaryItem, SummaryLabel, SummaryContent } from 'pages/Options/Market/components';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';

type OrderDetailsProps = {
    order: DisplayOrder;
    optionSide: OptionSide;
};

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, optionSide }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <Title>{t('options.market.trade-options.order-details.title')}</Title>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.price-label', {
                        currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                    })}
                </SummaryDetailsLabel>
                <SummaryDetailsContent>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.price)}</SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.amount-label', {
                        currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                    })}
                </SummaryDetailsLabel>
                <SummaryDetailsContent>
                    {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], order.amount)}
                </SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>{t('options.market.trade-options.order-details.total-label')}</SummaryDetailsLabel>
                <SummaryDetailsContent>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.total)}</SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.filled-label')}
                </SummaryDetailsLabel>
                <SummaryDetailsContent>{formatPercentage(order.filled)}</SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.remaining-amount-label', {
                        currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                    })}
                </SummaryDetailsLabel>
                <SummaryDetailsContent>
                    {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], order.fillableAmount)}
                </SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.remaining-amount-label', {
                        currencyKey: SYNTHS_MAP.sUSD,
                    })}
                </SummaryDetailsLabel>
                <SummaryDetailsContent>
                    {formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.fillableAmount * order.price)}
                </SummaryDetailsContent>
            </SummaryDetailsItem>
        </Container>
    );
};

const Container = styled.div`
    background: linear-gradient(148.33deg, rgba(255, 255, 255, 0.03) -2.8%, rgba(255, 255, 255, 0.01) 106.83%);
    box-shadow: 0px 25px 30px rgba(0, 0, 0, 0.05);
    border-radius: 23px;
    padding: 25px 25px 5px 25px;
    margin-bottom: 20px;
`;

const Title = styled(FlexDiv)`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #f6f6fe;
    margin-bottom: 35px;
`;

const SummaryDetailsItem = styled(SummaryItem)`
    margin-bottom: 15px;
`;

const SummaryDetailsLabel = styled(SummaryLabel)`
    font-weight: normal;
    line-height: 24px;
`;

const SummaryDetailsContent = styled(SummaryContent)`
    font-weight: normal;
    line-height: 24px;
`;

export default OrderDetails;
