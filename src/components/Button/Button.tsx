import React from 'react';
import styled from 'styled-components';

type ButtonProps = {
    width?: string;
    height?: string;
    padding?: string;
    active?: boolean;
    activeTextColor?: string;
    activeBgColor?: string;
    inactiveTextColor?: string;
    inactiveBgColor?: string;
    hoverShadow?: string;
    hoverBorderEffect?: boolean;
    margin?: string;
    onClickHandler?: () => void;
    fontSize?: string;
    disabled?: boolean;
    children?: any;
};

const Button: React.FC<ButtonProps> = ({
    width,
    height,
    padding,
    active,
    activeTextColor,
    activeBgColor,
    inactiveTextColor,
    inactiveBgColor,
    hoverShadow,
    hoverBorderEffect,
    margin,
    onClickHandler,
    disabled,
    fontSize,
    children,
}) => {
    return (
        <Wrapper
            width={width}
            height={height}
            padding={padding}
            active={active}
            activeTextColor={activeTextColor}
            activeBgColor={activeBgColor}
            inactiveTextColor={inactiveTextColor}
            inactiveBgColor={inactiveBgColor}
            hoverShadow={hoverShadow}
            hoverBorderEffect={hoverBorderEffect}
            margin={margin}
            onClick={() => (onClickHandler ? onClickHandler() : '')}
            disabled={disabled}
            fontSize={fontSize}
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
    activeBgColor?: string;
    inactiveTextColor?: string;
    inactiveBgColor?: string;
    hoverShadow?: string;
    hoverBorderEffect?: boolean;
    margin?: string;
    disabled?: boolean;
    fontSize?: string;
}>`
    display: flex;
    text-transform: uppercase;
    align-items: center;
    justify-content: center;
    ${(_props) => (_props?.width ? `width: ${_props.width}` : '')};
    ${(_props) => (_props?.height ? `height: ${_props.height}` : '')};
    border: 1px solid var(--button-bg-active);
    border-radius: 30px;
    font-family: Roboto !important;
    font-weight: 700;
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '')};
    cursor: pointer;
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
    ${(_props) => (_props?.margin ? `margin: ${_props.margin}` : '')};
    ${(_props) => (_props?.padding ? `padding: ${_props.padding}` : '')};
    &:hover {
        ${(_props) => (_props?.hoverShadow && !_props?.disabled ? `box-shadow:${_props.hoverShadow}` : '')}
        ${(_props) => (_props?.hoverBorderEffect && !_props?.disabled ? `border:var(--primary-color)` : '')}
    }
    &:disabled {
        opacity: 0.6;
    }
`;

export default Button;
