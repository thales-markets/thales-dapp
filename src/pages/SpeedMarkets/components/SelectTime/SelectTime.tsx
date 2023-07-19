import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow } from 'styles/common';

type SelectTimeProps = {
    selectedDeltaSec: number;
    selectedTime: number;
    onDeltaChange: React.Dispatch<number>;
    onTimeChange: React.Dispatch<number>;
};

const deltaTimes = [1, 4, 12, 24]; // in hours TODO: check if this could be calculated from contract

const SelectTime: React.FC<SelectTimeProps> = ({ selectedDeltaSec, onDeltaChange, onTimeChange }) => {
    const [isDeltaSelected, setIsDeltaSelected] = useState(true);

    return (
        <Container>
            <Row>
                {deltaTimes.map((delta, index) => {
                    const deltaInSeconds = delta * 60 * 60;
                    return (
                        <DeltaTime
                            key={index}
                            isSelected={isDeltaSelected && selectedDeltaSec === deltaInSeconds}
                            onClick={() => {
                                setIsDeltaSelected(true);
                                onDeltaChange(deltaInSeconds);
                                onTimeChange(0);
                            }}
                        >{`${delta}h`}</DeltaTime>
                    );
                })}
                <Time
                    isSelected={!isDeltaSelected}
                    onClick={() => {
                        setIsDeltaSelected(false);
                        onDeltaChange(0);
                    }}
                >
                    <Icon className="icon icon--clock" />
                </Time>
            </Row>
            <Row></Row>
        </Container>
    );
};

const Container = styled.div``;

const Row = styled(FlexDivRow)``;

const Time = styled(FlexDivCentered)<{ isSelected: boolean }>`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${(props) =>
        props.isSelected ? props.theme.button.background.primary : props.theme.button.background.tertiary};
    color: ${(props) =>
        props.isSelected ? props.theme.button.textColor.primary : props.theme.button.textColor.secondary};
    cursor: pointer;
    padding-left: 1px;
    font-weight: ${(props) => (props.isSelected ? '600' : '300')};
`;

const DeltaTime = styled(Time)`
    font-weight: 600;
    font-size: 13px;
    line-height: 90%;
`;

const Icon = styled.i`
    font-size: 20px;
    line-height: 100%;
    color: inherit;
`;

export default SelectTime;
