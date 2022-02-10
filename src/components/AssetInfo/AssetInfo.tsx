import React from 'react';
import styled from 'styled-components';

import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';

import { getSynthName } from 'utils/currency';

export type AssetInfoProps = {
    currencyKey: string;
    logoSize?: string;
    assetNameFontSize?: string;
    currencyKeyFontSize?: string;
};

const AssetInfo: React.FC<AssetInfoProps> = ({ currencyKey, logoSize, assetNameFontSize, currencyKeyFontSize }) => {
    return (
        <AssetContainer>
            <CurrencyIcon currencyKey={currencyKey} width={logoSize} height={logoSize} />
            <AssetNameContainer>
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

export const AssetNameContainer = styled.div`
    display: block;
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
