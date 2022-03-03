import React from 'react';
import styled from 'styled-components';

type ButtonProps = {
    text: string;
    width?: string;
    height?: string;
    padding?: string;
    active: boolean;
    activeTextColor?: string;
    activeBgColor?: string;
    inactiveTextColor?: string;
    inactiveBgColor?: string;
    hoverShadow?: string;
    margin?: string;
    onClickHandler?: () => void;
};

const Button: React.FC<ButtonProps> = ({
    text,
    width,
    height,
    padding,
    active,
    activeTextColor,
    activeBgColor,
    inactiveTextColor,
    inactiveBgColor,
    hoverShadow,
    margin,
    onClickHandler,
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
            margin={margin}
            onClick={() => (onClickHandler ? onClickHandler() : '')}
        >
            {text}
        </Wrapper>
    );
};

const Wrapper = styled.div<{
    width?: string;
    height?: string;
    padding?: string;
    active: boolean;
    activeTextColor?: string;
    activeBgColor?: string;
    inactiveTextColor?: string;
    inactiveBgColor?: string;
    hoverShadow?: string;
    margin?: string;
}>`
    display: flex;
    align-items: center;
    justify-content: center;
    ${(_props) => (_props?.width ? `width: ${_props.width}` : '')};
    ${(_props) => (_props?.height ? `height: ${_props.height}` : '')};
    border: 1px solid var(--button-bg-active);
    border-radius: 30px;
    font-family: Titillium Regular !important;
    font-weight: 700;
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
        ${(_props) => (_props?.hoverShadow ? `box-shadow:${_props.hoverShadow}` : '')}
    }
`;

export default Button;
