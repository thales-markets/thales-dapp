import React from 'react';
import { getAssetIcon, getSynthIcon } from 'utils/currency';
import { CurrencyKey } from 'constants/currency';

type CurrencyIconProps = {
    currencyKey: CurrencyKey;
    type?: 'synth' | 'asset';
};

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({ currencyKey, type = 'synth', ...rest }) => {
    const props = {
        width: '24px',
        height: '24px',
        alt: currencyKey,
        ...rest,
    };

    if (type === 'synth') {
        return <img src={getSynthIcon(currencyKey)} style={{ marginRight: 10 }} {...props} />;
    }

    const AssetIcon = getAssetIcon(currencyKey);

    if (!AssetIcon) {
        return null;
    }

    return <AssetIcon style={{ marginRight: 10 }} {...props} />;
};

export default CurrencyIcon;
