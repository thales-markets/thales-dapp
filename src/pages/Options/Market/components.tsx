import React from 'react';
import Select from 'components/Select';
import { COLORS } from 'constants/ui';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, GridDivCol, FlexDivColumnCentered } from 'theme/common';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';
import { ReactComponent as QuestionMarkIcon } from 'assets/images/question-mark-circle.svg';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';

export const Container = styled(FlexDivColumn)`
    padding: 15px;
`;

export const GridContainer = styled(GridDivCol)`
    column-gap: 10px;
`;

export const Input = styled.input`
    background: #0a2e66;
    border: 2px solid #0a2e66;
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
    color: #f6f6fe;
    &::selection {
        color: #04045a;
        background: #f6f6fe;
    }
    &:focus {
        border: 2px solid #00f9ff;
        box-sizing: border-box;
    }
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
    &.error {
        border: 2px solid #e53720;
    }
`;

export const InputLabel = styled.label`
    font-weight: bold;
    font-size: 10px;
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

export const AmountButton = styled.button`
    background: transparent;
    border: 2px solid #0a2e66;
    border-radius: 5px;
    min-height: 28px;
    width: 58px;
    cursor: pointer;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    margin: 0 12px 20px 12px;
    padding-bottom: 2px;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
    &.selected {
        background: #0a2e66;
        border: 2px solid #00f9ff;
        color: #00f9ff;
    }
    &:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.8);
        border: 2px solid #0a2e66;
        color: #b8c6e5;
    }
    &.selected:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.8);
        border: 2px solid #00f9ff;
        color: #b8c6e5;
    }
`;

export const SubmitButtonContainer = styled(FlexDivColumnCentered)`
    margin-top: 40px;
    align-items: center;
`;

export const SubmitButton = styled.button<{ isBuy?: boolean }>`
    background: ${(prop) => (prop.isBuy ? COLORS.BUY : COLORS.SELL)};
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
    &.selected,
    &:hover:not(:disabled) {
        background: ${(prop) => (prop.isBuy ? '#00E4B8' : '#e53720')};
    }
`;

export const DefaultSubmitButton = styled(SubmitButton)`
    background: #3936c7;
    &.selected,
    &:hover:not(:disabled) {
        background: #7119e1;
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

export const FilterButton = styled.button`
    border: 2px solid #0a2e66;
    border-radius: 20px;
    min-height: 32px;
    background-color: transparent;
    cursor: pointer;
    margin-left: 10px;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    margin: 0 9px;
    padding: 6px 16px;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
    &:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.8);
        border: 2px solid #0a2e66;
        color: #b8c6e5;
    }
    &.selected {
        background: #0a2e66;
        border: 2px solid #00f9ff;
        color: #00f9ff;
    }
    &.selected:hover {
        background: rgba(1, 38, 81, 0.8);
        border: 2px solid #00f9ff;
        color: #b8c6e5;
    }
`;

export const SliderRange = styled.div<{ color?: string }>`
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.4px;
    color: ${(props) => props.color ?? '#f6f6fe'};
`;

export const SliderContainer = styled.div`
    position: relative;
    width: 50%;
    padding: 0 20px 0 5px;
    margin-top: 15px;
`;

export const BuySellSliderContainer = styled(SliderContainer)`
    margin-right: 10px;
    padding: 0 10px;
`;

export const WalletContainer = styled(FlexDivColumn)`
    align-items: end;
    margin-right: 20px;
    margin-left: 7px;
`;

export const Wallet = styled.div<{ color?: string }>`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.25px;
    color: ${(props) => (props.color ? props.color : '#f6f6fe')};
`;

export const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 2px solid #0a2e66;
`;

type TooltipIconProps = {
    disableHoverListener?: boolean;
    title: React.ReactNode;
    children: any;
};

const StyledDarkTooltip = withStyles(() => ({
    arrow: {
        color: '#0A2E66',
    },
    tooltip: {
        background: '#0A2E66',
        borderRadius: '10px',
        padding: '10px',
        fontSize: '10px',
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: '#F6F6FE',
    },
}))(MaterialTooltip);

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

export const DarkTooltip: React.FC<TooltipIconProps> = ({ title, children }) => (
    <StyledDarkTooltip title={<span>{title}</span>} placement="top" arrow={true}>
        {children}
    </StyledDarkTooltip>
);

export const ProtocolFeeContainer = styled(FlexDivRow)`
    margin-top: 5px;
    margin-bottom: 10px;
`;

export const ProtocolFeeLabel = styled(SummaryLabel)`
    font-size: 13px;
    line-height: 24px;
`;

export const ProtocolFeeItem = styled(SummaryContent)`
    font-size: 13px;
    line-height: 24px;
`;

export const StyledQuestionMarkIcon = styled(QuestionMarkIcon)`
    min-width: 12px;
    min-height: 12px;
    margin-left: 4px;
    margin-bottom: -1px;
`;

export const StyledInfoIcon = styled(InfoIcon)`
    cursor: pointer;
    margin-left: 10px;
`;
