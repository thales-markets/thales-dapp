import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UserClosedPositions } from 'types/options';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrencyWithPrecision, formatCurrencyWithSign, formatNumberShort } from 'utils/formatters/number';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';
import { getColorPerPosition } from 'utils/options';

type ClosedPositionProps = {
    position: UserClosedPositions;
};

const ClosedPosition: React.FC<ClosedPositionProps> = ({ position }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    return (
        <Position>
            <Icon className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`} />
            <AlignedFlex>
                <FlexContainer firstChildWidth="130px">
                    <Label>{position.currencyKey}</Label>
                    <Value>{position.strikePrice}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer secondChildWidth="140px">
                    <Label>{t('profile.final-price')}</Label>
                    <Value>{formatCurrencyWithPrecision(position.finalPrice || 0)}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>{t('speed-markets.user-positions.end-time')}</Label>
                    <Value>{formatShortDateWithTime(position.maturityDate)}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>{t('markets.user-positions.size')}</Label>
                    <Value>
                        {formatNumberShort(position.amount)}{' '}
                        <Value color={getColorPerPosition(position.side, theme)}>{position.side}</Value>
                    </Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>{t('markets.user-positions.paid')}</Label>
                    <Value>{formatCurrencyWithSign(USD_SIGN, position.paid, 2)}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>{t('common.result')}</Label>
                    <Value
                        isUpperCase
                        color={position.isUserWinner ? theme.borderColor.quaternary : theme.error.borderColor.primary}
                    >
                        {position.isUserWinner ? t('common.won') : t('common.loss')}
                    </Value>
                </FlexContainer>
            </AlignedFlex>
        </Position>
    );
};

const Position = styled.div`
    background: ${(props) => props.theme.background.primary};
    border: 2px solid ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    min-height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 13px;
    gap: 4px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 172px;
        padding: 10px 10px;
        margin-bottom: 10px;
        gap: 6px;
    }
`;

const Icon = styled.i`
    font-size: 28px;
`;

const AlignedFlex = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        gap: 6px;
    }
`;

const FlexContainer = styled(AlignedFlex)<{ firstChildWidth?: string; secondChildWidth?: string }>`
    gap: 4px;
    flex: 1;
    justify-content: center;
    &:first-child {
        min-width: ${(props) => (props.firstChildWidth ? props.firstChildWidth : '195px')};
        max-width: ${(props) => (props.firstChildWidth ? props.firstChildWidth : '195px')};
    }
    &:nth-child(3) {
        ${(props) => (props.secondChildWidth ? `min-width: ${props.secondChildWidth};` : '')};
    }

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        gap: 4px;
    }
`;

const Label = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    white-space: nowrap;
`;

const Value = styled(Label)<{ color?: string; isUpperCase?: boolean }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
    white-space: nowrap;
    ${(props) => (props.isUpperCase ? 'text-transform: uppercase;' : '')}
`;

const Separator = styled.div`
    min-width: 2px;
    width: 2px;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

export default ClosedPosition;
