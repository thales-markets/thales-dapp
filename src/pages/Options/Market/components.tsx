import Select from 'components/Select';
import { COLORS } from 'constants/ui';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, GridDivCol } from 'theme/common';

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
    padding: 14px 0px 0 20px;
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
        opacity: 0.5;
        cursor: default;
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
    position: absolute;
    text-transform: uppercase;
`;

export const CurrencyLabel = styled.label`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    padding: 0 16px 17px 0;
    pointer-events: none;
    position: absolute;
    bottom: 0;
    right: 0;
    &.disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    margin-bottom: 20px;
`;

export const ReactSelect = styled(Select)<{ isUppercase?: boolean }>`
    text-transform: ${(prop) => (prop.isUppercase ? 'uppercase' : 'none')};
    > div:first-of-type {
        height: 64px;
        background: #0a2e66;
        > div:first-of-type {
            * {
                font-weight: bold;
                font-size: 13px;
                line-height: 24px;
                letter-spacing: 0.4px;
                color: #f6f6fe !important;
                padding: 15px 0px 0 11px;
            }
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
    .react-select__menu {
        padding: 0px 4px;
    }
    .react-select__control:hover {
        border-color: #0a2e66;
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
        opacity: 0.5;
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
        color: #b8c6e5;
    }
`;

export const SubmitButtonContainer = styled(FlexDivCentered)`
    margin-top: 30px;
`;

export const SubmitButton = styled.button<{ isBuy?: boolean }>`
    background: ${(prop) => (prop.isBuy ? COLORS.BUY : COLORS.SELL)};
    border-radius: 23px;
    border: none;
    min-height: 40px;
    cursor: pointer;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    padding: 8px 38px;
    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
    &.selected,
    &:hover:not(:disabled) {
        color: #04045a;
    }
`;

export const SummaryItem = styled(FlexDivRow)`
    padding: 0 45px;
    margin-bottom: 20px;
`;

export const SummaryLabel = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: #f6f6fe;
`;

export const SummaryContent = styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
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
    &:hover {
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
        color: #b8c6e5;
    }
`;
