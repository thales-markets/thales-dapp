import { MARKET_TYPE } from 'constants/options';
import React, { useState } from 'react';
import styled from 'styled-components';

type ToggleButtonProps = {
    onToggle: React.Dispatch<React.SetStateAction<number | 'positional' | 'ranged'>>;
    state: number | 'positional' | 'ranged';
};

const ToggleButton: React.FC<ToggleButtonProps> = ({ onToggle, state }) => {
    const [isOn, setIsOn] = useState(state === MARKET_TYPE.positional);

    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
        onToggle(state === MARKET_TYPE.positional ? MARKET_TYPE.ranged : MARKET_TYPE.positional);
    };

    return (
        <Button onClick={handleToggle} isOn={isOn}>
            <ImageContainer blur={!isOn}>
                <Icon className={`sidebar-icon icon--markets`} />
            </ImageContainer>
            <ImageContainer blur={isOn}>
                <Icon className={`sidebar-icon icon--ranged-markets`} />
            </ImageContainer>
        </Button>
    );
};

const Button = styled.button<{ isOn: boolean }>`
    background-color: var(--color-primary);
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
`;

const Icon = styled.i`
    color: var(--color-highlight);
    font-size: 42px;
`;

const ImageContainer = styled.div<{ blur: boolean }>`
    flex: 1;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    filter: ${({ blur }) => (blur ? 'blur(2px)' : 'none')};
`;

export default ToggleButton;
