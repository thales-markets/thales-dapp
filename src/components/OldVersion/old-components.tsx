import React from 'react';
import Select from 'components/Select';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, GridDivCol, FlexDivColumnCentered } from 'theme/common';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';
import { ReactComponent as CloseIcon } from 'assets/images/close.svg';

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

export const InputLabel = styled.label`
    font-weight: bold;
    font-size: 9px;
    line-height: 16px;
    letter-spacing: 1px;
    color: #748bc6;
    padding: 8px 0 0 22px;
    pointer-events: none;
    z-index: 3;
    position: absolute;
    text-transform: uppercase;
`;

export const CurrencyLabel = styled.label`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    padding: 31px 16px 17px 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    margin-bottom: 20px;
`;

export const ShortInputContainer = styled(InputContainer)`
    width: 50%;
    &:first-child {
        margin-right: 10px;
    }
`;

export const DoubleShortInputContainer = styled(InputContainer)`
    width: 25%;
    &:last-child {
        margin-left: 10px;
    }
`;

export const ReactSelect = styled(Select)<{ isUppercase?: boolean }>`
    text-transform: ${(prop) => (prop.isUppercase ? 'uppercase' : 'none')};
    caret-color: transparent;
    > div:first-of-type {
        height: 64px;
        background: #0a2e66;
        > div:first-of-type div {
            font-weight: bold;
            font-size: 13px;
            line-height: 24px;
            letter-spacing: 0.4px;
            color: #f6f6fe !important;
            padding: 15px 0px 0 11px;
        }
    }
    > div {
        font-weight: bold;
        font-size: 13px;
        line-height: 24px;
        letter-spacing: 0.4px;
        color: #f6f6fe !important;
        background: #0a2e66;
        border: none;
        border-radius: 12px;
        box-shadow: none;
        overflow: hidden;
    }
    & + label {
        z-index: 100;
    }

    svg {
        fill: #f6f6fe;
    }
    .react-select__option--is-selected {
        border: 1px solid #00f9ff;
        box-sizing: border-box;
        border-radius: 10px;
        background: #0a2e66;
    }
    .react-select__option--is-focused {
        background: rgba(45, 131, 210, 0.3);
        border-radius: 10px;
        color: #b8c6e5;
        cursor: pointer;
    }

    .react-select__value-container {
        height: 100%;
    }
    .react-select__menu {
        font-size: 13px;
        padding: 0px 4px;
    }
    .react-select__control:hover {
        border-color: #0a2e66;
        cursor: pointer;
    }
    .react-select__control {
        border: 2px solid #0a2e66;
        box-sizing: border-box;
    }
    .react-select__control--is-focused,
    .react-select__control--menu-is-open,
    .react-select__control--is-focused:hover,
    .react-select__control--menu-is-open:hover {
        border: 2px solid #00f9ff;
        box-sizing: border-box;
        cursor: pointer;
    }
    &.error .react-select__control {
        border: 2px solid #e53720;
    }
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

export const AmountButtonContainer = styled(FlexDivCentered)``;

export const SubmitButtonContainer = styled(FlexDivColumnCentered)`
    margin-top: 40px;
    align-items: center;
`;

export const SubmitButton = styled.button`
    background: ${(props) => props.theme.button.background.primary};
    border-radius: 23px;
    border: none;
    min-height: 40px;
    cursor: pointer;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #f6f6fe;
    padding: 8px 38px;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

export const SummaryContainer = styled.div`
    padding: 0 45px;
`;

export const SummaryItem = styled(FlexDivRow)`
    margin-bottom: 20px;
`;

export const InnerSummaryItem = styled(SummaryItem)`
    margin-left: 20px;
`;

export const SummaryLabel = styled.div<{ color?: string }>`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: ${(props) => props.color ?? '#f6f6fe'};
`;

export const SummaryContent = styled.div<{ color?: string }>`
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    text-align: end;
    color: ${(props) => props.color ?? '#f6f6fe'};
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

export const CloseIconContainer = styled(CloseIcon)`
    :hover {
        cursor: pointer;
    }
    @media (max-width: 512px) {
        margin-top: 4px;
        height: 12px;
        width: 12px;
    }
`;
