import React, { useState } from 'react';
import { Container, CustomTooltip, SubValue, Title, Value, ValueContainer } from './styled-components/Container';

type InputProps = {
    title?: string;
    titleColor?: string;
    titleFontSize?: string;
    value: string | number | React.ReactNode;
    valueAsComponent?: boolean;
    valueChange?: (value: string | number) => void;
    valueType?: string;
    valueEditDisable?: boolean;
    valueColor?: string;
    valueFontSize?: string;
    subValue?: any;
    subValueColor?: string;
    subValueFontSize?: string;
    disabled?: boolean;
    displayTooltip?: boolean;
    tooltipText?: string;
    container?: {
        width?: string;
        margin?: string;
        padding?: string;
        height?: string;
        borderColor?: string;
        borderStyle?: string;
        background?: string;
        zIndex?: number;
    };
    children?: any;
};

const Input: React.FC<InputProps> = ({
    title,
    titleColor,
    titleFontSize,
    value,
    valueAsComponent,
    valueChange,
    valueType,
    valueEditDisable,
    valueColor,
    valueFontSize,
    subValue,
    subValueColor,
    subValueFontSize,
    disabled,
    displayTooltip,
    tooltipText,
    container,
    children,
}) => {
    const [focus, setFocus] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof valueChange == 'function') {
            valueChange(e.target.value);
        }
    };

    const onFocus = () => {
        setFocus(true);
    };

    const onBlur = () => {
        setFocus(false);
    };

    return (
        <CustomTooltip open={displayTooltip} title={tooltipText ? tooltipText : ''}>
            <Container
                disabled={disabled}
                width={container?.width}
                margin={container?.margin}
                height={container?.height}
                padding={container?.padding}
                background={container?.background}
                borderColor={container?.borderColor}
                borderStyle={container?.borderStyle}
                shadow={focus ? 'var(--button-shadow)' : undefined}
                zIndex={container?.zIndex}
            >
                {title && (
                    <Title color={titleColor} fontSize={titleFontSize}>
                        {title}
                    </Title>
                )}
                <ValueContainer>
                    {valueAsComponent ? (
                        value
                    ) : (
                        <Value
                            color={valueColor}
                            fontSize={valueFontSize}
                            value={typeof value == 'string' || typeof value == 'number' ? value : ''}
                            onChange={handleChange}
                            disabled={valueEditDisable || disabled}
                            type={valueType ? valueType : ''}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            readOnly={typeof handleChange !== 'function' || disabled}
                        />
                    )}
                    <SubValue color={subValueColor} fontSize={subValueFontSize}>
                        {subValue}
                    </SubValue>
                </ValueContainer>
                {children}
            </Container>
        </CustomTooltip>
    );
};

export default Input;
