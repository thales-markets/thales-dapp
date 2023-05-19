import React, { CSSProperties } from 'react';
import ReactTooltip from 'rc-tooltip';
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
                />
            )}
        </ReactTooltip>
    );
};

const InfoIcon = styled.i<{ iconFontSize?: number; marginLeft?: number; top?: number; color?: string }>`
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
`;

export default Tooltip;
