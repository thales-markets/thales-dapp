import React, { useState } from 'react';
import styled from 'styled-components';

type ToggleProps = {
    options: { label: string; value: number }[];
    onChange: (value: number) => void;
    defaultSelectedIndex?: number;
};

const Toggle: React.FC<ToggleProps> = ({ options, onChange, defaultSelectedIndex = 0 }) => {
    const [activeOption, setActiveOption] = useState(options[defaultSelectedIndex].value);

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
    justify-content: center;
    gap: 6px;
`;

const Button = styled.button<{ isActive: boolean }>`
    background-color: ${(props) => (props.isActive ? 'var(--color-secondary)' : 'var(--color-primary)')};
    border: 1px solid #2b3139;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    max-width: 35px;
    width: 100%;
    height: 31px;

    font-size: 13px;
    line-height: 13px;
    font-weight: 600;
    color: var(--color-text);
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
