import React from 'react';

import Container from './styled-components/Container';

type SlippageProps = {
    fixed?: Array<number>;
    defaultValue?: number;
    onChangeHandler?: (value: number) => void;
};

const Slippage: React.FC<SlippageProps> = ({ fixed, defaultValue, onChangeHandler }) => {
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement> | number) => {
        let newValue = 0;

        if (typeof event == 'number' && typeof onChangeHandler == 'function') {
            return onChangeHandler(event);
        }

        if (typeof event !== 'number') {
            if (Number(event.target.value) > 100) {
                newValue = 100;
            } else if (Number(event.target.value) < 0) {
                newValue = 0;
            } else {
                newValue = Number(event.target.value);
            }
        }

        if (typeof onChangeHandler !== 'undefined') {
            onChangeHandler(newValue);
        }
    };

    const clickHandler = (arg: number) => {
        changeHandler(arg);
        return;
    };

    return (
        <Container>
            <Container.Title>Slippage Tolerance</Container.Title>
            <Container.ValueContainer>
                {fixed?.length &&
                    fixed.length > 0 &&
                    fixed?.map((percentage, index) => {
                        return (
                            <Container.ValueContainer.Fixed
                                key={index}
                                active={defaultValue == percentage}
                                onClick={() => clickHandler(percentage)}
                            >{`${percentage}%`}</Container.ValueContainer.Fixed>
                        );
                    })}
                <Container.ValueContainer.SlippageInput>
                    <Container.ValueContainer.SlippageInput.InputField
                        type="number"
                        value={defaultValue}
                        onChange={(event) => changeHandler(event)}
                    />
                    <Container.ValueContainer.SlippageInput.Percentage>
                        {'%'}
                    </Container.ValueContainer.SlippageInput.Percentage>
                </Container.ValueContainer.SlippageInput>
            </Container.ValueContainer>
        </Container>
    );
};

export default Slippage;
