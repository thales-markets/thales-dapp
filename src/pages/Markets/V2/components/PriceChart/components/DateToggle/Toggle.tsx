import React, { useState } from 'react';
import styled from 'styled-components';

type ToggleProps = {
    options: { label: string; value: number }[];
    onChange: (value: number) => void;
};

const Toggle: React.FC<ToggleProps> = ({ options, onChange }) => {
    const [activeOption, setActiveOption] = useState(options[0].value);

    const handleClick = (value: number) => {
        setActiveOption(value);
        onChange(value);
    };

    return (
        <Wrapper>
            {options.map(({ label, value }) => (
                <Button key={value} isActive={value === activeOption} onClick={() => handleClick(value)}>
                    {label}
                </Button>
            ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 10px;
`;

const Button = styled.button<{ isActive: boolean }>`
    background-color: ${(props) => (props.isActive ? 'var(--color-highlight)' : 'var(--color-tertiary)')};
    color: ${(props) => (props.isActive ? 'var(--color-primary)' : 'var(--color-white)')};
    font-weight: ${(props) => (props.isActive ? 600 : 400)};
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    margin-right: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: var(--color-secondary);
        color: var(--color-white);
    }

    &:focus {
        outline: none;
    }
`;

export default Toggle;
