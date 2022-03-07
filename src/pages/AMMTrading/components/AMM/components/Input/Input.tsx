import React from 'react';
import Container from './styled-components/Container';
import Tooltip from '@material-ui/core/Tooltip';

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
    borderColor?: string;
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
    borderColor,
    displayTooltip,
    tooltipText,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof valueChange == 'function') {
            valueChange(e.target.value);
        }
    };

    return (
        <Tooltip open={displayTooltip} title={tooltipText ? tooltipText : ''}>
            <Container borderColor={borderColor}>
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
        </Tooltip>
    );
};

export default Input;
