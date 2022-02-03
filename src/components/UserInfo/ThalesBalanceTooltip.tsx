import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivSpaceBetween } from '../../theme/common';
import { formatCurrencyWithKey } from '../../utils/formatters/number';
import { THALES_CURRENCY } from '../../constants/currency';
import { useTranslation } from 'react-i18next';

type Properties = {
    thalesBalance: number;
    thalesStaked: number;
    escrowedBalance: number;
};

const ThalesBalanceTooltip: React.FC<Properties> = ({ thalesStaked, thalesBalance, escrowedBalance }) => {
    const { t } = useTranslation();

    return (
        <>
            <FlexDivSpaceBetween>
                <BalanceTitle>{t('user-info.wallet.in-wallet')}:</BalanceTitle>
                <BalanceValue>{formatCurrencyWithKey(THALES_CURRENCY, thalesBalance)}</BalanceValue>
            </FlexDivSpaceBetween>
            <FlexDivSpaceBetween>
                <BalanceTitle>{t('user-info.wallet.total-staked')}:</BalanceTitle>
                <BalanceValue>{formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}</BalanceValue>
            </FlexDivSpaceBetween>
            <FlexDivSpaceBetween>
                <BalanceTitle>{t('user-info.wallet.total-escrowed')}:</BalanceTitle>
                <BalanceValue>{formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance)}</BalanceValue>
            </FlexDivSpaceBetween>
        </>
    );
};

const BalanceTitle = styled(FlexDivCentered)`
    font-size: 13px;
    line-height: 14px;
    letter-spacing: 0.4px;
    padding: 5px 10px 5px 0;
`;

const BalanceValue = styled(FlexDivCentered)`
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
`;

export default ThalesBalanceTooltip;
