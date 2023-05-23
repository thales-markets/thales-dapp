import { ThemeMap } from 'constants/ui';
import React, { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import { getTheme } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';

export enum ButtonType {
    default = 'default',
    submit = 'submit',
    label = 'label',
    popup = 'popup',
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
    hoverShadow?: string;
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
    const themeName = useSelector((state: RootState) => getTheme(state));
    const theme = ThemeMap[themeName];

    let typedWidth: string;
    let typedHeight: string;
    let typedPadding: string;
    let typedMargin: string;
    let typedFontSize: string;
    let typedFontWeight: string;
    let typedMinHeight: string;
    let typedActiveBg: string;
    let typedActiveBgColor: string;
    let typedActiveTextColor: string;
    let typedInactiveBgColor: string;
    let typedInactiveTextColor: string;

    switch (type) {
        case ButtonType.default:
            typedWidth = '100%';
            typedHeight = '30px';
            typedPadding = '5px 40px';
            typedMargin = '';
            typedFontSize = '15px';
            typedFontWeight = '700';
            typedMinHeight = '30px';
            typedActiveBg = '';
            typedActiveBgColor = 'var(--color-highlight)';
            typedActiveTextColor = ' var(--color-primary)';
            typedInactiveBgColor = '#00000000';
            typedInactiveTextColor = 'var(--color-highlight)';
            break;
        case ButtonType.submit:
            typedWidth = '100%';
            typedHeight = '';
            typedPadding = '5px 15px';
            typedMargin = '0';
            typedFontSize = '20px';
            typedFontWeight = '700';
            typedMinHeight = '36px';
            typedActiveBg = theme.button.background.primary;
            typedActiveBgColor = theme.button.background.primary;
            typedActiveTextColor = theme.button.textColor.primary;
            typedInactiveBgColor = theme.button.background.primary;
            typedInactiveTextColor = theme.button.textColor.primary;
            break;
        case ButtonType.label:
            typedWidth = '';
            typedHeight = '20px';
            typedPadding = '';
            typedMargin = '2px 0 2px 4px';
            typedFontSize = '10px';
            typedFontWeight = '500';
            typedMinHeight = '15px';
            typedActiveBg = 'linear-gradient(-20deg,#801BF2 0%,#464DCF 100%)';
            typedActiveBgColor = '';
            typedActiveTextColor = 'var(--color-white)';
            typedInactiveBgColor = '';
            typedInactiveTextColor = '#f6f6fe';
            break;
        case ButtonType.popup:
            typedWidth = '100%';
            typedHeight = '';
            typedPadding = '';
            typedMargin = '0 0 0 auto';
            typedFontSize = '14px';
            typedFontWeight = '700';
            typedMinHeight = '36px';
            typedActiveBg = theme.button.background.primary;
            typedActiveBgColor = '';
            typedActiveTextColor = theme.button.textColor.primary;
            typedInactiveBgColor = theme.button.background.primary;
            typedInactiveTextColor = '';
            break;
        default:
            typedWidth = '';
            typedHeight = '';
            typedPadding = '';
            typedMargin = '';
            typedFontSize = '';
            typedFontWeight = '700';
            typedMinHeight = '';
            typedActiveBg = '';
            typedActiveBgColor = theme.button.background.primary;
            typedActiveTextColor = theme.button.textColor.primary;
            typedInactiveBgColor = theme.button.background.primary;
            typedInactiveTextColor = theme.button.textColor.primary;
    }

    return (
        <Wrapper
            width={width ? width : typedWidth}
            height={height ? height : typedHeight}
            padding={padding ? padding : typedPadding}
            active={active}
            activeTextColor={activeTextColor ? activeTextColor : typedActiveTextColor}
            activeBg={activeBg ? activeBg : typedActiveBg}
            activeBgColor={activeBgColor ? activeBgColor : typedActiveBgColor}
            inactiveTextColor={inactiveTextColor ? inactiveTextColor : typedInactiveTextColor}
            inactiveBgColor={inactiveBgColor ? inactiveBgColor : typedInactiveBgColor}
            hoverBorderEffect={hoverBorderEffect}
            margin={margin ? margin : typedMargin}
            onClick={() => (onClickHandler ? onClickHandler() : '')}
            onMouseOver={() => (onMouseOverHandler ? onMouseOverHandler() : '')}
            onMouseOut={() => (onMouseOutHandler ? onMouseOutHandler() : '')}
            disabled={disabled}
            fontSize={fontSize ? fontSize : typedFontSize}
            fontWeight={typedFontWeight}
            style={{
                ...additionalStyles,
                minHeight: additionalStyles?.minHeight ? additionalStyles?.minHeight : typedMinHeight,
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
    ${(props) => (props?.width ? `width: ${props.width}` : '')};
    ${(props) => (props?.height ? `height: ${props.height}` : '')};
    border: ${(props) => (props?.activeBg ? '0' : '1px solid var(--color-highlight)')};
    border-radius: 30px;
    font-weight: ${(props) => props?.fontWeight};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '')};
    cursor: ${(props) => (props?.disabled ? 'not-allowed' : 'pointer')};
    color: ${(props) => (props?.active ? props.activeTextColor : props.inactiveTextColor)};
    background-color: ${(props) => (props?.active ? props.activeBgColor : props.inactiveBgColor)};
    ${(props) => (props.activeBg ? `background: ${props.activeBg}` : '')};
    ${(props) => (props?.margin ? `margin: ${props.margin}` : '')};
    ${(props) => (props?.padding ? `padding: ${props.padding}` : '')};
    &:disabled {
        opacity: 0.6;
    }
`;

export default Button;
