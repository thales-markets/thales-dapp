import React, { CSSProperties } from 'react';
import { getAssetIcon } from 'utils/currency';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';

const NEW_CURRENCY_ICONS = [
    'LYRA',
    'LUNA',
    'MATIC',
    'PERP',
    'OHM',
    'CVX',
    'APE',
    'OP',
    'DYDX',
    'ETC',
    'LOOKS',
    'MAGIC',
    'DPX',
    'GMX',
    'CAKE',
    'XAU',
    'XAG',
];

type CurrencyIconProps = {
    currencyKey: string;
    synthIconStyle?: CSSProperties;
    type?: 'synth' | 'asset';
    width?: string;
    height?: string;
    iconType?: IconType;
};

export enum IconType {
    NORMAL,
    IN,
    OUT,
    Range,
    UP,
    DOWN,
}

const CurrencyIcon: React.FC<CurrencyIconProps> = ({
    currencyKey,
    width,
    height,
    synthIconStyle,
    iconType = IconType.NORMAL,

    ...rest
}) => {
    const theme: ThemeInterface = useTheme();

    const props = {
        width: width ? width : '24px',
        height: height ? height : '24px',
        alt: currencyKey,
        ...rest,
    };

    const badgeHeight = Number(props.height?.slice(0, props.height.indexOf('px'))) / 2;

    const AssetIcon = getAssetIcon(currencyKey);

    let badgeColor = theme.positionColor.out;

    switch (iconType) {
        case IconType.IN:
            badgeColor = theme.positionColor.in;
            break;
        case IconType.OUT:
            badgeColor = theme.positionColor.out;
            break;
        case IconType.Range:
            badgeColor = theme.positionColor.out;
            break;
        case IconType.UP:
            badgeColor = theme.positionColor.up;
            break;
        case IconType.DOWN:
            badgeColor = theme.positionColor.down;
            break;
    }

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
                <Badge height={badgeHeight} color={badgeColor} className="v2-icon v2-icon--in"></Badge>
            )}
            {iconType === IconType.OUT && (
                <Badge height={badgeHeight} color={badgeColor} className="v2-icon v2-icon--out"></Badge>
            )}
            {iconType === IconType.Range && (
                <Badge height={badgeHeight} color={badgeColor} className="v2-icon v2-icon--range"></Badge>
            )}
            {iconType === IconType.UP && (
                <Badge height={badgeHeight} color={badgeColor} className="v2-icon v2-icon--up"></Badge>
            )}
            {iconType === IconType.DOWN && (
                <Badge height={badgeHeight} color={badgeColor} className="v2-icon v2-icon--down"></Badge>
            )}
            <AssetIcon style={{ marginRight: 7, width: props.width, height: props.height, ...synthIconStyle }} />
        </Content>
    );
};

const Content = styled.div`
    position: relative;
    display: flex;
`;

const Badge = styled.i<{ color: string; height: number }>`
    position: absolute;
    top: -2px;
    left: 0px;
    font-size: ${(props) => props.height + 'px'};
    width: ${(props) => props.height + 'px'};
    border-radius: 20px;
    color: ${(props) => (props?.color ? props.color : '')};
    background: ${(props) => props.theme.background.primary};
`;

export default CurrencyIcon;
