import React from 'react';
import CurrencyIcon from './CurrencyIcon';
import { CurrencyKey } from 'constants/currency';

type CurrencyNameProps = {
    currencyKey: CurrencyKey;
    name?: string;
    showIcon?: boolean;
    iconProps?: Record<string, unknown>;
};

export const CurrencyName: React.FC<CurrencyNameProps> = ({ currencyKey, name, showIcon = false, iconProps = {} }) => (
    <span style={{ display: 'flex', alignItems: 'center' }}>
        {showIcon && <CurrencyIcon currencyKey={currencyKey} {...iconProps} />}
        {name || currencyKey}
    </span>
);

export default CurrencyName;
