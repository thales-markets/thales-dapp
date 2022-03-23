import React from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayOrder, OptionSide } from 'types/options';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';
import { DEFAULT_OPTIONS_DECIMALS } from 'constants/defaults';
import MaterialTooltip from '@material-ui/core/Tooltip';
import { ReactComponent as QuestionMarkIcon } from 'assets/images/question-mark-circle.svg';
import styled from 'styled-components';
import { FlexDiv, FlexDivRow } from 'theme/common';
import { withStyles } from '@material-ui/core';

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
                <SummaryDetailsContent>
                    {formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.price, DEFAULT_OPTIONS_DECIMALS)}
                </SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.amount-label', {
                        currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                    })}
                </SummaryDetailsLabel>
                <SummaryDetailsContent>
                    {formatCurrencyWithKey(
                        OPTIONS_CURRENCY_MAP[optionSide],
                        order.fillableAmount,
                        DEFAULT_OPTIONS_DECIMALS
                    )}
                </SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>{t('options.market.trade-options.order-details.total-label')}</SummaryDetailsLabel>
                <SummaryDetailsContent>
                    {formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.fillableTotal, DEFAULT_OPTIONS_DECIMALS)}
                </SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.return-label')}
                    <LightTooltip title={t('options.market.trade-options.order-details.return-col-tooltip')}>
                        <StyledQuestionMarkIcon />
                    </LightTooltip>
                </SummaryDetailsLabel>
                <SummaryDetailsContent>{formatPercentage(order.potentialReturn)}</SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.inital-amount-label', {
                        currencyKey: OPTIONS_CURRENCY_MAP[optionSide],
                    })}
                </SummaryDetailsLabel>
                <SummaryDetailsContent>
                    {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], order.amount, DEFAULT_OPTIONS_DECIMALS)}
                </SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.inital-total-label', {
                        currencyKey: SYNTHS_MAP.sUSD,
                    })}
                </SummaryDetailsLabel>
                <SummaryDetailsContent>
                    {formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.total, DEFAULT_OPTIONS_DECIMALS)}
                </SummaryDetailsContent>
            </SummaryDetailsItem>
            <SummaryDetailsItem>
                <SummaryDetailsLabel>
                    {t('options.market.trade-options.order-details.filled-label')}
                </SummaryDetailsLabel>
                <SummaryDetailsContent>{formatPercentage(order.filled)}</SummaryDetailsContent>
            </SummaryDetailsItem>
        </Container>
    );
};

const Container = styled.div`
    border-radius: 23px;
    margin-bottom: 20px;
    font-family: Roboto !important;
    color: var(--primary-color);
`;

const StyledQuestionMarkIcon = styled(QuestionMarkIcon)`
    min-width: 12px;
    min-height: 12px;
    margin-left: 4px;
    margin-bottom: -1px;
`;

const Title = styled(FlexDiv)`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: var(--primary-color);
    margin-bottom: 35px;
`;

const StyledLightTooltip = withStyles(() => ({
    arrow: {
        color: '#6A7FB6',
    },
    tooltip: {
        background: '#6A7FB6',
        borderRadius: '6px',
        padding: '4px 10px',
        fontSize: '10px',
        fontWeight: 600,
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: '#F6F6FE',
    },
}))(MaterialTooltip);

export const SummaryLabel = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.5px;
`;

export const SummaryContent = styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    text-align: end;
`;

export const SummaryItem = styled(FlexDivRow)`
    margin-bottom: 20px;
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

type TooltipIconProps = {
    disableHoverListener?: boolean;
    title: React.ReactNode;
    children: any;
};

const LightTooltip: React.FC<TooltipIconProps> = ({ title, children, disableHoverListener }) => (
    <StyledLightTooltip
        disableHoverListener={disableHoverListener}
        title={<span>{title}</span>}
        placement="top"
        arrow={true}
    >
        {children}
    </StyledLightTooltip>
);

export default OrderDetails;
