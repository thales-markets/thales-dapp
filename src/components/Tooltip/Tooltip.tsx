import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import { Container, Icon, Text, IconContainer, LinkInTooltip } from './styled-components/components';
import Fade from '@material-ui/core/Fade';
import styled from 'styled-components';

type Tooltips = 'info' | 'warning' | 'success' | 'moneyBag';

type CustomTooltipProps = {
    message: string;
    link?: string;
    type: Tooltips;
    iconColor?: string;
    placement?: string;
    container?: {
        alignItems?: string;
        width?: string;
        display?: string;
        position?: string;
    };
    interactive?: boolean;
    iconFontSize?: number;
    iconTop?: number;
};

type TooltipContentProps = {
    message: string;
    type: Tooltips;
    link?: string;
};

type PlacementType =
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';

const icons = {
    info: {
        className: 'v2-icon v2-icon--info',
        color: 'var(--color-white)',
    },
    warning: {
        className: 'v2-icon v2-icon--info',
        color: 'var(--color-white)',
    },
    success: {
        className: 'v2-icon v2-icon--info',
        color: 'var(--color-white)',
    },
    moneyBag: {
        className: 'v2-icon v2-icon--dollar',
        color: 'var(--color-white)',
    },
};

export const ModifiedTooltip = styled((props) => <Tooltip classes={{ popper: props.className }} {...props} />)`
    & .MuiTooltip-arrow {
        &:before {
            border: 1px solid ${(props) => props.theme.borderColor.primary};
        }
        color: ${(props) => props.theme.background.primary};
        font-size: 10px;
    }
    & .MuiTooltip-tooltip {
        background-color: ${(props) => props.theme.background.primary};
        border: 1px solid ${(props) => props.theme.borderColor.primary};
        border-radius: 5px;
        max-width: 220px;
    }
`;

const CustomTooltip: React.FC<CustomTooltipProps> = ({
    message,
    link,
    type,
    iconColor,
    placement,
    container,
    interactive,
    iconFontSize,
    iconTop,
}) => {
    return (
        <>
            <ModifiedTooltip
                TransitionComponent={Fade}
                title={<TooltipContent message={message} type={type} link={link} />}
                placement={placement ? (placement as PlacementType) : 'top'}
                arrow
                interactive={interactive ? true : false}
            >
                <IconContainer
                    alignItems={container?.alignItems}
                    width={container?.width}
                    display={container?.display}
                    position={container?.position}
                >
                    <Icon
                        className={icons[type].className}
                        color={iconColor}
                        fontSize={`${iconFontSize ? iconFontSize : 11}px`}
                        top={`${iconTop ? iconTop : 0}px`}
                    />
                </IconContainer>
            </ModifiedTooltip>
        </>
    );
};

const onLinkClickEvent = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    return false;
};

const TooltipContent: React.FC<TooltipContentProps> = ({ message, type, link }) => {
    return (
        <Container>
            <Icon className={icons[type].className} color={icons[type].color} fontSize={'11px'} margin={'7px 0'} />
            <Text margin={'0 0 10px 0'}>{message}</Text>
            {link && (
                <LinkInTooltip href={link} target="_blank" onClick={onLinkClickEvent}>
                    {link}
                </LinkInTooltip>
            )}
        </Container>
    );
};

export default CustomTooltip;
