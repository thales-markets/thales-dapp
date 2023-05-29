import { ScreenSizeBreakpoint } from 'constants/ui';
import React from 'react';
import styled from 'styled-components';

type LabelProps = {
    firstLabel?: string;
    secondLabel?: string;
    fontSize?: string;
};

type SwitchProps = {
    active: boolean;
    disabled?: boolean;
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
    label?: LabelProps;
    margin?: string;
    spanColumns?: number;
    circlePosition?: string;
};

type SwitchContainerProps = {
    disabled?: boolean;
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
    circlePosition?: string;
};

const defaultSwitchHeight = 28;

const SwitchInput: React.FC<SwitchProps> = ({
    active,
    disabled,
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
    label,
    margin,
    spanColumns,
    circlePosition,
}) => {
    return (
        <Wrapper margin={margin} disabled={disabled} spanColumns={spanColumns}>
            {label?.firstLabel && <Label fontSize={label?.fontSize}>{label.firstLabel}</Label>}
            <SwitchContainer
                disabled={disabled}
                borderWidth={borderWidth}
                borderColor={borderColor}
                width={width}
                height={height}
                background={background}
                backgroundGradient={backgroundGradient}
                onClick={() => (!disabled && handleClick ? handleClick() : null)}
            >
                <Circle
                    active={active}
                    size={dotSize}
                    background={dotBackground}
                    backgroundGradient={dotGradient}
                    circlePosition={circlePosition}
                />
            </SwitchContainer>
            {label?.secondLabel && <Label fontSize={label?.fontSize}>{label.secondLabel}</Label>}
        </Wrapper>
    );
};

const Wrapper = styled.div<{ margin?: string; disabled?: boolean; spanColumns?: number }>`
    ${(props) => (props?.margin ? `margin: ${props.margin}` : '')};
    opacity: ${(props: any) => (props.disabled ? '0.4' : '1')};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    cursor: ${(props: any) => (props.disabled ? 'not-allowed' : 'default')};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        ${(props) => (props?.spanColumns ? `grid-column: span ${props.spanColumns}` : '')};
    }
`;

const Label = styled.span<{ fontSize?: string }>`
    font-size: ${(props) => props.fontSize || '12px'};
    color: ${(props) => props.theme.textColor.primary};
    margin-left: 5px;
    margin-right: 5px;
`;

const SwitchContainer = styled.div<SwitchContainerProps>`
    display: flex;
    align-items: center;
    position: relative;
    cursor: ${(props: any) => (props.disabled ? 'not-allowed' : 'pointer')};
    border-width: ${(props: any) => props.borderWidth || '1px'};
    border-style: solid;
    border-color: ${(props: any) => props.borderColor || props.theme.borderColor.secondary};
    border-radius: 30px;
    width: ${(props: any) => props.width || defaultSwitchHeight * 2.18 + 'px'};
    height: ${(props: any) => props.height || defaultSwitchHeight + 'px'};
`;

const Circle = styled.div<CircleProps>`
    width: ${(props: any) => props.size || '15px'};
    height: ${(props: any) => props.size || '15px'};
    border-radius: 60%;
    position: absolute;
    background-color: ${(props: any) => props.background || props.theme.background.tertiary};
    ${(props: any) =>
        props?.active ? `right: ${props.circlePosition || '5px'};` : `left: ${props.circlePosition || '5px'};`};
`;

export default SwitchInput;
