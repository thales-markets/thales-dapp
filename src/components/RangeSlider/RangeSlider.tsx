import React from 'react';
import Container from './styled-components/Container';
import Footer from './styled-components/Footer';

type RangeSliderProps = {
    min: number;
    max: number;
    defaultValue: number;
    step?: number;
    showFooter?: boolean;
    footerText?: string;
    onChangeEventHandler?: (value: number) => void;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    defaultValue,
    step,
    showFooter,
    footerText,
    onChangeEventHandler,
}) => {
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof onChangeEventHandler == 'function') {
            onChangeEventHandler(event.currentTarget.valueAsNumber);
        }
    };

    return (
        <>
            <Container>
                <Container.Slider
                    type="range"
                    min={min}
                    max={max}
                    value={defaultValue}
                    step={step ? step : '0.1'}
                    onChange={(event) => onChangeHandler(event)}
                />
            </Container>
            {showFooter && <Footer>{footerText}</Footer>}
        </>
    );
};

export default RangeSlider;
