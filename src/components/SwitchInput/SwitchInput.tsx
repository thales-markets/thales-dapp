import React from 'react';
import styled from 'styled-components';

type SwitchInputProps = {
    value: boolean;
    clickEventHandler: () => void;
};

export const SwitchInput: React.FC<SwitchInputProps> = ({ value, clickEventHandler }) => {
    return (
        <SwitchContainer
            onClick={() => {
                clickEventHandler();
            }}
        >
            <Slider switchValue={value} />
        </SwitchContainer>
    );
};

const SwitchContainer = styled.div`
    width: 48px;
    height: 22px;
    position: relative;
    background: linear-gradient(256.68deg, #8208fc 6.58%, #64d9fe 102.94%);
    border: 2px solid var(--icon-color);
    box-sizing: border-box;
    border-radius: 30px;
    cursor: pointer;
    display: inline-block;
`;

const Slider = styled.span<{ switchValue: boolean }>`
    border-radius: 50%;
    position: absolute;
    top: 3px;
    left: ${(props) => (!props.switchValue ? '3px' : '')};
    right: ${(props) => (props.switchValue ? '3px' : '')};
    width: 12px;
    height: 12px;
    background-color: var(--icon-color);
`;

export default SwitchInput;
