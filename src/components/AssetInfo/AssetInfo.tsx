import React from 'react';
import styled from 'styled-components';

import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';

import { getSynthName } from 'utils/currency';

export type AssetInfoProps = {
    currencyKey: string;
    logoSize?: string;
    assetNameFontSize?: string;
    currencyKeyFontSize?: string;
    displayInRow?: boolean;
};

const AssetInfo: React.FC<AssetInfoProps> = ({
    currencyKey,
    logoSize,
    assetNameFontSize,
    currencyKeyFontSize,
    displayInRow,
}) => {
    return (
        <AssetContainer>
            <CurrencyIcon currencyKey={currencyKey} width={logoSize} height={logoSize} />
            <AssetNameContainer displayInRow={displayInRow}>
                <AssetName fontSize={assetNameFontSize}>{getSynthName(currencyKey)}</AssetName>
                <CurrencyKey fontSize={currencyKeyFontSize}>{currencyKey}</CurrencyKey>
            </AssetNameContainer>
        </AssetContainer>
    );
};

const AssetContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
`;

export const AssetNameContainer = styled.div<{ displayInRow?: boolean }>`
    display: ${(_props) => (_props?.displayInRow ? 'flex' : 'block')};
    ${(_props) => (_props?.displayInRow ? 'flex-direction: row;' : '')}
    ${(_props) => (_props?.displayInRow ? 'align-items: baseline;' : '')}
    text-align: left;
    font-size: 15px;
    color: var(--primary-color) !important;
`;

export const AssetName = styled.span<{ fontSize?: string }>`
    font-family: Titillium Regular !important;
    font-style: normal;
    display: block;
    font-weight: 300;
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
    text-transform: uppercase;
    line-height: 120%;
    margin-right: 2px;
`;

export const CurrencyKey = styled.span<{ fontSize?: string }>`
    font-family: Titillium Regular !important;
    font-style: normal;
    display: block;
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
    text-transform: uppercase;
    font-weight: 700;
`;

export default AssetInfo;
