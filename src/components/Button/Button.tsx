import React, { CSSProperties } from 'react';
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
    additionalStyles?: CSSProperties;
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
    additionalStyles,
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
            style={additionalStyles}
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
    ${(props) => (props?.width ? `width: ${props.width}` : '')};
    ${(props) => (props?.height ? `height: ${props.height}` : '')};
    border: 1px solid var(--button-bg-active);
    border-radius: 30px;
    font-weight: 700;
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '')};
    cursor: ${(props) => (props?.disabled ? 'not-allowed' : 'pointer')};
    color: ${(props) =>
        props?.active
            ? props.activeTextColor
                ? props.activeTextColor
                : 'var(--button-text-active)'
            : props.inactiveTextColor
            ? props.inactiveTextColor
            : 'var(--button-text-inactive)'};
    background-color: ${(props) =>
        props?.active
            ? props.activeBgColor
                ? props.activeBgColor
                : 'var(--button-bg-active)'
            : props.inactiveBgColor
            ? props.inactiveBgColor
            : 'var(--button-bg-inactive)'};
    ${(props) => (props?.margin ? `margin: ${props.margin}` : '')};
    ${(props) => (props?.padding ? `padding: ${props.padding}` : '')};
    &:hover {
        ${(props) => (props?.hoverShadow && !props?.disabled ? `box-shadow:${props.hoverShadow}` : '')}
        ${(props) => (props?.hoverBorderEffect && !props?.disabled ? `border:var(--color-white)` : '')}
    }
    &:disabled {
        opacity: 0.6;
    }
`;

export default Button;
