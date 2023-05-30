import { LINKS } from 'constants/links';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivSpaceBetween } from 'theme/common';

export const Container = styled(FlexDivSpaceBetween)`
    background: ${(props) => props.theme.background.secondary};
    border-radius: 15px;
    padding: 5px 10px;
    gap: 8px;
    width: 600px;
    @media (max-width: 767px) {
        margin-top: 20px;
        gap: 0;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        width: 100%;
    }
`;

export const ColumnAnchorSubContainer = styled.a`
    display: contents;
`;

export const ColumnContainer = styled(FlexDivColumn)<{
    alignItems?: string;
}>`
    align-items: ${(props) => props.alignItems || 'baseline'};
    justify-content: flex-start;
    @media (max-width: 767px) {
        padding: 0 10px;
    }
`;

export const Icon = styled.i<{ color?: string }>`
    margin: 0 5px;
    font-size: 13px;
    color: ${(props) => props.color || ''};
`;

export const SubContainer = styled(FlexDivColumn)<{
    hidden?: boolean;
}>`
    justify-content: space-around;
    margin: 10px 0px;
    visibility: ${(props) => (props.hidden ? 'hidden' : '')};
`;

export const Header = styled.span`
    color: ${(props) => props.theme.textColor.secondary};
    font-weight: 400;
    font-size: 13px;
    white-space: nowrap;
    margin-bottom: 2px;
`;

export const Value = styled.span<{ color?: string }>`
    font-weight: 700;
    font-size: 13px;
    white-space: nowrap;
    color: ${(props) => props.color || props.theme.textColor.primary};
`;

export const CurrencyContainer = styled(FlexDivColumnCentered)`
    margin: 10px 0px 4px 0px;
`;

export const CurrencyIcon = styled.i`
    font-size: 30px;
`;

export const CurrencyLabel = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 15px;
    text-align: center;
    margin-top: 4px;
`;

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
