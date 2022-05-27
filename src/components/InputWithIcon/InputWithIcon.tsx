import React, { CSSProperties } from 'react';
import styled from 'styled-components';

type InputProps = {
    placeholder: string;
    text: string;
    handleChange: (event: any) => void;
    customIconClass?: string;
    inputStyle?: CSSProperties;
};

const InputWithIcon: React.FC<InputProps> = ({ placeholder, text, handleChange, customIconClass, inputStyle }) => {
    return (
        <Wrapper>
            <InputField
                type="text"
                placeholder={placeholder}
                defaultValue={text}
                onChange={(event) => handleChange(event.target.value)}
                style={inputStyle}
            />
            <Icon className={customIconClass ? customIconClass : 'icon icon--search'} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    align-self: flex-start;
`;

const InputField = styled.input`
    border: 1px solid var(--input-border-color);
    background: rgba(0, 0, 0, 0);
    border-radius: 30px;
    color: var(--input-border-color);
    width: 100%;
    height: 28px;
    padding-left: 10px;
    padding-right: 25px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    &::placeholder {
        color: var(--input-border-color);
    }
`;

const Icon = styled.i`
    font-size: 15px;
    color: var(--input-border-color);
    position: absolute;
    right: 8px;
`;

export default InputWithIcon;
