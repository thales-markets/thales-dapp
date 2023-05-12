import React, { useState } from 'react';
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
    subValue?: any;
    subValueColor?: string;
    subValueFontSize?: string;
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
    subValue,
    subValueColor,
    subValueFontSize,
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
                    <SubValue color={subValueColor} fontSize={subValueFontSize}>
                        {subValue}
                    </SubValue>
                </ValueContainer>
                {children}
            </Container>
        </CustomTooltip>
    );
};

const Container = styled.div<{
    disabled?: boolean;
    width?: string;
    height?: string;
    margin?: string;
    padding?: string;
    zIndex?: number;
    isFocused?: boolean;
    isError?: boolean;
}>`
    width: ${(props) => (props.width ? props.width : '100%')};
    margin: ${(props) => (props.margin ? props.margin : '0 0 8px 0')};
    ${(props) => (props.height ? `height: ${props.height};` : '')}
    display: flex;
    flex-direction: column;
    border: 1px solid
        ${(props) =>
            props.isError
                ? props.theme.input.borderColor.error.primary
                : props.isFocused
                ? props.theme.input.borderColor.focus.primary
                : props.theme.input.borderColor.primary};
    border-radius: 10px;
    justify-content: center;
    padding: ${(props) => (props.padding ? props.padding : '5px 10px')};
    box-sizing: border-box;
    position: relative;
    opacity: ${(props) => (props.disabled ? '0.5 !important' : '1')};
    background: transparent;
    ${(props) => (props?.zIndex ? `z-index: ${props.zIndex};` : '')}
`;

const Title = styled.div<{ color?: string; fontSize?: string }>`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-weight: 400;
    margin-bottom: 5px;
    text-transform: uppercase;
    color: ${(props) => (props?.color ? props.color : props.theme.input.borderColor.primary)};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '14px')};
`;

const ValueContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
`;

const Value = styled.input<{ color?: string; fontSize?: string; disabled: boolean }>`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-weight: 400;
    color: ${(props) => (props.color ? props.color : props.theme.input.textColor.primary)};
    font-size: ${(props) => (props.fontSize ? props.fontSize : '18px')};
    text-transform: capitalize;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'initial')};
    background: transparent;
    border: none;
    padding: 0;
    width: 80%;
    &:focus {
        border: none;
        outline: none;
    }
    ::placeholder {
        color: ${(props) => props.theme.input.textColor.secondary};
    }
`;

const SubValue = styled.span<{ color?: string; fontSize?: string }>`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-weight: 400;
    color: ${(props) => (props.color ? props.color : props.theme.input.textColor.primary)};
    font-size: ${(props) => (props.fontSize ? props.fontSize : '18px')};
`;

const CustomTooltip = styled((props) => <Tooltip classes={{ popper: props.className }} {...props} />)`
    & .MuiTooltip-tooltip {
        margin: -10px 0 0 0;
        padding: 2px 8px;
        font-family: ${(props) => props.theme.fontFamily.primary};
        font-weight: 600;
        font-size: 13px;
        line-height: 15px;
        color: ${(props) => props.theme.input.textColor.quaternary};
        background-color: ${(props) => props.theme.background.primary};
    }
`;

export default Input;
