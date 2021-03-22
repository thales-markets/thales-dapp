import React from 'react';
import { EMPTY_VALUE } from 'constants/placeholder';
import { formatCurrencyWithSign } from 'utils/formatters/number';

type CurrencyColProps = {
    sign?: string;
    value: number | null;
    decimals?: number;
};

export const CurrencyCol: React.FC<CurrencyColProps> = ({ sign = '', value, decimals }) => (
    <span>{value == null ? EMPTY_VALUE : formatCurrencyWithSign(sign, value, decimals)}</span>
);
