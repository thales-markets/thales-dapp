import React, { CSSProperties } from 'react';
import { getAssetIcon } from 'utils/currency';
import { CurrencyKey } from 'constants/currency';

type CurrencyIconProps = {
    currencyKey: CurrencyKey;
    synthIconStyle?: CSSProperties;
    type?: 'synth' | 'asset';
};

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({ currencyKey, synthIconStyle, ...rest }) => {
    const props = {
        width: '24px',
        height: '24px',
        alt: currencyKey,
        ...rest,
    };
    const AssetIcon = getAssetIcon(currencyKey);

    if (!AssetIcon) {
        return null;
    }

    return <AssetIcon style={{ marginRight: 10, width: props.width, height: props.height, ...synthIconStyle }} />;
};

export default CurrencyIcon;
