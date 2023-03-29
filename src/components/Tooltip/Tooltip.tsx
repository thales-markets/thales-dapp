import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import { Container, Icon, Text, IconContainer, LinkInTooltip } from './styled-components/components';
import { UI_COLORS } from 'constants/ui';
import { withStyles } from '@material-ui/styles';
import Fade from '@material-ui/core/Fade';

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
        color: 'var(--primary-color)',
    },
    warning: {
        className: 'v2-icon v2-icon--info',
        color: 'var(--primary-color)',
    },
    success: {
        className: 'v2-icon v2-icon--info',
        color: 'var(--primary-color)',
    },
    moneyBag: {
        className: 'v2-icon v2-icon--dollar',
        color: 'var(--primary-color)',
    },
};

const ModifiedTooltip = withStyles(() => ({
    arrow: {
        color: ' var(--color-primary)',
        fontSize: 10,
        '&:before': {
            border: `1px solid ${UI_COLORS.GREEN}`,
        },
    },
    tooltip: {
        backgroundColor: ' var(--color-primary)',
        maxWidth: 220,
        border: `1px solid ${UI_COLORS.GREEN}`,
        borderRadius: '5px',
    },
}))(Tooltip);

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
