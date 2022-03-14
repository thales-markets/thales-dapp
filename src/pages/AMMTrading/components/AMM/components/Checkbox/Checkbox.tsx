import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

type CheckboxPropsType = {
    checked?: boolean;
    container?: {
        size?: string;
    };
    label?: {
        text?: string;
        fontSize?: string;
        color?: string;
    };
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
};

const Checkbox: React.FC<CheckboxPropsType> = ({ checked, container, label, onChange, disabled }) => {
    return (
        <CheckboxContainer checked={checked} inputSize={container?.size}>
            <Label fontSize={label?.fontSize} color={label?.color}>
                {label?.text ? label.text : ''}
            </Label>
            <HiddenCheckbox checked={checked} disabled={disabled} onChange={onChange} />
            <StyledCheckbox checked={checked} size={container?.size}>
                <Icon checked={checked} viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                </Icon>
            </StyledCheckbox>
        </CheckboxContainer>
    );
};

const Label = styled.span<{ fontSize?: string; color?: string }>`
    color: ${(_props) => (_props?.color ? _props?.color : 'var(--primary-color)')};
    font-size: ${(_props) => (_props?.fontSize ? _props?.fontSize : '24px')};
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })<{ size?: string }>`
    border: 0;
    opacity: 0;
    height: ${(_props) => (_props?.size ? _props.size : '32px')};
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: ${(_props) => (_props?.size ? _props.size : '32px')};
`;

const CheckboxContainer = styled.div<{ checked?: boolean; inputSize?: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: ${(_props) => (_props?.checked ? '1 !important' : '0.5 !important')};
    ${HiddenCheckbox} {
        width: ${(_props) => (_props?.inputSize ? _props.inputSize : '32px')};
        height: ${(_props) => (_props?.inputSize ? _props.inputSize : '32px')};
    }
`;

const Icon = styled.svg<{ checked?: boolean }>`
    stroke: ${(_props) => (_props?.checked ? 'var(--input-border-color)' : 'var(--card-border-color)')};
    fill: none;
    stroke-width: 2px;
`;

const StyledCheckbox = styled.div<{ checked?: boolean; size?: string }>`
    cursor: pointer;
    display: inline-block;
    width: ${(_props) => (_props?.size ? _props?.size : '32px')};
    height: ${(_props) => (_props?.size ? _props?.size : '32px')};
    background: transparent;
    border-radius: 3px;
    transition: all 150ms;
    border: 1px solid ${(_props) => (_props?.checked ? 'var(--input-border-color)' : 'var(--card-border-color)')};
    ${HiddenCheckbox}:focus + & {
        box-shadow: 0 0 0 2px rgba(4, 4, 90, 0.4);
    }
    ${Icon} {
        visibility: ${(_props) => (_props?.checked ? 'visible' : 'hidden')};
    }
`;

export default Checkbox;
