import { LINKS } from 'constants/links';
import { Positions } from 'enums/options';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { getColorPerPosition } from 'utils/options';

const TooltipLink = styled.a`
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
            {t('profile.claimed')}
        </Value>
    ) : (
        <Value color={theme.textColor.tertiary} fontSize="15px">
            {t('profile.rip')}
        </Value>
    );

const Value = styled.span<{ color?: string; fontSize?: string }>`
    font-size: ${(props) => props.fontSize || '12px'};
    color: ${(props) => props.color || props.theme.textColor.primary};
`;

export const TextLink = styled.span`
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
`;

export const IconLink = styled.i<{ color?: string; fontSize?: string; marginTop?: string }>`
    font-size: ${(props) => props.fontSize || '20px'};
    color: ${(props) => props.color || props.theme.textColor.secondary};
    text-transform: none;
    margin-top: ${(props) => props.marginTop || '0px'};
`;

export const ArrowLink: React.FC<{ href: string }> = ({ href }) => {
    return (
        <a target="_blank" rel="noreferrer" href={href}>
            <IconLink className="icon icon--right" />
        </a>
    );
};
