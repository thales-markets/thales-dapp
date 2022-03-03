import React, { useState } from 'react';
import Container from './styled-components/Container';

type InputProps = {
    title: string;
    titleColor?: string;
    titleFontSize?: string;
    value: string | number;
    valueChange?: (value: string | number) => void;
    valueColor?: string;
    valueFontSize?: string;
    subValue?: string;
    subValueColor?: string;
    subValueFontSize?: string;
    displayTooltip?: boolean;
    tooltipText?: string;
};

const Input: React.FC<InputProps> = ({
    title,
    titleColor,
    titleFontSize,
    value,
    valueChange,
    valueColor,
    valueFontSize,
    subValue,
    subValueColor,
    subValueFontSize,
}) => {
    const [defaultValue, setDefaultValue] = useState<string | number>(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (valueChange) {
            valueChange(e.target.value);
        }
        setDefaultValue(e.target.value);
    };

    return (
        <Container>
            <Container.Title color={titleColor} fontSize={titleFontSize}>
                {title}
            </Container.Title>
            <Container.ValueContainer>
                <Container.ValueContainer.Value
                    color={valueColor}
                    fontSize={valueFontSize}
                    value={defaultValue}
                    onChange={handleChange}
                />
                <Container.ValueContainer.SubValue color={subValueColor} fontSize={subValueFontSize}>
                    {subValue}
                </Container.ValueContainer.SubValue>
            </Container.ValueContainer>
        </Container>
    );
};

export default Input;
