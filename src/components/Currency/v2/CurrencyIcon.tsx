import React, { CSSProperties } from 'react';
import { getAssetIcon } from 'utils/currency';
import { CurrencyKey } from 'constants/currency';

type CurrencyIconProps = {
    currencyKey: CurrencyKey;
    synthIconStyle?: CSSProperties;
    type?: 'synth' | 'asset';
    width?: string;
    height?: string;
};

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({ currencyKey, width, height, synthIconStyle, ...rest }) => {
    const props = {
        width: width ? width : '24px',
        height: height ? height : '24px',
        alt: currencyKey,
        ...rest,
    };
    const AssetIcon = getAssetIcon(currencyKey);

    if (currencyKey == 'LYRA' || currencyKey == 'LUNA' || currencyKey == 'MATIC' || currencyKey == 'PERP') {
        synthIconStyle = {
            ...synthIconStyle,
            padding: '3px',
        };
    }

    if (!AssetIcon) {
        return null;
    }

    return <AssetIcon style={{ marginRight: 7, width: props.width, height: props.height, ...synthIconStyle }} />;
};

export default CurrencyIcon;
