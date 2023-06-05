import { ScreenSizeBreakpoint } from 'enums/ui';
import ReactTooltip from 'rc-tooltip';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import 'theme/tooltip.css';

type TooltipProps = {
    component?: any;
    overlay: any;
    iconFontSize?: number;
    customIconStyling?: CSSProperties;
    overlayInnerStyle?: CSSProperties;
    marginLeft?: number;
    top?: number;
    overlayClassName?: string;
    iconColor?: string;
    mobileIconFontSize?: number;
};

const Tooltip: React.FC<TooltipProps> = ({
    overlay,
    iconFontSize,
    customIconStyling,
    overlayInnerStyle,
    marginLeft,
    top,
    overlayClassName,
    iconColor,
    children,
    mobileIconFontSize,
}) => {
    return (
        <ReactTooltip
            overlay={overlay}
            placement="top"
            overlayClassName={overlayClassName || ''}
            overlayInnerStyle={overlayInnerStyle}
        >
            {children ? (
                (children as any)
            ) : (
                <InfoIcon
                    color={iconColor}
                    iconFontSize={iconFontSize}
                    marginLeft={marginLeft}
                    top={top}
                    style={customIconStyling}
                    mobileIconFontSize={mobileIconFontSize}
                />
            )}
        </ReactTooltip>
    );
};

const InfoIcon = styled.i<{
    iconFontSize?: number;
    marginLeft?: number;
    top?: number;
    color?: string;
    mobileIconFontSize?: number;
}>`
    font-size: ${(props) => props.iconFontSize || 15}px;
    font-weight: normal;
    cursor: pointer;
    position: relative;
    margin-left: ${(props) => props.marginLeft || 4}px;
    top: ${(props) => props.top || 0}px;
    color: ${(props) => props.color || 'white'};
    &:before {
        font-family: ThalesIcons !important;
        content: '\\0043';
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: ${(props) =>
            props.mobileIconFontSize ? props.mobileIconFontSize : props.iconFontSize ? props.iconFontSize : 15}px;
    }
`;

export default Tooltip;
