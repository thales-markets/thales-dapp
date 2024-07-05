import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import styled from 'styled-components';
import { formatCurrencyWithSign } from 'thales-utils';

type CurrentPriceProps = {
    asset: string;
    currentPrice: number | undefined;
};

const CurrentPrice: React.FC<CurrentPriceProps> = ({ asset, currentPrice }) => {
    const currentPriceFormatted = formatCurrencyWithSign(USD_SIGN, currentPrice || 0);

    return (
        <Container>
            <Icon className={`currency-icon currency-icon--${asset.toLowerCase()}`} />
            <Price>{currentPrice ? currentPriceFormatted : 'N/A'}</Price>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        gap: 5px;
    }
`;

const Icon = styled.i<{ isUp?: boolean }>`
    font-size: ${(props) => (props.isUp !== undefined ? '22' : '28')}px;
    ${(props) =>
        props.isUp !== undefined
            ? `color: ${props.isUp ? props.theme.positionColor.up : props.theme.positionColor.down};`
            : ''}
    ${(props) =>
        props.isUp !== undefined ? (props.isUp ? 'transform: rotate(-90deg);' : 'transform: rotate(90deg);') : ''}
    
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: ${(props) => (props.isUp !== undefined ? '18' : '22')}px;
    }
`;

const Price = styled.span<{ isUp?: boolean }>`
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    color: ${(props) =>
        props.isUp !== undefined
            ? props.isUp
                ? props.theme.positionColor.up
                : props.theme.positionColor.down
            : props.theme.textColor.primary};

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 18px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.EXTRA_SMALL}px) {
        font-size: 16px;
    }
`;

export default CurrentPrice;
