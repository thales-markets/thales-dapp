import React from 'react';
import { Dialog } from '@material-ui/core';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { ReactComponent as CloseIcon } from 'assets/images/close.svg';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';

export const StyledModal = withStyles(() => ({
    paper: {
        borderRadius: '23px',
        width: '400px',
        background: 'var(--background)',
        padding: '1px',
        overflow: 'hidden',
    },
}))(Dialog);

export const ModalContainer = styled.div`
    padding: 20px 30px 35px 30px;
    overflow: auto;
    border-radius: 23px;
    font-family: Roboto !important;
    @media (max-width: 512px) {
        padding: 10px;
    }
`;

export const ModalHeader = styled(FlexDivRow)`
    margin-bottom: 20px;
`;

export const ModalTitle = styled(FlexDiv)`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.5px;
    color: var(--primary-color);
`;

export const ModalSummaryContainer = styled.div`
    padding: 10px;
`;

export const CloseIconContainer = styled(CloseIcon)`
    fill: var(--primary-color);
    :hover {
        cursor: pointer;
    }
    @media (max-width: 512px) {
        margin-top: 4px;
        height: 12px;
        width: 12px;
    }
`;

type TooltipIconProps = {
    disableHoverListener?: boolean;
    title: React.ReactNode;
    children: any;
};

const StyledLightTooltip = withStyles(() => ({
    arrow: {
        color: '#6A7FB6',
    },
    tooltip: {
        background: '#6A7FB6',
        borderRadius: '6px',
        padding: '4px 10px',
        fontSize: '10px',
        fontWeight: 600,
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: '#F6F6FE',
    },
}))(MaterialTooltip);

export const SummaryContent = styled.div<{ color?: string }>`
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    text-align: end;
    color: ${(props) => props.color ?? '#f6f6fe'};
`;

export const SummaryItem = styled(FlexDivRow)`
    margin-bottom: 20px;
`;

export const SubmitButtonContainer = styled(FlexDivColumnCentered)`
    margin-top: 40px;
    align-items: center;
`;

export const SummaryLabel = styled.div<{ color?: string }>`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: ${(props) => props.color ?? '#f6f6fe'};
`;

export const LightTooltip: React.FC<TooltipIconProps> = ({ title, children, disableHoverListener }) => (
    <StyledLightTooltip
        disableHoverListener={disableHoverListener}
        title={<span>{title}</span>}
        placement="top"
        arrow={true}
    >
        {children}
    </StyledLightTooltip>
);
