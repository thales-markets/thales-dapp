import { Dialog } from '@material-ui/core';
import styled from 'styled-components';
import { FlexDiv, FlexDivRow } from 'theme/common';
import { ReactComponent as CloseIcon } from 'assets/images/close.svg';
import { withStyles } from '@material-ui/core';

export const StyledModal = withStyles(() => ({
    paper: {
        borderRadius: '23px',
        width: '500px',
        background: 'linear-gradient(150.74deg, rgba(202, 145, 220, 0.6) -7.89%, rgba(106, 193, 213, 0.6) 107.94%);',
        padding: '1px',
        overflow: 'hidden',
    },
}))(Dialog);

export const ModalContainer = styled.div`
    background: #04045a;
    padding: 20px 30px 35px 30px;
    overflow: auto;
    border-radius: 23px;
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
    color: #f6f6fe;
`;

export const ModalSummaryContainer = styled.div`
    padding: 10px;
`;

export const CloseIconContainer = styled(CloseIcon)`
    :hover {
        cursor: pointer;
    }
    @media (max-width: 512px) {
        margin-top: 4px;
        height: 12px;
        width: 12px;
    }
`;
