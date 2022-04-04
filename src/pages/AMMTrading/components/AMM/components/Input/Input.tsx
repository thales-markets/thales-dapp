import React, { useState } from 'react';
import Container from './styled-components/Container';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';
import { TooltipStyles } from 'constants/ui';

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
    borderColor?: string;
    displayTooltip?: boolean;
    tooltipText?: string;
    container?: {
        width?: string;
        margin?: string;
        padding?: string;
        height?: string;
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
    borderColor,
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
                borderColor={borderColor}
                disabled={disabled}
                width={container?.width}
                margin={container?.margin}
                height={container?.height}
                padding={container?.padding}
                shadow={focus ? 'var(--button-shadow)' : undefined}
            >
                {title && (
                    <Container.Title color={titleColor} fontSize={titleFontSize}>
                        {title}
                    </Container.Title>
                )}
                <Container.ValueContainer>
                    {valueAsComponent ? (
                        value
                    ) : (
                        <Container.ValueContainer.Value
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
                    <Container.ValueContainer.SubValue color={subValueColor} fontSize={subValueFontSize}>
                        {subValue}
                    </Container.ValueContainer.SubValue>
                </Container.ValueContainer>
                {children}
            </Container>
        </CustomTooltip>
    );
};

const CustomTooltip = withStyles(() => ({
    tooltip: {
        minWidth: '100%',
        width: '100%',
        margin: '0',
        backgroundColor: TooltipStyles.error.backgroundColor,
        color: TooltipStyles.error.color,
        fontSize: TooltipStyles.error.fontSize,
    },
}))(Tooltip);

export default Input;
