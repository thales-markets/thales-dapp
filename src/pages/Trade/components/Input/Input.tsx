import React, { useState } from 'react';
import { Container, Title, Value, ValueContainer } from './styled-components/Container';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';

type InputProps = {
    title?: string;
    titleColor?: string;
    titleFontSize?: string;
    placeholder?: string;
    value: string | number | React.ReactNode;
    valueAsComponent?: boolean;
    valueChange?: (value: string | number) => void;
    valueType?: string;
    valueEditDisable?: boolean;
    valueColor?: string;
    valueFontSize?: string;
    disabled?: boolean;
    showError?: boolean;
    errorMessage?: string;
    container?: {
        width?: string;
        height?: string;
        margin?: string;
        padding?: string;
        zIndex?: number;
    };
    children?: any;
};

const Input: React.FC<InputProps> = ({
    title,
    titleColor,
    titleFontSize,
    placeholder,
    value,
    valueAsComponent,
    valueChange,
    valueType,
    valueEditDisable,
    valueColor,
    valueFontSize,
    disabled,
    showError,
    errorMessage,
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
        <CustomTooltip open={showError} title={errorMessage ? errorMessage : ''} placement="bottom">
            <Container
                disabled={disabled}
                width={container?.width}
                height={container?.height}
                margin={container?.margin}
                padding={container?.padding}
                isFocused={focus}
                isError={showError}
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
                            placeholder={placeholder}
                            onChange={handleChange}
                            disabled={!!valueEditDisable || !!disabled}
                            type={valueType ? valueType : ''}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            readOnly={typeof handleChange !== 'function' || disabled}
                        />
                    )}
                </ValueContainer>
                {children}
            </Container>
        </CustomTooltip>
    );
};

const CustomTooltip = styled((props) => <Tooltip classes={{ popper: props.className }} {...props} />)`
    & .MuiTooltip-tooltip {
        margin: -12px 0 0 0;
        font-family: ${(props) => props.theme.fontFamily};
        font-weight: 600;
        font-size: 13px;
        line-height: 15px;
        color: ${(props) => props.theme.input.textColor.quaternary};
        background-color: ${(props) => props.theme.background.primary};
    }
`;

export default Input;
