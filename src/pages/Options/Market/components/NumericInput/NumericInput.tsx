import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Input } from '../../components';

type NumericInputProps = {
    value: string | number;
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
    className?: string;
    disabled?: boolean;
    step?: string;
    max?: string;
};

const INVALID_CHARS = ['-', '+', 'e'];

const NumericInput: React.FC<NumericInputProps> = ({
    value,
    onChange,
    placeholder,
    className,
    disabled,
    step,
    max,
    ...rest
}) => {
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        onChange(e, value.replace(/,/g, '.').replace(/[e+-]/gi, ''));
    };

    return (
        <StyledInput
            {...rest}
            value={value}
            type="number"
            onChange={handleOnChange}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
            onKeyDown={(e) => {
                if (INVALID_CHARS.includes(e.key)) {
                    e.preventDefault();
                }
            }}
            min="0"
            max={max || 'any'}
            step={step || 'any'}
        />
    );
};

export const StyledInput = styled(Input)``;

export default NumericInput;
