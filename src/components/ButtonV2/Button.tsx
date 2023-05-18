import React, { CSSProperties } from 'react';
import styled from 'styled-components';

type ButtonProps = {
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    textColor?: string;
    backgroundColor?: string;
    hoverShadow?: boolean;
    hoverBorder?: boolean;
    onClick?: () => void;
    fontSize?: string;
    disabled?: boolean;
    additionalStyles?: CSSProperties;
    children?: any;
};

const Button: React.FC<ButtonProps> = ({
    width,
    height,
    padding,
    textColor,
    backgroundColor,
    hoverShadow,
    hoverBorder,
    margin,
    onClick,
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
            margin={margin}
            textColor={textColor}
            backgroundColor={backgroundColor}
            hoverShadow={hoverShadow}
            hoverBorder={hoverBorder}
            onClick={onClick}
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
    margin?: string;
    textColor?: string;
    backgroundColor?: string;
    hoverShadow?: boolean;
    hoverBorder?: boolean;
    disabled?: boolean;
    fontSize?: string;
}>`
    display: flex;
    text-transform: uppercase;
    align-items: center;
    justify-content: center;
    width: ${(props) => props.width || ''};
    height: ${(props) => props.height || ''};
    border: 1px solid ${(props) => props.theme.button.background.primary};
    border-radius: 30px;
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-weight: 700;
    font-size: ${(props) => props.fontSize || '20px'};
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
    color: ${(props) => props.textColor || props.theme.button.textColor.primary};
    background-color: ${(props) => props.backgroundColor || props.theme.button.background.primary};
    margin: ${(props) => (props.margin ? props.margin : '')};
    padding: ${(props) => (props.padding ? props.padding : '0 20px')};
    &:hover {
        ${(props) =>
            props.hoverShadow && !props.disabled ? `box-shadow: ${props.theme.button.borderColor.primary}` : ''}
        ${(props) =>
            props.hoverBorder && !props.disabled ? `border: ${props.theme.button.borderColor.secondary}` : ''}
    }
    &:disabled {
        opacity: 0.5;
    }
`;

export default Button;
