import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AmmSpeedMarketsLimits, UserLivePositions } from 'types/options';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrencyWithPrecision, formatCurrencyWithSign, formatNumberShort } from 'utils/formatters/number';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';
import { getColorPerPosition } from 'utils/options';
import OverviewPositionAction from '../OverviewPositionAction';
import { Label, Separator } from '../OverviewPositionAction/OverviewPositionAction';

type UnresolvedPositionProps = {
    position: UserLivePositions;
    isSubmittingBatch: boolean;
    ammSpeedMarketsLimitsData: AmmSpeedMarketsLimits | null;
    isAmmWinnerSection: boolean;
};

const UnresolvedPosition: React.FC<UnresolvedPositionProps> = ({
    position,
    isSubmittingBatch,
    ammSpeedMarketsLimitsData,
    isAmmWinnerSection,
}) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    return (
        <Position>
            <AlignedFlex>
                <FlexContainer>
                    <Label>{t('speed-markets.overview.user')}</Label>
                    <Value>{position.user}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Icon className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`} />
                    <Label>{position.currencyKey}</Label>
                    <Value>{position.strikePrice}</Value>
                </FlexContainer>
                <Separator />
                <FlexContainer>
                    <Label>
                        {position.maturityDate < Date.now() ? t('profile.final-price') : t('profile.current-price')}
                    </Label>
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
            </AlignedFlex>
            <OverviewPositionAction
                position={position}
                isSubmittingBatch={isSubmittingBatch}
                ammSpeedMarketsLimitsData={ammSpeedMarketsLimitsData}
                isAmmWinnerSection={isAmmWinnerSection}
            />
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

const FlexContainer = styled(AlignedFlex)`
    gap: 4px;
    flex: 1;
    justify-content: center;

    &:nth-child(1) {
        min-width: 320px;
    }
    &:nth-child(3) {
        min-width: 130px;
    }

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        gap: 4px;
    }
`;

const Value = styled(Label)<{ color?: string }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
    white-space: nowrap;
`;

export default UnresolvedPosition;
