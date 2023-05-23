import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

type RadioButtonProps = {
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    disabled?: boolean;
    checked: boolean;
    label?: string;
};

const RadioButton: React.FC<RadioButtonProps> = ({ value, onChange, className, disabled, checked, label, ...rest }) => {
    return (
        <Container className={disabled ? 'disabled' : ''}>
            {label}
            <Input
                {...rest}
                type="radio"
                checked={checked}
                value={value}
                onChange={onChange}
                className={className}
                disabled={disabled}
            />
            <Checkmark className="checkmark" checked={checked} />
        </Container>
    );
};

const Input = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
`;

const Container = styled.label`
    display: flex;
    position: relative;
    padding-left: 26px;
    cursor: pointer;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    min-height: 24px;
    color: #f6f6fe;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    input:checked ~ .checkmark {
        background-color: transparent;
    }
    input:checked ~ .checkmark:after {
        display: block;
    }
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
    :first-child {
        margin-bottom: 4px;
    }
    align-self: start;
`;

const Checkmark = styled.span<{ checked: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    border: 3px solid ${(props) => (props.checked ? '#f6f6fe' : '#f6f6fe')};
    background-color: transparent;
    border-radius: 50%;
    margin-top: 0px;
    :after {
        content: '';
        position: absolute;
        display: none;
        left: 2px;
        top: 2px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f6f6fe;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

export default RadioButton;
