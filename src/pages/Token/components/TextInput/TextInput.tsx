import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { Input } from '../components';

type TextInputProps = {
    value: string | number;
    placeholder?: string;
    onChange: any;
    className?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    style?: CSSProperties;
};

const TextInput: React.FC<TextInputProps> = ({
    value,
    onChange,
    placeholder,
    className,
    disabled,
    autoFocus,
    ...rest
}) => {
    return (
        <StyledInput
            {...rest}
            value={value}
            type="text"
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
            autoFocus={autoFocus}
        />
    );
};

export const StyledInput = styled(Input)`
    text-overflow: ellipsis;
    padding: 14px 20px 0 20px;
`;

export default TextInput;
