import React, { CSSProperties } from 'react';
import CurrencyIcon from './CurrencyIcon';
import { getSynthName } from 'utils/currency';

type CurrencyNameProps = {
    currencyKey: string;
    showIcon?: boolean;
    iconProps?: Record<string, unknown>;
    synthIconStyle?: CSSProperties;
    spanStyle?: CSSProperties;
};

const CurrencyName: React.FC<CurrencyNameProps> = ({
    synthIconStyle,
    currencyKey,
    showIcon = false,
    iconProps = {},
    spanStyle,
}) => (
    <span style={{ display: 'flex', alignItems: 'center', ...spanStyle }}>
        {showIcon && <CurrencyIcon currencyKey={currencyKey} synthIconStyle={synthIconStyle} {...iconProps} />}
        {getSynthName(currencyKey)}
    </span>
);

export default CurrencyName;
