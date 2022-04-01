import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import { Container, Icon, Text, IconContainer } from './styled-components/components';
import { UI_COLORS } from 'constants/ui';
import { withStyles } from '@material-ui/styles';
import Fade from '@material-ui/core/Fade';

type Tooltips = 'info' | 'warning' | 'success';

type CustomTooltipProps = {
    message: string;
    type: Tooltips;
};

type TooltipContentProps = {
    message: string;
    type: Tooltips;
};

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
};

const ModifiedTooltip = withStyles(() => ({
    arrow: {
        color: '#04045a',
        fontSize: 10,
        '&:before': {
            border: `1px solid ${UI_COLORS.GREEN}`,
        },
    },
    tooltip: {
        backgroundColor: '#04045a',
        maxWidth: 220,
        border: `1px solid ${UI_COLORS.GREEN}`,
        borderRadius: '5px',
    },
}))(Tooltip);

const CustomTooltip: React.FC<CustomTooltipProps> = ({ message, type }) => {
    return (
        <>
            <ModifiedTooltip
                TransitionComponent={Fade}
                title={<TooltipContent message={message} type={type} />}
                placement={'top'}
                arrow
            >
                <IconContainer>
                    <Icon className={icons[type].className} color={UI_COLORS.GREEN} fontSize={'11px'} />
                </IconContainer>
            </ModifiedTooltip>
        </>
    );
};

const TooltipContent: React.FC<TooltipContentProps> = ({ message, type }) => {
    return (
        <Container>
            <Icon className={icons[type].className} color={icons[type].color} fontSize={'11px'} margin={'7px 0'} />
            <Text margin={'0 0 10px 0'}>{message}</Text>
        </Container>
    );
};

export default CustomTooltip;
