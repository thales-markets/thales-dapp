import React from 'react';
import Container from './styled-components/Container';
import Footer from './styled-components/Footer';

type RangeSliderProps = {
    min: number;
    max: number;
    defaultValue: number;
    step?: number;
    showFooter?: boolean;
    footerText?: string | Array<string>;
    showInFooterMinMax?: boolean;
    onChangeEventHandler?: (value: number) => void;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    defaultValue,
    step,
    showFooter,
    footerText,
    showInFooterMinMax,
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
            {showInFooterMinMax && (
                <Footer justifyContent="space-between">
                    <span>{footerText?.length ? footerText[0] : ''}</span>
                    <span>{footerText?.length ? footerText[1] : ''}</span>
                </Footer>
            )}
        </>
    );
};

export default RangeSlider;
