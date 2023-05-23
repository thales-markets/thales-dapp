import React from 'react';
import { COLORS } from 'constants/ui';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, GridDivCol, FlexDivColumnCentered } from 'theme/common';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';
import { ReactComponent as QuestionMarkIcon } from 'assets/images/question-mark-circle.svg';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import { ReactComponent as CloseIcon } from 'assets/images/close.svg';

export const Container = styled(FlexDivColumn)`
    padding: 15px;
`;

export const GridContainer = styled(GridDivCol)`
    column-gap: 10px;
`;

export const Input = styled.input`
    background: var(--color-primary);
    border: 1px solid ${(props) => props.theme.input.borderColor.primary};
    box-sizing: border-box;
    mix-blend-mode: normal;
    border-radius: 12px;
    height: 78px;
    padding: 14px 68px 0 15px;
    outline: 0;
    font-weight: 600;
    font-size: 20px;
    line-height: 18px;
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
        border: 2px solid #e53720;
    }

    @media (max-width: 767px) {
        height: 60px;
        font-size: 13px;
    }
`;

export const InputLabel = styled.label`
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: ${(props) => props.theme.input.textColor.primary};
    padding: 8px 0 0 15px;
    pointer-events: none;
    z-index: 3;
    position: absolute;
    text-transform: uppercase;
    @media (max-width: 1192px) {
        font-size: 9px;
    }
    @media (max-width: 768px) {
        font-size: 12px;
        padding-left: 10px;
    }
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

export const CurrencyLabel = styled.label`
    font-weight: 600;
    font-size: 20px;
    line-height: 18px;
    letter-spacing: 0.25px;
    color: ${(props) => props.theme.input.textColor.primary};
    padding: 36px 16px 17px 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
    @media (max-width: 767px) {
        font-size: 18px;
        padding-top: 33px;
    }
`;

export const InputContainer = styled.div<{ marginTop?: number; mediaMarginBottom?: number }>`
    display: flex;
    flex-direction: column;
    position: relative;
    ${(props) => (props.marginTop ? 'margin-top: ' + props.marginTop + 'px;' : '')}
    margin-bottom: 20px;
    @media (max-width: 1192px) {
        ${(props) => (props.mediaMarginBottom ? 'margin-bottom: ' + props.mediaMarginBottom + 'px;' : '')}
    }
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
    color: ${(props) => props.theme.button.textColor.primary};
    padding: 8px 38px;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

export const DefaultSubmitButton = styled(SubmitButton)`
    background: ${(props) => props.theme.button.background.primary};
    &.selected,
    &:hover:not(:disabled) {
        background: ${(props) => props.theme.button.borderColor.secondary};
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
    @media (max-width: 768px) {
        width: 100px;
    }
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
    &.selected:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.8);
        border: 2px solid #00f9ff;
        color: #b8c6e5;
    }
    @media (max-width: 767px) {
        font-size: 12px;
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

export const BetaBadge = styled.div`
    background-color: #3cb55b;
    border-radius: 5px;
    color: #f6f6fe;
    display: inline-block;
    font-size: 10px;
    line-height: 10px;
    padding: 2px 4px;
    margin-bottom: 15px;
    margin-left: 2px;
`;

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
