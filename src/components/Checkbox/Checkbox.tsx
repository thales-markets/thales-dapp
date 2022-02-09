import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

type CheckboxProps = {
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    disabled?: boolean;
    checked: boolean;
    label?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ value, onChange, className, disabled, checked, label, ...rest }) => {
    return (
        <CheckboxContainer className={disabled ? 'disabled' : ''}>
            {label}
            <CheckboxInput
                {...rest}
                type="checkbox"
                checked={checked}
                value={value}
                onChange={onChange}
                className={className}
                disabled={disabled}
            />
            <Checkmark className="checkmark" />
        </CheckboxContainer>
    );
};

const CheckboxInput = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
`;

const CheckboxContainer = styled.label`
    display: block;
    position: relative;
    padding-left: 25px;
    margin-bottom: 10px;
    cursor: pointer;
    font-style: normal;
    font-weight: bold;
    font-size: 13px;
    line-height: 24px;
    letter-spacing: 0.4px;
    color: #f6f6fe;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    input:checked ~ .checkmark {
        background-color: #f6f6fe;
    }
    input:checked ~ .checkmark:after {
        display: block;
    }
    &.disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

const Checkmark = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    height: 15px;
    width: 15px;
    border: 1px solid #f6f6fe;
    background-color: transparent;
    border-radius: 2px;
    margin-top: 4px;
    :after {
        content: '';
        position: absolute;
        display: none;
        left: 3px;
        top: -2px;
        width: 5px;
        height: 10px;
        border: solid #04045a;
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

export default Checkbox;
