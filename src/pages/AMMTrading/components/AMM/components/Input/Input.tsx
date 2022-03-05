import React from 'react';
import Container from './styled-components/Container';

type InputProps = {
    title: string;
    titleColor?: string;
    titleFontSize?: string;
    value: string | number;
    valueChange?: (value: string | number) => void;
    valueType?: string;
    valueEditDisable?: boolean;
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
    valueType,
    valueEditDisable,
    valueColor,
    valueFontSize,
    subValue,
    subValueColor,
    subValueFontSize,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof valueChange == 'function') {
            valueChange(e.target.value);
        }
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
                    value={value}
                    onChange={handleChange}
                    disabled={valueEditDisable}
                    type={valueType ? valueType : ''}
                />
                <Container.ValueContainer.SubValue color={subValueColor} fontSize={subValueFontSize}>
                    {subValue}
                </Container.ValueContainer.SubValue>
            </Container.ValueContainer>
        </Container>
    );
};

export default Input;
