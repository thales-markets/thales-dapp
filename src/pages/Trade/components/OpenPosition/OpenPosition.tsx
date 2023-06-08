import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UserLivePositions } from 'types/options';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrencyWithSign, formatNumberShort } from 'utils/formatters/number';
import MyPositionAction from 'pages/Profile/components/MyPositionAction/MyPositionAction';

type OpenPositionProps = {
    position: UserLivePositions;
};

const OpenPosition: React.FC<OpenPositionProps> = ({ position }) => {
    const { t } = useTranslation();

    return (
        <Position>
            <Icon className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`} />
            <AlignedFlex>
                <FlexContainer>
                    <Label>{`${position.currencyKey}`}</Label>
                    <Value>{position.strikePrice}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>{t('options.trade.user-positions.end-date')}</Label>
                    <Value>{formatShortDateWithTime(position.maturityDate)}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>{t('options.trade.user-positions.size')}</Label>
                    <Value>{`${formatNumberShort(position.amount)}  ${position.side}`}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>{t('options.trade.user-positions.paid')}</Label>
                    <Value>{formatCurrencyWithSign(USD_SIGN, position.paid, 2)}</Value>
                </FlexContainer>
            </AlignedFlex>
            <MyPositionAction position={position} />
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
    padding: 0 17px;
    gap: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 172px;
        padding: 10px 10px;
        margin-bottom: 10px;
        gap: 10px;
    }
`;

const Icon = styled.i`
    font-size: 31px;
`;

const AlignedFlex = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        gap: 6px;
    }
`;

const FlexContainer = styled(AlignedFlex)`
    gap: 4px;
    flex: 1;
    justify-content: center;
    &:first-child {
        min-width: 195px;
        max-width: 195px;
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

const Value = styled(Label)`
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
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

export default OpenPosition;
