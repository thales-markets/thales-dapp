import React, { CSSProperties } from 'react';
import { getAssetIcon, getSynthIcon } from 'utils/currency';
import { CRYPTO_CURRENCY_MAP, CurrencyKey } from 'constants/currency';

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

    if (currencyKey !== CRYPTO_CURRENCY_MAP.SNX && currencyKey !== CRYPTO_CURRENCY_MAP.KNC) {
        const SynthIcon = getSynthIcon(currencyKey);
        if (SynthIcon) return <SynthIcon style={{ width: 24, height: 24, marginRight: 10, ...synthIconStyle }} />;
    }

    const AssetIcon = getAssetIcon(currencyKey);

    if (!AssetIcon) {
        return null;
    }

    return <AssetIcon style={{ marginRight: 10 }} {...props} />;
};

export default CurrencyIcon;
