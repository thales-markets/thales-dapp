import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import React, { ChangeEvent, CSSProperties } from 'react';
import styled from 'styled-components';
import { Input } from 'pages/Token/components/components';

type NumericInputProps = {
    value: string | number;
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
    className?: string;
    disabled?: boolean;
    step?: string;
    max?: string;
    style?: CSSProperties;
    autoFocus?: boolean;
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

        let trimmedValue = value;
        if (value.indexOf('.') > -1) {
            const numberOfDecimals = value.split('.')[1].length;
            if (numberOfDecimals > DEFAULT_TOKEN_DECIMALS) {
                trimmedValue = value.substring(0, value.length - 1);
            }
        }

        onChange(e, trimmedValue.replace(/,/g, '.').replace(/[e+-]/gi, ''));
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

export const StyledInput = styled(Input)`
    text-overflow: ellipsis;
    @media (max-width: 767px) {
        font-size: 18px;
        padding: 19px 0 0 10px;
    }
`;

export default NumericInput;
