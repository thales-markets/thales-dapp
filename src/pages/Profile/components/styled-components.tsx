import { LINKS } from 'constants/links';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRowCentered } from 'styles/common';
import { ThemeInterface } from 'types/ui';
import { getColorPerPosition } from 'utils/options';

export const Container = styled(FlexDivColumn)`
    padding-top: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding-top: 5px;
    }
`;

export const Content = styled.div`
    display: content;
    &:not(:last-child) {
        margin-bottom: 15px;
    }
`;

export const Card = styled(FlexDivRowCentered)`
    background: ${(props) => props.theme.background.secondary};
    border-radius: 15px;
    padding: 20px 25px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 12px 10px;
    }
    &:hover {
        transform: scale(1.02);
    }
`;
export const CardColumn = styled(FlexDivColumn)``;

export const CardRow = styled(FlexDivCentered)`
    margin-bottom: 10px;
`;

export const CardSection = styled(FlexDivColumn)`
    &:not(:last-child) {
        margin-bottom: 10px;
    }
`;

export const CardRowTitle = styled.span`
    font-size: 13px;
    line-height: 100%;
    white-space: pre;
    color: ${(props) => props.theme.textColor.secondary};
    font-weight: 400;
    margin-bottom: 4px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
    }
`;

export const CardRowValue = styled.span<{ color?: string }>`
    font-size: 18px;
    line-height: 100%;
    white-space: pre;
    color: ${(props) => props.color || props.theme.textColor.primary};
    font-weight: 700;
    span {
        font-size: 18px !important;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
        span {
            font-size: 13px !important;
        }
    }
`;

export const CurrencyIcon = styled.i<{ fontSize?: string }>`
    font-size: ${(props) => props.fontSize || '32px'};
    margin-right: 6px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 24px;
    }
`;

export const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 200px;
    width: 100%;
`;

export const NoDataContainer = styled(FlexDivCentered)`
    color: ${(props) => props.theme.textColor.primary};
    justify-content: center;
    margin: 20px 0px;
    font-size: 15px;
    font-weight: bold;
    width: 100%;
    height: 20px;
    text-align: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
    }
  }
`;

export const TooltipLink = styled.a`
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
`;

export const UsingAmmLink: React.FC = () => {
    const { t } = useTranslation();
    return (
        <TooltipLink
            target="_blank"
            rel="noreferrer"
            href={LINKS.AMM.UsingAmm}
            onClick={(event) => {
                event?.stopPropagation();
            }}
        >
            {t('common.here')}
        </TooltipLink>
    );
};

export const getAmount = (amount: number | string, position: Positions, theme: ThemeInterface) => (
    <Value>
        {amount} <Value color={getColorPerPosition(position, theme)}>{position}</Value>
    </Value>
);

export const getStatus = (claimed: boolean, theme: ThemeInterface, t: TFunction) =>
    claimed ? (
        <Value color={theme.textColor.quaternary} fontSize="15px">
            {t('options.home.market-card.claimed')}
        </Value>
    ) : (
        <Value color={theme.textColor.tertiary} fontSize="15px">
            {t('options.home.market-card.rip')}
        </Value>
    );

const Value = styled.span<{ color?: string; fontSize?: string }>`
    font-size: ${(props) => props.fontSize || '12px'};
    color: ${(props) => props.color || props.theme.textColor.primary};
`;

export const IconLink = styled.i<{ color?: string }>`
    font-size: 20px;
    color: ${(props) => props.color || props.theme.textColor.secondary};
    text-transform: none;
`;

export const ArrowLink: React.FC<{ href: string }> = ({ href }) => {
    return (
        <a target="_blank" rel="noreferrer" href={href}>
            <IconLink className="icon icon--right" />
        </a>
    );
};
