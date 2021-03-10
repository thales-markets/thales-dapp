import React from 'react';
import { CurrencyKey } from 'constants/currency';
import { formatCurrencyPair } from 'utils/formatters';
import CurrencyIcon from './CurrencyIcon';

type CurrencyPairProps = {
    baseCurrencyKey: CurrencyKey;
    baseCurrencyAsset?: string;
    quoteCurrencyKey: CurrencyKey;
    showIcon?: boolean;
    iconProps?: any;
};

export const CurrencyPair: React.FC<CurrencyPairProps> = ({
    baseCurrencyKey,
    baseCurrencyAsset,
    quoteCurrencyKey,
    showIcon = true,
    iconProps = {},
}) => (
    <span>
        {showIcon && <CurrencyIcon currencyKey={baseCurrencyKey} {...iconProps} />}
        {formatCurrencyPair(baseCurrencyAsset || baseCurrencyKey, quoteCurrencyKey)}
    </span>
);

export default CurrencyPair;
