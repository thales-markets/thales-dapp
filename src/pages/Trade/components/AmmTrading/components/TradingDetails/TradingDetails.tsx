import { USD_SIGN } from 'constants/currency';
import { Positions } from 'constants/options';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'theme/common';
import { getStableCoinForNetwork } from 'utils/currency';
import {
    calculateAndFormatPercentage,
    formatCurrencyWithKey,
    formatCurrencyWithSign,
    formatPercentage,
} from 'utils/formatters/number';
import { getFormattedBonus } from 'utils/options';
import { EMPTY_VALUE } from 'constants/placeholder';
import { DetailsRow, TextLabel, TextValue } from '../../styled-components';
import InlineLoader from 'components/InlineLoader/InlineLoader';

type TradingDetailsProps = {
    positionType: Positions;
    positionPrice: number;
    positionBonus: number;
    positionAmount: number;
    paidAmount: number;
    selectedStable: string;
    profit: number;
    isBuy: boolean;
    isLoading?: boolean;
};

const TradingDetails: React.FC<TradingDetailsProps> = ({
    positionType,
    positionPrice,
    positionBonus,
    positionAmount,
    paidAmount,
    selectedStable,
    profit,
    isBuy,
    isLoading,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const getTextValue = (value: string, isValidValue: boolean, isLoading?: boolean, isProfit?: boolean) => (
        <TextValue isProfit={isProfit}>
            {isLoading ? <InlineLoader size={12} thickness={6} /> : isValidValue ? value : EMPTY_VALUE}
        </TextValue>
    );

    return (
        <Container>
            <DetailsRow>
                <TextLabel>{t('options.trade.amm-trading.details-modal.position-price')}</TextLabel>
                {getTextValue(formatCurrencyWithSign(USD_SIGN, positionPrice), positionPrice > 0, isLoading)}
            </DetailsRow>
            {isBuy && (
                <DetailsRow>
                    <TextLabel>{t('options.trade.amm-trading.details-modal.position-bonus')}</TextLabel>
                    {getTextValue(getFormattedBonus(positionBonus), positionBonus > 0, isLoading, true)}
                </DetailsRow>
            )}
            <DetailsRow>
                <TextLabel>
                    {t(`options.trade.amm-trading.details-modal.${isBuy ? 'amount-buy' : 'total-receive'}`)}
                </TextLabel>
                {getTextValue(formatCurrencyWithKey(positionType, positionAmount), positionAmount > 0, isLoading)}
            </DetailsRow>
            <DetailsRow>
                <TextLabel>
                    {t(`options.trade.amm-trading.details-modal.${isBuy ? 'total-pay' : 'amount-sell'}`)}
                </TextLabel>
                {getTextValue(formatCurrencyWithKey(selectedStable, paidAmount), paidAmount > 0, isLoading)}
            </DetailsRow>
            {isBuy && (
                <DetailsRow>
                    <TextLabel>{t('options.trade.amm-trading.details-modal.potential-profit')}</TextLabel>
                    {getTextValue(
                        `${formatCurrencyWithKey(getStableCoinForNetwork(networkId), profit)} (${formatPercentage(
                            calculateAndFormatPercentage(paidAmount, positionAmount)
                        )})`,
                        profit > 0 && positionAmount > 0,
                        isLoading,
                        true
                    )}
                </DetailsRow>
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 15px;
`;

export default TradingDetails;
