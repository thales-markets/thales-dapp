import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';

export const FieldContainer = styled(FlexDivColumn)<{ width?: string; margin?: string }>`
    flex: initial;
    position: relative;
    ${(props) => (props.width ? `width: ${props.width};` : '')};
    margin: ${(props) => props.margin || '0 0 10px 0'};
`;

export const FieldLabel = styled.label`
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 6px;
    text-transform: uppercase;
`;

export const Input = styled.input<{ fontSize?: string; width?: string; height?: string }>`
    background: ${(props) => props.theme.input.background.primary};
    border: 1px solid ${(props) => props.theme.input.borderColor.primary};
    box-sizing: border-box;
    mix-blend-mode: normal;
    border-radius: 8px;
    height: ${(props) => props.height || '34px'};
    width: ${(props) => props.width || '100%'};
    padding: 5px 10px;
    outline: 0;
    font-style: normal;
    font-weight: normal;
    font-size: ${(props) => props.fontSize || '15px'};
    line-height: 18px;
    color: ${(props) => props.theme.input.textColor.primary};
    text-overflow: ellipsis;
    overflow: hidden;
    &::placeholder {
        color: ${(props) => props.theme.input.textColor.secondary};
    }
    &::selection {
        color: ${(props) => props.theme.input.textColor.tertiary};
        background: ${(props) => props.theme.input.background.selection.primary};
    }
    &:focus {
        border: 1px solid ${(props) => props.theme.input.borderColor.focus.primary};
        box-sizing: border-box;
    }
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
    &.error {
        border: 1px solid ${(props) => props.theme.input.borderColor.error.primary};
    }
`;
