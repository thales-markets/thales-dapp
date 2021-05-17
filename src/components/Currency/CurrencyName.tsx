import React from 'react';
import CurrencyIcon from './CurrencyIcon';
import { CurrencyKey } from 'constants/currency';
import { getSynthName } from 'utils/snxJSConnector';

type CurrencyNameProps = {
    currencyKey: CurrencyKey;
    showIcon?: boolean;
    iconProps?: Record<string, unknown>;
};

export const CurrencyName: React.FC<CurrencyNameProps> = ({ currencyKey, showIcon = false, iconProps = {} }) => (
    <span style={{ display: 'flex', alignItems: 'center' }}>
        {showIcon && <CurrencyIcon currencyKey={currencyKey} {...iconProps} />}
        {getSynthName(currencyKey)}
    </span>
);

export default CurrencyName;
