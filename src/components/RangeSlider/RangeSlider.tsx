import React from 'react';
import { Container, Footer, Slider, Wrapper } from './styled-components';

type RangeSliderProps = {
    min: number;
    max: number;
    defaultValue: number;
    step?: number;
    showFooter?: boolean;
    footerText?: string | Array<string>;
    showInFooterMinMax?: boolean;
    container?: {
        margin?: string;
        padding?: string;
    };
    onChangeEventHandler?: (value: number) => void;
    disabled?: boolean;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    defaultValue,
    step,
    showFooter,
    footerText,
    showInFooterMinMax,
    container,
    onChangeEventHandler,
    disabled,
}) => {
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof onChangeEventHandler == 'function') {
            onChangeEventHandler(event.currentTarget.valueAsNumber);
        }
    };

    return (
        <Wrapper disabled={disabled} margin={container?.margin} padding={container?.padding}>
            <Container>
                <Slider
                    type="range"
                    min={min}
                    max={max}
                    value={defaultValue}
                    step={step || '0.1'}
                    onChange={(event) => onChangeHandler(event)}
                    disabled={disabled}
                />
            </Container>
            {showFooter && <Footer>{footerText}</Footer>}
            {showInFooterMinMax && (
                <Footer justifyContent="space-between">
                    <span>{footerText?.length ? footerText[0] : ''}</span>
                    <span>{footerText?.length ? footerText[1] : ''}</span>
                </Footer>
            )}
        </Wrapper>
    );
};

export default RangeSlider;
