import React from 'react';
import styled from 'styled-components';

type SwitchProps = {
    active: boolean;
    handleClick?: () => void;
    width?: string;
    height?: string;
    borderWidth?: string;
    borderColor?: string;
    background?: string;
    backgroundGradient?: boolean;
    dotSize?: string;
    dotBackground?: string;
    dotGradient?: boolean;
};

type SwitchContainerProps = {
    handleClick?: () => void;
    borderWidth?: string;
    borderColor?: string;
    width?: string;
    height?: string;
    background?: string;
    backgroundGradient?: boolean;
};

type CircleProps = {
    active: boolean;
    size?: string;
    background?: string;
    backgroundGradient?: boolean;
};

const defaultSwitchHeight = 28;

const Switch: React.FC<SwitchProps> = ({
    active,
    handleClick,
    width,
    height,
    borderWidth,
    borderColor,
    background,
    backgroundGradient,
    dotSize,
    dotBackground,
    dotGradient,
}) => {
    return (
        <SwitchContainer
            borderWidth={borderWidth}
            borderColor={borderColor}
            width={width}
            height={height}
            background={background}
            backgroundGradient={backgroundGradient}
            onClick={() => (handleClick ? handleClick() : null)}
        >
            <Circle active={active} size={dotSize} background={dotBackground} backgroundGradient={dotGradient} />
        </SwitchContainer>
    );
};

const SwitchContainer = styled.div<SwitchContainerProps>`
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    border-width: ${(props: any) => (props?.borderWidth ? props.borderWidth : '1px')};
    border-style: solid;
    border-color: ${(props: any) => (props?.borderColor ? props.borderColor : '#64D9FE')};
    border-radius: 30px;
    width: ${(props: any) => (props?.width ? props.width : defaultSwitchHeight * 2.18 + 'px')};
    height: ${(props: any) => (props?.height ? props.height : defaultSwitchHeight + 'px')};
`;

const Circle = styled.div<CircleProps>`
    width: ${(props: any) => (props.size ? props.size : '15px')};
    height: ${(props: any) => (props.size ? props.size : '15px')};
    border-radius: 60%;
    position: absolute;
    ${(props: any) =>
        props?.backgroundGradient
            ? props?.background
                ? `background-color: ${props.background}`
                : `background-color: #64D9FE`
            : `background-color: #64D9FE`};
    ${(props: any) => (props?.active ? `right: 5px;` : `left: 5px;`)};
`;

export default Switch;
