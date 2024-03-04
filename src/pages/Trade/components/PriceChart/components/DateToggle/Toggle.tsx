import Button from 'components/Button';
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';

type ToggleProps = {
    options: { label: string; value: number; resolution: string }[];
    onChange: (value: number) => void;
    selectedIndex?: number;
};

const Toggle: React.FC<ToggleProps> = ({ options, onChange, selectedIndex }) => {
    const theme: ThemeInterface = useTheme();

    const handleClick = (value: number) => {
        onChange(value);
    };

    return (
        <Wrapper>
            {options.map(({ label, resolution }, index) => (
                <Button
                    key={resolution}
                    width="35px"
                    height="31px"
                    textColor={theme.button.textColor.tertiary}
                    backgroundColor={
                        index === selectedIndex ? theme.button.background.tertiary : theme.button.background.secondary
                    }
                    borderColor={theme.button.borderColor.tertiary}
                    fontSize="13px"
                    padding="0"
                    additionalStyles={{
                        borderRadius: '8px',
                        transition: 'all 0.2s ease-in-out',
                        textTransform: 'none',
                    }}
                    onClick={() => handleClick(index)}
                >
                    {label}
                </Button>
            ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
`;

export default Toggle;
