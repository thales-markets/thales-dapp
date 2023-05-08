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
            {Object.values(Positions).map((position, index) => {
                return (
                    <>
                        <RadioWrapper onClick={onChange.bind(this, position)} key={index}>
                            {selected === position ? <RadionOn /> : <RadionOff />}
                            <Label> {position}</Label>
                        </RadioWrapper>
                        {index === 1 && <Separator />}
                    </>
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

const Separator = styled.div`
    background: ${(props) => props.theme.textColor.secondary};
    border-radius: 3px;
    width: 2px;
    height: 15px;
`;

export default RadioButtons;
