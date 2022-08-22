import React, { CSSProperties } from 'react';
import styled from 'styled-components';

export enum ButtonType {
    default = 'default',
    submit = 'submit',
    label = 'label',
}

type ButtonProps = {
    width?: string;
    height?: string;
    padding?: string;
    active?: boolean;
    activeTextColor?: string;
    activeBg?: string;
    activeBgColor?: string;
    inactiveTextColor?: string;
    inactiveBgColor?: string;
    hoverShadow?: boolean;
    hoverBorderEffect?: boolean;
    margin?: string;
    onClickHandler?: () => void;
    onMouseOverHandler?: () => void;
    onMouseOutHandler?: () => void;
    fontSize?: string;
    disabled?: boolean;
    additionalStyles?: CSSProperties;
    children?: any;
    type?: ButtonType;
};

const Button: React.FC<ButtonProps> = ({
    width,
    height,
    padding,
    active,
    activeTextColor,
    activeBg,
    activeBgColor,
    inactiveTextColor,
    inactiveBgColor,
    hoverBorderEffect,
    hoverShadow,
    margin,
    onClickHandler,
    onMouseOverHandler,
    onMouseOutHandler,
    disabled,
    fontSize,
    additionalStyles,
    children,
    type = ButtonType.default,
}) => {
    const defaultWidth = width ? width : type === ButtonType.submit ? '90%' : width;
    const defaultHeight = height
        ? height
        : type === ButtonType.default
        ? '32px'
        : type === ButtonType.label
        ? '20px'
        : height;
    const defaultPadding = padding ? padding : type === ButtonType.submit ? '5px 15px' : padding;
    const defaultMargin = type === ButtonType.submit ? '0 10px' : type === ButtonType.label ? '2px 0 2px 4px' : margin;
    const defaultFontSize = type === ButtonType.submit ? '20px' : type === ButtonType.label ? '10px' : fontSize;
    const defaultFontWeight = type === ButtonType.label ? '500' : undefined;
    const defaultMinHeight =
        type === ButtonType.submit || type === ButtonType.default
            ? '32px'
            : type === ButtonType.label
            ? '15px'
            : additionalStyles?.minHeight;

    const defaultActivBg = type === ButtonType.label ? 'linear-gradient(-20deg,#801BF2 0%,#464DCF 100%);' : activeBg;
    const defaultActiveTextColor = type === ButtonType.label ? '#ffffff' : activeTextColor;

    return (
        <Wrapper
            width={defaultWidth}
            height={defaultHeight}
            padding={defaultPadding}
            active={active}
            activeTextColor={defaultActiveTextColor}
            activeBg={defaultActivBg}
            activeBgColor={activeBgColor}
            inactiveTextColor={inactiveTextColor}
            inactiveBgColor={inactiveBgColor}
            hoverShadow={hoverShadow ?? true ? 'var(--button-shadow)' : ''}
            hoverBorderEffect={hoverBorderEffect}
            margin={defaultMargin}
            onClick={() => (onClickHandler ? onClickHandler() : '')}
            onMouseOver={() => (onMouseOverHandler ? onMouseOverHandler() : '')}
            onMouseOut={() => (onMouseOutHandler ? onMouseOutHandler() : '')}
            disabled={disabled}
            fontSize={defaultFontSize}
            fontWeight={defaultFontWeight}
            style={{
                ...additionalStyles,
                minHeight: defaultMinHeight,
            }}
        >
            {children}
        </Wrapper>
    );
};

const Wrapper = styled.button<{
    width?: string;
    height?: string;
    padding?: string;
    active?: boolean;
    activeTextColor?: string;
    activeBg?: string;
    activeBgColor?: string;
    inactiveTextColor?: string;
    inactiveBgColor?: string;
    hoverShadow?: string;
    hoverBorderEffect?: boolean;
    margin?: string;
    disabled?: boolean;
    fontSize?: string;
    fontWeight?: string;
}>`
    display: flex;
    text-transform: uppercase;
    align-items: center;
    justify-content: center;
    ${(_props) => (_props?.width ? `width: ${_props.width}` : '')};
    ${(_props) => (_props?.height ? `height: ${_props.height}` : '')};
    ${(_props) => (_props?.activeBg ? 'border: 0' : 'border: 1px solid var(--button-bg-active)')};
    border-radius: 30px;
    font-family: Roboto !important;
    font-weight: ${(_props) => (_props?.fontWeight ? _props.fontWeight : '700')};
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '')};
    cursor: ${(_props) => (_props?.disabled ? 'not-allowed' : 'pointer')};
    color: ${(_props) =>
        _props?.active
            ? _props.activeTextColor
                ? _props.activeTextColor
                : 'var(--button-text-active)'
            : _props.inactiveTextColor
            ? _props.inactiveTextColor
            : 'var(--button-text-inactive)'};
    background-color: ${(_props) =>
        _props?.active
            ? _props.activeBgColor
                ? _props.activeBgColor
                : 'var(--button-bg-active)'
            : _props.inactiveBgColor
            ? _props.inactiveBgColor
            : 'var(--button-bg-inactive)'};
    ${(_props) => (_props?.active && _props.activeBg ? `background:${_props.activeBg}` : '')};
    ${(_props) => (_props?.margin ? `margin: ${_props.margin}` : '')};
    ${(_props) => (_props?.padding ? `padding: ${_props.padding}` : '')};
    &:hover {
        ${(_props) => (_props?.hoverShadow && !_props?.disabled ? `box-shadow:${_props.hoverShadow}` : '')}
        ${(_props) => (_props?.hoverBorderEffect && !_props?.disabled ? `border:var(--primary-color)` : '')}
        ${(_props) => (_props?.active && _props.activeBg ? `background: #7119e1` : '')};
    }
    &:disabled {
        opacity: 0.6;
    }
`;

export default Button;
