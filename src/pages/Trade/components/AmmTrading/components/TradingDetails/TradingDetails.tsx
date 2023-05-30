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

type TradingDetailsProps = {
    positionType: Positions;
    positionPrice: number;
    positionBonus: number;
    positionAmount: number;
    paidAmount: number;
    selectedStable: string;
    profit: number;
};

const TradingDetails: React.FC<TradingDetailsProps> = ({
    positionType,
    positionPrice,
    positionBonus,
    positionAmount,
    paidAmount,
    selectedStable,
    profit,
}) => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    return (
        <Container>
            <DetailsRow>
                <TextLabel>{t('options.trade.amm-trading.details-modal.position-price')}</TextLabel>
                <TextValue>{positionPrice ? formatCurrencyWithSign(USD_SIGN, positionPrice) : EMPTY_VALUE}</TextValue>
            </DetailsRow>
            <DetailsRow>
                <TextLabel>{t('options.trade.amm-trading.details-modal.position-bonus')}</TextLabel>
                <TextValue isProfit={true}>
                    {positionBonus > 0 ? getFormattedBonus(positionBonus) : EMPTY_VALUE}
                </TextValue>
            </DetailsRow>
            <DetailsRow>
                <TextLabel>{t('options.trade.amm-trading.details-modal.amount')}</TextLabel>
                <TextValue>
                    {positionAmount ? formatCurrencyWithKey(positionType, positionAmount) : EMPTY_VALUE}
                </TextValue>
            </DetailsRow>
            <DetailsRow>
                <TextLabel>{t('options.trade.amm-trading.details-modal.total-pay')}</TextLabel>
                <TextValue>{paidAmount ? formatCurrencyWithKey(selectedStable, paidAmount) : EMPTY_VALUE}</TextValue>
            </DetailsRow>
            <DetailsRow>
                <TextLabel>{t('options.trade.amm-trading.details-modal.potential-profit')}</TextLabel>
                <TextValue isProfit={true}>
                    {profit && positionAmount
                        ? `${formatCurrencyWithKey(getStableCoinForNetwork(networkId), profit)} (${formatPercentage(
                              calculateAndFormatPercentage(paidAmount, positionAmount)
                          )})`
                        : EMPTY_VALUE}
                </TextValue>
            </DetailsRow>
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
