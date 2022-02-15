import React from 'react';
import styled from 'styled-components';

type SearchFieldProps = {
    text: string;
    handleChange: (event: any) => void;
};

const SearchField: React.FC<SearchFieldProps> = ({ text, handleChange }) => {
    return (
        <Wrapper>
            <InputField
                type="text"
                placeholder="Enter search text"
                defaultValue={text}
                onChange={(event) => handleChange(event.target.value)}
            />
            <Icon className="icon icon--search" />
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
    width: 180px;
    height: 28px;
    padding-left: 10px;
    padding-right: 25px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box
    box-sizing: border-box; 
`;

const Icon = styled.i`
    font-size: 15px;
    color: var(--input-border-color);
    position: absolute;
    right: 8px;
`;

export default SearchField;
