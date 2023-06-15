import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import TimeRemaining from 'components/TimeRemaining/TimeRemaining';
import { USD_SIGN } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow, FlexDivStart } from 'styles/common';
import { ThemeInterface } from 'types/ui';
import { formatCurrencyWithSign, formatPercentageWithSign } from 'utils/formatters/number';

type VaultLpDetailsProps = {
    icon: string;
    title: string;
    position: number;
    pnl: number;
    round: number;
    roundEndTime: number;
    isRoundEnded: boolean;
    link: string;
    isLoading: boolean;
};

const VaultLpDetails: React.FC<VaultLpDetailsProps> = ({
    icon,
    title,
    position,
    pnl,
    round,
    roundEndTime,
    isRoundEnded,
    link,
    isLoading,
}) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const getTextValue = (value: string | Element | JSX.Element, color?: string) => (
        <Value color={color}>{isLoading ? EMPTY_VALUE : value}</Value>
    );

    return (
        <Container>
            <TitleWrapper>
                <Icon className={`sidebar-icon icon--${icon}`} />
                <Title>{title}</Title>
            </TitleWrapper>
            <Item hideBorder>
                <Label>{t('profile.vaults-lp.my-position-label')}</Label>
                {getTextValue(formatCurrencyWithSign(USD_SIGN, position))}
            </Item>
            <Item>
                <Label>
                    {icon === 'liquidity-pool'
                        ? t('profile.vaults-lp.lp-pnl-label')
                        : t('profile.vaults-lp.vault-pnl-label')}
                </Label>
                {getTextValue(
                    formatPercentageWithSign(pnl),
                    pnl === 0
                        ? theme.textColor.primary
                        : pnl > 0
                        ? theme.textColor.quaternary
                        : theme.textColor.tertiary
                )}
            </Item>
            <Item>
                <Label>{t('profile.vaults-lp.round-label')}</Label>
                {getTextValue(`#${round}`)}
            </Item>
            <Item>
                <Label>{t('profile.vaults-lp.round-end-label')}</Label>

                {getTextValue(
                    isRoundEnded ? (
                        t('profile.vaults-lp.round-ended-label')
                    ) : (
                        <TimeRemaining end={roundEndTime} fontSize={15} showFullCounter />
                    )
                )}
            </Item>
            {!isMobile && (
                <Item hideBorder maxWidth="20px">
                    <SPAAnchor href={link}>
                        <IconLink className="icon icon--right" />
                    </SPAAnchor>
                </Item>
            )}
        </Container>
    );
};

const Container = styled(FlexDivRow)`
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    color: ${(props) => props.theme.textColor.primary};
    padding: 13px 15px;
    font-weight: 400;
    font-size: 13px;
    line-height: 13px;
    margin-bottom: 10px;
    white-space: pre;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 15px 10px;
        flex-wrap: wrap;
        font-size: 13px;
        line-height: 15px;
        gap: 8px;
    }
`;
const Item = styled(FlexDivColumnCentered)<{ hideBorder?: boolean; maxWidth?: string }>`
    border-left: ${(props) => (props.hideBorder ? 'none' : `2px solid ${props.theme.borderColor.secondary}`)};
    max-width: ${(props) => props.maxWidth || ''};
    width: 100%;
    text-align: center;
    padding: 0 5px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        border-left: none;
        width: 50%;
        padding: 0;
    }
`;

const Label = styled.label`
    font-size: 13px;
    color: ${(props) => props.theme.textColor.secondary};
    text-transform: uppercase;
    margin-bottom: 2px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
    }
`;

const Value = styled.span<{ color?: string }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
    font-size: 15px;
    font-weight: 700;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
        span {
            font-size: 13px !important;
        }
    }
`;

const TitleWrapper = styled(FlexDivStart)`
    align-items: center;
    min-width: 250px;
    font-weight: 400;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        min-width: 100%;
        justify-content: center;
        margin-bottom: 5px;
    }
`;

const Title = styled.span`
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 16px;
    }
`;

const Icon = styled.i`
    margin-right: 6px;
    font-size: 26px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 20px;
    }
`;

const IconLink = styled.i<{ color?: string }>`
    font-size: 20px;
    color: ${(props) => props.color || props.theme.textColor.secondary};
    text-transform: none;
`;

export default VaultLpDetails;
