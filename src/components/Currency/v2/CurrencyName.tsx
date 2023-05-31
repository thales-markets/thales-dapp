import React, { CSSProperties } from 'react';
import CurrencyIcon, { IconType } from './CurrencyIcon';
import { getSynthName } from 'utils/currency';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';

type CurrencyNameProps = {
    currencyKey: string;
    showIcon?: boolean;
    hideAssetName?: boolean;
    rangeMarket?: boolean;
    iconProps?: Record<string, unknown>;
    synthIconStyle?: CSSProperties;
    spanStyle?: CSSProperties;
    additionalIconType?: IconType;
};

const CurrencyName: React.FC<CurrencyNameProps> = ({
    synthIconStyle,
    currencyKey,
    showIcon = false,
    hideAssetName,
    rangeMarket,
    iconProps = {},
    spanStyle,
    additionalIconType,
}) => {
    const theme: ThemeInterface = useTheme();

    return (
        <span
            style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '15px',
                textAlign: 'left',
                fontFamily: theme.fontFamily.primary,
                ...spanStyle,
            }}
        >
            {showIcon && !rangeMarket && (
                <CurrencyIcon
                    currencyKey={currencyKey}
                    synthIconStyle={synthIconStyle}
                    {...iconProps}
                    iconType={additionalIconType ? additionalIconType : undefined}
                />
            )}
            {showIcon && rangeMarket && (
                <CurrencyIcon
                    height={'32px'}
                    iconType={3}
                    currencyKey={currencyKey}
                    synthIconStyle={synthIconStyle}
                    {...iconProps}
                />
            )}
            {!hideAssetName && (
                <span style={{ fontWeight: 300, textTransform: 'uppercase' }}>{getSynthName(currencyKey)}</span>
            )}
            <span style={{ fontWeight: 900, marginLeft: '3px' }}>{currencyKey}</span>
        </span>
    );
};

export default CurrencyName;
