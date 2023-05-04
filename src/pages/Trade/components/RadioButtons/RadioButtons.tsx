import { Positions } from 'constants/options';
import React from 'react';
import styled from 'styled-components';
import { ReactComponent as RadionOn } from 'assets/images/radio-on.svg';
import { ReactComponent as RadionOff } from 'assets/images/radio-off.svg';

type RadioButtonsProps = {
    selected: Positions;
    onChange: React.Dispatch<React.SetStateAction<Positions>>;
};

const RadioButtons: React.FC<RadioButtonsProps> = ({ selected, onChange }) => {
    return (
        <Wrapper>
            {Object.values(Positions).map((position) => {
                return (
                    <RadioWrapper onClick={onChange.bind(this, position)} key={position}>
                        {selected === position ? <RadionOn /> : <RadionOff />}
                        <Label> {position}</Label>
                    </RadioWrapper>
                );
            })}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
`;

const RadioWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
    cursor: pointer;
`;

const Label = styled.span`
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;
    text-transform: uppercase;

    color: ${(props) => props.theme.textColor.secondary};
`;

export default RadioButtons;
