import { TableCell, withStyles } from '@material-ui/core';
import styled from 'styled-components';
import { Button, Image } from 'theme/common';

export const Row = styled.tr`
    height: 1px;
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
`;

export const PhaseLabel = styled(Button)`
    border-radius: 15px;
    width: 135px;
    text-transform: uppercase !important;
    height: 40px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.25px;
    color: #04045a !important;
    &.bidding {
        background: #ffd951;
    }
    &.trading {
        background: #4fbf67;
    }
    &.maturity {
        background: #355dff;
    }
    &.expiry {
        background: #c62937;
    }
`;

export const StyledTableCell = withStyles(() => ({
    head: {
        position: 'relative',
        border: 'none',
        background: '#127',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '16px',
        letterSpacing: ' 0.5px',
        color: '#748BC6',
        cursor: 'pointer',
        '&:first-child': {
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
        },
        '&:last-child': {
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
        },
    },
    body: {
        border: 'none',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: ' 0.25px',
        color: '#F6F6FE',
        '&:first-child': {
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
        },
        '&:last-child': {
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px',
        },
    },
}))(TableCell);

export const ArrowsWrapper = styled.span`
    display: inline-block;
    vertical-align: middle;
    margin-top: 1px;
`;

export const Arrow = styled(Image)`
    display: block;
    width: 10px;
    padding: 2px;
    box-sizing: content-box;
    &.selected {
    }
`;
