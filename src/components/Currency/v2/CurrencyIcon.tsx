import React, { CSSProperties } from 'react';
import { getAssetIcon } from 'utils/currency';
import { CurrencyKey } from 'constants/currency';
import styled from 'styled-components';
import { UI_COLORS } from 'constants/ui';

const NEW_CURRENCY_ICONS = ['LYRA', 'LUNA', 'MATIC', 'PERP', 'OHM', 'CVX', 'APE'];

type CurrencyIconProps = {
    currencyKey: CurrencyKey;
    synthIconStyle?: CSSProperties;
    type?: 'synth' | 'asset';
    width?: string;
    height?: string;
    iconType?: IconType;
};

enum IconType {
    NORMAL,
    IN,
    OUT,
    Range,
}

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({
    currencyKey,
    width,
    height,
    synthIconStyle,
    iconType = IconType.NORMAL,

    ...rest
}) => {
    const props = {
        width: width ? width : '24px',
        height: height ? height : '24px',
        alt: currencyKey,
        ...rest,
    };

    const badgeHeight = Number(props.height?.slice(0, props.height.indexOf('px'))) / 2;

    const AssetIcon = getAssetIcon(currencyKey);

    if (NEW_CURRENCY_ICONS.includes(currencyKey)) {
        synthIconStyle = {
            ...synthIconStyle,
            padding: '3px',
        };
    }

    if (!AssetIcon) {
        return null;
    }

    return (
        <Content>
            {iconType === IconType.IN && (
                <Badge height={badgeHeight} type={iconType} className="v2-icon v2-icon--in"></Badge>
            )}
            {iconType === IconType.OUT && (
                <Badge height={badgeHeight} type={iconType} className="v2-icon v2-icon--out"></Badge>
            )}
            {iconType === IconType.Range && (
                <Badge height={badgeHeight} type={iconType} className="v2-icon v2-icon--range"></Badge>
            )}
            <AssetIcon style={{ marginRight: 7, width: props.width, height: props.height, ...synthIconStyle }} />
        </Content>
    );
};

const Content = styled.div`
    position: relative;
`;

const Badge = styled.i<{ type: IconType; height: number }>`
    position: absolute;
    top: -2px;
    left: 0px;
    font-size: ${(props) => props.height + 'px'};
    width: ${(props) => props.height + 'px'};
    border-radius: 20px;
    color: ${(props) => (props.type === IconType.IN ? UI_COLORS.IN_COLOR : UI_COLORS.OUT_COLOR)};
    background: var(--background);
`;

export default CurrencyIcon;
