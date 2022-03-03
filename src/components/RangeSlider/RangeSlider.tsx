import React, { useState } from 'react';
import Container from './styled-components/Container';
import Footer from './styled-components/Footer';

type RangeSliderProps = {
    min: number;
    max: number;
    defaultValue: number;
    step?: number;
    showFooter?: boolean;
    footerText?: string;
};

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, defaultValue, step, showFooter, footerText }) => {
    const [currentValue, setValue] = useState<number>(defaultValue);

    return (
        <>
            <Container>
                <Container.Slider
                    type="range"
                    min={min}
                    max={max}
                    value={currentValue}
                    step={step ? step : '0.1'}
                    onChange={(event) => setValue(event.currentTarget.valueAsNumber)}
                />
            </Container>
            {showFooter && <Footer>{footerText}</Footer>}
        </>
    );
};

export default RangeSlider;
