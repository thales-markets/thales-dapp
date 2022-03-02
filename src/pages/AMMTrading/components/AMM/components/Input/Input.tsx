import React, { useState } from 'react';
import Container from './styled-components/Container';

type InputProps = {
    title: string;
    titleColor?: string;
    titleFontSize?: string;
    value: string | number;
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
    valueColor,
    valueFontSize,
    subValue,
    subValueColor,
    subValueFontSize,
}) => {
    const [amountToBuy, setAmountToBuy] = useState<string | number>(value);

    return (
        <Container>
            <Container.Title color={titleColor} fontSize={titleFontSize}>
                {title}
            </Container.Title>
            <Container.ValueContainer>
                <Container.ValueContainer.Value
                    color={valueColor}
                    fontSize={valueFontSize}
                    value={amountToBuy}
                    onChange={(e) => setAmountToBuy(e.target.value)}
                />
                <Container.ValueContainer.SubValue color={subValueColor} fontSize={subValueFontSize}>
                    {subValue}
                </Container.ValueContainer.SubValue>
            </Container.ValueContainer>
        </Container>
    );
};

export default Input;
