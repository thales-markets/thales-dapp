import React from 'react';
import styled from 'styled-components';

import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';

import { getSynthName } from 'utils/currency';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';
import { ScreenSizeBreakpoint } from 'constants/ui';

export type AssetInfoProps = {
    currencyKey: string;
    logoSize?: string;
    assetNameFontSize?: string;
    currencyKeyFontSize?: string;
    displayInRow?: boolean;
    displayInRowMobile?: boolean;
    hideFullName?: boolean;
    iconType?: number;
};

const AssetInfo: React.FC<AssetInfoProps> = ({
    currencyKey,
    logoSize,
    assetNameFontSize,
    currencyKeyFontSize,
    displayInRow,
    hideFullName,
    displayInRowMobile,
    iconType,
}) => {
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    return (
        <AssetContainer displayInRowMobile={displayInRowMobile}>
            <CurrencyIcon
                synthIconStyle={{
                    marginRight: isMobile ? 0 : 7,
                    height: isMobile ? '30px' : logoSize || '24px',
                    width: isMobile ? '30px' : logoSize || '24px',
                }}
                currencyKey={currencyKey}
                width={logoSize}
                height={logoSize}
                iconType={iconType}
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
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        min-height: 100%;
        flex-direction: ${(props) => (props.displayInRowMobile ? 'row' : 'column')};
        justify-content: ${(props) => (props.displayInRowMobile ? 'flex-start' : 'space-evenly')};
    }
`;

const AssetNameContainer = styled.div<{ displayInRow?: boolean }>`
    display: ${(props) => (props?.displayInRow ? 'flex' : 'block')};
    ${(props) => (props?.displayInRow ? 'flex-direction: row;' : '')}
    ${(props) => (props?.displayInRow ? 'align-items: baseline;' : '')}
    text-align: left;
    font-size: 15px;
    color: var(--color-white) !important;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        text-align: center;
    }
`;

const AssetName = styled.span<{ fontSize?: string }>`
    display: block;
    font-weight: 300;
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '20px')};
    text-transform: uppercase;
    line-height: 120%;
    margin-right: 2px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        display: none;
    }
`;

const CurrencyKey = styled.span<{ fontSize?: string }>`
    display: block;
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '20px')};
    text-transform: uppercase;
    font-weight: 700;
`;

export default AssetInfo;
