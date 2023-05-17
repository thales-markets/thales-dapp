import { Positions } from 'constants/options';
import React from 'react';
import styled from 'styled-components';

type RadioButtonsProps = {
    selected: Positions;
    onChange: React.Dispatch<React.SetStateAction<Positions>>;
};

const RadioButtons: React.FC<RadioButtonsProps> = ({ selected, onChange }) => {
    return (
        <Wrapper>
            {Object.values(Positions).map((position, index) => {
                return (
                    <React.Fragment key={index}>
                        <RadioWrapper onClick={onChange.bind(this, position)} key={index}>
                            {selected === position ? (
                                <RadioIcon className="icon icon--radio-button-selected" />
                            ) : (
                                <RadioIcon className="icon icon--radio-button" />
                            )}
                            <Label> {position}</Label>
                        </RadioWrapper>
                        {index === 1 && <Separator />}
                    </React.Fragment>
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

    color: ${(props) => props.theme.textColor.primary};
`;

const Separator = styled.div`
    background: ${(props) => props.theme.textColor.primary};
    border-radius: 3px;
    width: 2px;
    height: 15px;
`;

const RadioIcon = styled.i`
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.textColor.primary};
`;

export default RadioButtons;
