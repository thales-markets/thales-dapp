import React from 'react';
import styled from 'styled-components';
import { FlexDivColumn, GridDivCol } from 'theme/common';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';

export const Container = styled(FlexDivColumn)`
    padding: 15px;
`;

export const GridContainer = styled(GridDivCol)`
    column-gap: 10px;
`;

export const Input = styled.input`
    background: transparent;
    border: 2px solid ${(props) => props.theme.input.borderColor.primary};
    box-sizing: border-box;
    mix-blend-mode: normal;
    border-radius: 12px;
    height: 64px;
    padding: 14px 68px 0 20px;
    outline: 0;
    font-size: 16px;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: ${(props) => props.theme.input.textColor.primary};
    &::selection {
        color: ${(props) => props.theme.input.textColor.tertiary};
        background: ${(props) => props.theme.input.background.selection.primary};
    }
    &:focus {
        border: 2px solid ${(props) => props.theme.input.borderColor.focus.primary};
        box-sizing: border-box;
    }
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
    &.error {
        border: 2px solid ${(props) => props.theme.input.borderColor.error.primary};
    }
`;

type TooltipIconProps = {
    disableHoverListener?: boolean;
    title: React.ReactNode;
    children: any;
};

const StyledLightTooltip = withStyles(() => ({
    arrow: {
        color: '#6A7FB6',
    },
    tooltip: {
        background: '#6A7FB6',
        borderRadius: '6px',
        padding: '4px 10px',
        fontSize: '10px',
        fontWeight: 600,
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: '#F6F6FE',
    },
}))(MaterialTooltip);

const StyledLandingPageTooltip = withStyles(() => ({
    arrow: {
        color: '#052040',
    },
    tooltip: {
        background: '#6A7FB6',
        borderRadius: '6px',
        padding: '4px 10px',
        fontSize: '10px',
        fontWeight: 600,
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: '#f7f7f7',
        backgroundColor: '#052040',
    },
}))(MaterialTooltip);

export const LightTooltip: React.FC<TooltipIconProps> = ({ title, children, disableHoverListener }) => (
    <StyledLightTooltip
        disableHoverListener={disableHoverListener}
        title={<span>{title}</span>}
        placement="top"
        arrow={true}
    >
        {children}
    </StyledLightTooltip>
);

export const LandingPageTooltip: React.FC<TooltipIconProps> = ({ title, children, disableHoverListener }) => (
    <StyledLandingPageTooltip
        disableHoverListener={disableHoverListener}
        title={<span>{title}</span>}
        placement="top"
        arrow={true}
    >
        {children}
    </StyledLandingPageTooltip>
);
