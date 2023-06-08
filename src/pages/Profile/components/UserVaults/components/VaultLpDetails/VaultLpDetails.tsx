import TimeRemaining from 'components/TimeRemaining/TimeRemaining';
import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
}) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    return (
        <Container>
            <TitleWrapper>
                <Icon className={`sidebar-icon icon--${icon}`} />
                <Title>{title}</Title>
            </TitleWrapper>
            <Item hideBorder>
                <Label>{'My position'}</Label>
                <Value>{formatCurrencyWithSign(USD_SIGN, position)}</Value>
            </Item>
            <Item>
                <Label>{'Vault PnL'}</Label>
                <Value
                    color={
                        pnl === 0
                            ? theme.textColor.primary
                            : pnl > 0
                            ? theme.textColor.quaternary
                            : theme.textColor.tertiary
                    }
                >
                    {formatPercentageWithSign(pnl)}
                </Value>
            </Item>
            <Item>
                <Label>{'Round'}</Label>
                <Value>{`#${round}`}</Value>
            </Item>
            <Item>
                <Label>{'Round ends in'}</Label>
                <Value>
                    {isRoundEnded ? (
                        t('vault.round-ended-label')
                    ) : (
                        <TimeRemaining end={roundEndTime} fontSize={15} showFullCounter />
                    )}
                </Value>
            </Item>
            <Item hideBorder maxWidth="30px">
                <VaultLink href={link} />
            </Item>
        </Container>
    );
};

const Container = styled(FlexDivRow)`
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    color: ${(props) => props.theme.textColor.primary};
    padding: 13px 15px;
    font-weight: 700;
    font-size: 13px;
    line-height: 13px;
    margin-bottom: 10px;
    white-space: pre;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 15px 10px;
        flex-wrap: wrap;
        font-size: 13px;
        line-height: 15px;
        gap: 10px;
    }
`;
export const Item = styled(FlexDivColumnCentered)<{ hideBorder?: boolean; maxWidth?: string }>`
    border-left: ${(props) => (props.hideBorder ? 'none' : `2px solid ${props.theme.borderColor.secondary}`)};
    max-width: ${(props) => props.maxWidth || ''};
    width: 100%;
    text-align: center;
    gap: 0;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        border-left: none;
        width: 50%;
    }
`;

export const Label = styled.label`
    font-size: 13px;
    color: ${(props) => props.theme.textColor.secondary};
    text-transform: uppercase;
    margin-bottom: 2px;
`;

export const Value = styled.span<{ color?: string }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
    font-size: 15px;
`;

const TitleWrapper = styled(FlexDivStart)`
    align-items: center;
    min-width: 250px;
    font-weight: 400;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        min-width: 100%;
        justify-content: center;
    }
`;

const Title = styled.span`
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
`;

const Icon = styled.i`
    margin-right: 6px;
    font-size: 26px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 24px;
    }
`;

export const Link = styled.a`
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
`;

const IconLink = styled.i<{ color?: string }>`
    font-size: 20px;
    color: ${(props) => props.color || props.theme.textColor.secondary};
    text-transform: none;
`;

export const VaultLink: React.FC<{ href: string }> = ({ href }) => {
    return (
        <Link rel="noreferrer" href={href}>
            <IconLink className="icon icon--right" />
        </Link>
    );
};

export default VaultLpDetails;
