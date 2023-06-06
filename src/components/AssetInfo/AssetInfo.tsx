import React from 'react';
import styled from 'styled-components';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { getSynthName } from 'utils/currency';

export type AssetInfoProps = {
    currencyKey: string;
    iconFontSize?: string;
    assetNameFontSize?: string;
    currencyKeyFontSize?: string;
    displayInRow?: boolean;
    displayInRowMobile?: boolean;
    hideFullName?: boolean;
};

const AssetInfo: React.FC<AssetInfoProps> = ({
    currencyKey,
    iconFontSize,
    assetNameFontSize,
    currencyKeyFontSize,
    displayInRow,
    hideFullName,
    displayInRowMobile,
}) => {
    return (
        <AssetContainer displayInRowMobile={displayInRowMobile}>
            <CurrencyIcon
                className={`currency-icon currency-icon--${currencyKey.toLowerCase()}`}
                fontSize={iconFontSize}
            />
            <AssetNameContainer displayInRow={displayInRow}>
                {!hideFullName && <AssetName fontSize={assetNameFontSize}>{getSynthName(currencyKey)}</AssetName>}
                <CurrencyKey fontSize={currencyKeyFontSize}>{currencyKey}</CurrencyKey>
            </AssetNameContainer>
        </AssetContainer>
    );
};

const AssetContainer = styled.div<{ displayInRowMobile?: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    flex: 1;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        min-height: 100%;
        flex-direction: ${(props) => (props.displayInRowMobile ? 'row' : 'column')};
        justify-content: ${(props) => (props.displayInRowMobile ? 'flex-start' : 'space-evenly')};
    }
`;

const AssetNameContainer = styled.div<{ displayInRow?: boolean }>`
    display: ${(props) => (props.displayInRow ? 'flex' : 'block')};
    ${(props) => (props.displayInRow ? 'flex-direction: row;' : '')}
    ${(props) => (props.displayInRow ? 'align-items: baseline;' : '')}
    text-align: left;
    font-size: 15px;
    color: ${(props) => props.theme.textColor.primary} !important;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        text-align: center;
    }
`;

const AssetName = styled.span<{ fontSize?: string }>`
    display: block;
    font-weight: 300;
    font-size: ${(props) => props.fontSize || '12px'};
    text-transform: uppercase;
    line-height: 120%;
    margin-right: 2px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const CurrencyKey = styled.span<{ fontSize?: string }>`
    display: block;
    font-size: ${(props) => props.fontSize || '12px'};
    text-transform: uppercase;
    font-weight: 700;
`;

const CurrencyIcon = styled.i<{ fontSize?: string }>`
    font-size: ${(props) => props.fontSize || '24px'};
    margin-right: 6px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-right: 0px;
    }
`;

export default AssetInfo;
