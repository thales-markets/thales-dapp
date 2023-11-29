import React from 'react';
import styled from 'styled-components';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { getSynthName } from 'utils/currency';
import { Positions } from 'enums/options';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';
import { getColorPerPosition } from 'utils/options';
import { Chain, Icon } from 'pages/SpeedMarkets/components/SelectPosition/styled-components';

export type AssetInfoProps = {
    currencyKey: string;
    iconFontSize?: string;
    assetNameFontSize?: string;
    currencyKeyFontSize?: string;
    displayInRow?: boolean;
    displayInRowMobile?: boolean;
    hideFullName?: boolean;
    position?: Positions;
    isChainedPosition?: boolean;
    width?: string;
};

const AssetInfo: React.FC<AssetInfoProps> = ({
    currencyKey,
    iconFontSize,
    assetNameFontSize,
    currencyKeyFontSize,
    displayInRow,
    hideFullName,
    displayInRowMobile,
    position,
    isChainedPosition,
    width,
}) => {
    const theme: ThemeInterface = useTheme();

    return (
        <AssetContainer displayInRowMobile={displayInRowMobile} width={width}>
            <CurrencyIcon
                className={`currency-icon currency-icon--${currencyKey.toLowerCase()}`}
                fontSize={iconFontSize}
                displayInRowMobile={displayInRowMobile}
            />
            <AssetNameContainer displayInRow={displayInRow} displayInRowMobile={displayInRowMobile}>
                {!hideFullName && !position && (
                    <AssetName fontSize={assetNameFontSize}>{getSynthName(currencyKey)}</AssetName>
                )}
                <CurrencyKey fontSize={currencyKeyFontSize}>{currencyKey}</CurrencyKey>
                {!isChainedPosition && position && (
                    <Position fontSize={currencyKeyFontSize} color={getColorPerPosition(position, theme)}>
                        {position}
                    </Position>
                )}
                {isChainedPosition && position && (
                    <Chain isSelectedUp={position === Positions.UP}>
                        <Icon className="icon icon--chain" />
                    </Chain>
                )}
            </AssetNameContainer>
        </AssetContainer>
    );
};

const AssetContainer = styled.div<{ displayInRowMobile?: boolean; width?: string }>`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    flex: 1;
    max-width: ${(props) => props.width || ''};
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        min-height: 100%;
        flex-direction: ${(props) => (props.displayInRowMobile ? 'row' : 'column')};
        justify-content: ${(props) => (props.displayInRowMobile ? 'flex-start' : 'space-evenly')};
    }
`;

const AssetNameContainer = styled.div<{ displayInRow?: boolean; displayInRowMobile?: boolean }>`
    display: ${(props) => (props.displayInRow ? 'flex' : 'block')};
    ${(props) => (props.displayInRow ? 'flex-direction: row;' : '')}
    ${(props) => (props.displayInRow ? 'align-items: baseline;' : '')}
    text-align: left;
    font-size: 15px;
    color: ${(props) => props.theme.textColor.primary};
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        text-align: ${(props) => (props.displayInRowMobile ? 'left' : 'center')};
    }
`;

const AssetName = styled.span<{ fontSize?: string }>`
    display: block;
    font-weight: 700;
    font-size: ${(props) => props.fontSize || '12px'};
    color: ${(props) => props.theme.textColor.secondary};
    text-transform: uppercase;
    line-height: 120%;
    margin-right: 2px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const CurrencyKey = styled.span<{ fontSize?: string }>`
    display: block;
    font-weight: 700;
    line-height: 120%;
    font-size: ${(props) => props.fontSize || '12px'};
    color: ${(props) => props.theme.textColor.primary};
    text-transform: uppercase;
`;

const Position = styled.span<{ fontSize?: string; color?: string }>`
    display: block;
    font-weight: 700;
    font-size: ${(props) => props.fontSize || '12px'};
    color: ${(props) => props.color};
    text-transform: uppercase;
`;

const CurrencyIcon = styled.i<{ fontSize?: string; displayInRowMobile?: boolean }>`
    font-size: ${(props) => props.fontSize || '24px'};
    margin-right: 6px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-right: ${(props) => (props.displayInRowMobile ? '4px' : '0')};
    }
`;

export default AssetInfo;
