import React, { CSSProperties } from 'react';
import styled from 'styled-components';

type ButtonProps = {
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    textColor?: string;
    backgroundColor?: string;
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
    hoverShadow?: string;
    hoverBorder?: boolean;
    fontSize?: string;
}>`
    display: flex;
    text-transform: uppercase;
    align-items: center;
    justify-content: center;
    width: ${(props) => props.width || 'auto'};
    min-height: ${(props) => props.height || '34px'};
    border: 1px solid ${(props) => props.backgroundColor || props.theme.button.background.primary};
    border-radius: 30px;
    font-weight: 700;
    font-size: ${(props) => props.fontSize || '18px'};
    cursor: pointer;
    color: ${(props) => props.textColor || props.theme.button.textColor.primary};
    background-color: ${(props) => props.backgroundColor || props.theme.button.background.primary};
    margin: ${(props) => props.margin || ''};
    padding: ${(props) => props.padding || '0 30px'};
    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

export default Button;
