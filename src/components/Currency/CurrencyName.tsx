import React, { CSSProperties } from 'react';
import CurrencyIcon from './CurrencyIcon';
import { CurrencyKey } from 'constants/currency';
import { getSynthName } from 'utils/snxJSConnector';

type CurrencyNameProps = {
    currencyKey: CurrencyKey;
    showIcon?: boolean;
    iconProps?: Record<string, unknown>;
    synthIconStyle?: CSSProperties;
};

export const CurrencyName: React.FC<CurrencyNameProps> = ({
    synthIconStyle,
    currencyKey,
    showIcon = false,
    iconProps = {},
}) => (
    <span style={{ display: 'flex', alignItems: 'center' }}>
        {showIcon && <CurrencyIcon currencyKey={currencyKey} synthIconStyle={synthIconStyle} {...iconProps} />}
        {getSynthName(currencyKey)}
    </span>
);

export default CurrencyName;
