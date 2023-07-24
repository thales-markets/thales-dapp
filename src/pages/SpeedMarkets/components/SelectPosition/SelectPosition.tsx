import { Positions } from 'enums/options';
import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';

type SelectPositionProps = {
    selected: Positions.UP | Positions.DOWN | undefined;
    onChange: React.Dispatch<Positions.UP | Positions.DOWN>;
};

const SelectPosition: React.FC<SelectPositionProps> = ({ selected, onChange }) => {
    return (
        <Container>
            <PositionWrapper onClick={() => onChange(Positions.UP)}>
                <LabelUp isSelected={selected !== undefined ? selected === Positions.UP : undefined}>
                    {Positions.UP}
                </LabelUp>
                <PositionSymbolUp isSelected={selected !== undefined ? selected === Positions.UP : undefined}>
                    <Icon className="icon icon--caret-up" />
                </PositionSymbolUp>
            </PositionWrapper>
            <Separator />
            <PositionWrapper onClick={() => onChange(Positions.DOWN)}>
                <PositionSymbolDown isSelected={selected !== undefined ? selected === Positions.DOWN : undefined}>
                    <Icon className="icon icon--caret-down" />
                </PositionSymbolDown>
                <LabelDown isSelected={selected !== undefined ? selected === Positions.DOWN : undefined}>
                    {Positions.DOWN}
                </LabelDown>
            </PositionWrapper>
        </Container>
    );
};

const Container = styled(FlexDivCentered)``;

const PositionWrapper = styled(FlexDivCentered)`
    cursor: pointer;
`;

const PositionSymbol = styled(FlexDivCentered)`
    width: 36px;
    height: 36px;
    border-radius: 50%;
`;

const PositionSymbolUp = styled(PositionSymbol)<{ isSelected?: boolean }>`
    border: 3px solid
        ${(props) =>
            props.isSelected === undefined
                ? props.theme.borderColor.primary
                : props.isSelected
                ? props.theme.positionColor.up
                : props.theme.borderColor.primary};
    color: ${(props) =>
        props.isSelected === undefined || props.isSelected
            ? props.theme.positionColor.up
            : props.theme.borderColor.primary};
`;

const PositionSymbolDown = styled(PositionSymbol)<{ isSelected?: boolean }>`
    border: 3px solid
        ${(props) =>
            props.isSelected === undefined
                ? props.theme.borderColor.primary
                : props.isSelected
                ? props.theme.positionColor.down
                : props.theme.borderColor.primary};
    color: ${(props) =>
        props.isSelected === undefined || props.isSelected
            ? props.theme.positionColor.down
            : props.theme.borderColor.primary};
`;

const Icon = styled.i`
    font-size: 18px;
    line-height: 100%;
    color: inherit;
`;

const Label = styled.span`
    font-size: 18px;
    font-weight: 700;
    line-height: 100%;
    text-transform: capitalize;
`;

const LabelUp = styled(Label)<{ isSelected?: boolean }>`
    color: ${(props) =>
        props.isSelected === undefined
            ? props.theme.textColor.primary
            : props.isSelected
            ? props.theme.positionColor.up
            : props.theme.borderColor.primary};
    margin-right: 7px;
`;

const LabelDown = styled(Label)<{ isSelected?: boolean }>`
    color: ${(props) =>
        props.isSelected === undefined
            ? props.theme.textColor.primary
            : props.isSelected
            ? props.theme.positionColor.down
            : props.theme.borderColor.primary};
    margin-left: 7px;
`;

const Separator = styled.div`
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
    width: 3px;
    height: 36px;
    border-radius: 6px;
    margin: 0 14px;
`;

export default SelectPosition;
