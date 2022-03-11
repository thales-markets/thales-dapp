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
    const isMobile = window.innerWidth < 768;

    return (
        <AssetContainer>
            <CurrencyIcon
                synthIconStyle={{
                    marginRight: isMobile ? 0 : 7,
                    height: isMobile ? '30px' : '24px',
                    width: isMobile ? '30px' : '24px',
                }}
                currencyKey={currencyKey}
                width={logoSize}
                height={logoSize}
            />
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
    flex: 1;
    @media screen and (max-width: 767px) {
        min-height: 100%;
        flex-direction: column;
        justify-content: space-evenly;
    }
`;

export const AssetNameContainer = styled.div<{ displayInRow?: boolean }>`
    display: ${(_props) => (_props?.displayInRow ? 'flex' : 'block')};
    ${(_props) => (_props?.displayInRow ? 'flex-direction: row;' : '')}
    ${(_props) => (_props?.displayInRow ? 'align-items: baseline;' : '')}
    text-align: left;
    font-size: 15px;
    color: var(--primary-color) !important;
    @media screen and (max-width: 767px) {
        text-align: center;
    }
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
    @media screen and (max-width: 767px) {
        display: none;
    }
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
