import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { Input } from 'components/OldVersion/old-components';

type TextInputProps = {
    value: string | number;
    placeholder?: string;
    onChange: any;
    className?: string;
    disabled?: boolean;
    style?: CSSProperties;
};

const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder, className, disabled, ...rest }) => {
    return (
        <StyledInput
            {...rest}
            value={value}
            type="text"
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
        />
    );
};

export const StyledInput = styled(Input)`
    text-overflow: ellipsis;
    padding: 14px 20px 0 20px;
`;

export default TextInput;
