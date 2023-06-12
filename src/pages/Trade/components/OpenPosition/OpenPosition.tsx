import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UserLivePositions } from 'types/options';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrencyWithSign, formatNumberShort } from 'utils/formatters/number';
import MyPositionAction from 'pages/Profile/components/MyPositionAction/MyPositionAction';
import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { Positions } from 'enums/options';
import { RootState } from 'redux/rootReducer';
import { getIsMobile } from 'redux/modules/ui';
import { useSelector } from 'react-redux';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';

type OpenPositionProps = {
    position: UserLivePositions;
};

const OpenPosition: React.FC<OpenPositionProps> = ({ position }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isRanged = [Positions.IN, Positions.OUT].includes(position.side);
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

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
            <SPAAnchor
                href={
                    isRanged
                        ? buildRangeMarketLink(position.market, position.side)
                        : buildOptionsMarketLink(position.market, position.side)
                }
            >
                {isMobile ? (
                    <TextLink>
                        {t('options.trading-profile.go-to-market')}{' '}
                        <IconLink
                            className="icon icon--right"
                            fontSize="10px"
                            marginTop="-2px"
                            color={theme.link.textColor.primary}
                        />
                    </TextLink>
                ) : (
                    <IconLink className="icon icon--right" />
                )}
            </SPAAnchor>
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

const TextLink = styled.span`
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
`;

const IconLink = styled.i<{ color?: string; fontSize?: string; marginTop?: string }>`
    font-size: ${(props) => props.fontSize || '20px'};
    color: ${(props) => props.color || props.theme.textColor.secondary};
    text-transform: none;
    margin-top: ${(props) => props.marginTop || '0px'};
`;

export default OpenPosition;
